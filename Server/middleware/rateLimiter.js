import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { rateLimitConfig, slowDownConfig } from "../config/rateLimiter.js";

// Create rate limiter with custom configuration
export const createRateLimiter = (configType = "general", customConfig = {}) => {
	const config = {
		...rateLimitConfig[configType],
		...customConfig,
	};

	return rateLimit({
		...config,
		keyGenerator: (req) => {
			// Use IP address as default key
			let key = req.ip || req.connection?.remoteAddress;

			// For authenticated users, use user ID + IP for better tracking
			if (req.user && req.user.id) {
				key = `${req.user.id}:${key}`;
			}

			return key;
		},

		// Custom error handler
		handler: (req, res) => {
			const retryAfter = Math.round(config.windowMs / 1000);

			res.status(429).json({
				success: false,
				error: config.message.error,
				message: config.message.message,
				retryAfter: retryAfter,
				retryAfterHuman: config.message.retryAfter,
				limit: config.max,
				windowMs: config.windowMs,
				timestamp: new Date().toISOString(),
			});
		},

		// Skip certain requests based on conditions
		skip: (req) => {
			// Skip rate limiting for health checks
			if (req.path === "/health" || req.path === "/api/health") {
				return true;
			}

			// Skip for trusted IPs (add your server IPs here)
			const trustedIPs = ["127.0.0.1", "::1"];
			if (trustedIPs.includes(req.ip)) {
				return true;
			}

			return false;
		},

		// Store rate limit data (can be extended with Redis)
		store: undefined, // Uses default MemoryStore (extend with Redis for production)
	});
};

// Create slow down middleware
export const createSlowDown = (customConfig = {}) => {
	return slowDown({
		...slowDownConfig,
		...customConfig,
		keyGenerator: (req) => {
			let key = req.ip || req.connection?.remoteAddress;
			if (req.user && req.user.id) {
				key = `${req.user.id}:${key}`;
			}
			return key;
		},
	});
};

// Predefined rate limiters for different endpoint types
export const generalLimiter = createRateLimiter("general");
export const authLimiter = createRateLimiter("auth");
export const quizLimiter = createRateLimiter("quiz");
export const uploadLimiter = createRateLimiter("upload");
export const publicLimiter = createRateLimiter("public");
export const adminLimiter = createRateLimiter("admin");

// Progressive slow down middleware
export const progressiveSlowDown = createSlowDown();

// Strict rate limiter for sensitive operations
export const strictLimiter = createRateLimiter("auth", {
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 3, // 3 attempts only
	message: {
		error: "Too many attempts",
		message: "Account temporarily locked due to suspicious activity",
		retryAfter: "5 minutes",
	},
});


