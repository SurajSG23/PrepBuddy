import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";

let redisClient = null;
let rateLimiters = {};

// Initialize Redis connection (only if Redis is available)
export const initializeRedis = () => {
	try {
		if (process.env.REDIS_URL) {
			redisClient = new Redis(process.env.REDIS_URL, {
				enableOfflineQueue: false,
				maxRetriesPerRequest: 1,
			});

			redisClient.on("connect", () => {
				console.log("✅ Redis connected for rate limiting");
			});

			redisClient.on("error", (err) => {
				console.error("❌ Redis connection error:", err.message);
				redisClient = null; // Fall back to memory store
			});

			// Create Redis-based rate limiters
			rateLimiters = {
				general: new RateLimiterRedis({
					storeClient: redisClient,
					keyPrefix: "rl_general",
					points: 100, // Number of requests
					duration: 900, // Per 15 minutes (900 seconds)
				}),
				auth: new RateLimiterRedis({
					storeClient: redisClient,
					keyPrefix: "rl_auth",
					points: 5,
					duration: 900,
				}),
				quiz: new RateLimiterRedis({
					storeClient: redisClient,
					keyPrefix: "rl_quiz",
					points: 50,
					duration: 600, // 10 minutes
				}),
			};
		}
	} catch (error) {
		console.error("❌ Failed to initialize Redis:", error.message);
		redisClient = null;
	}
};

// Redis-based rate limiter middleware
export const createRedisRateLimiter = (limiterType = "general") => {
	return async (req, res, next) => {
		if (!redisClient || !rateLimiters[limiterType]) {
			return next(); // Fall back to express-rate-limit
		}

		try {
			const key = req.ip || req.connection?.remoteAddress;
			await rateLimiters[limiterType].consume(key);
			next();
		} catch (rejRes) {
			const totalHits = rejRes.totalHits || 0;
			const retryAfter = Math.round(rejRes.msBeforeNext / 1000) || 1;

			res.status(429).json({
				success: false,
				error: "Rate limit exceeded",
				message: "Too many requests, please try again later",
				retryAfter: retryAfter,
				totalRequests: totalHits,
				timestamp: new Date().toISOString(),
			});
		}
	};
};


