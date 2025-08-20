import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

// Rate limiting configuration for different endpoint types
export const rateLimitConfig = {
	// General API rate limiting
	general: {
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
		message: {
			error: "Too many requests from this IP",
			message: "Please try again later",
			retryAfter: "15 minutes",
		},
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	},

	// Authentication endpoints (more restrictive)
	auth: {
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 5, // limit each IP to 5 login attempts per 15 minutes
		message: {
			error: "Too many authentication attempts",
			message: "Account temporarily locked. Please try again later",
			retryAfter: "15 minutes",
		},
		skipSuccessfulRequests: true, // Don't count successful requests
		skipFailedRequests: false, // Count failed requests
	},

	// Quiz/Test endpoints (moderate limiting)
	quiz: {
		windowMs: 10 * 60 * 1000, // 10 minutes
		max: 50, // 50 quiz requests per 10 minutes
		message: {
			error: "Quiz rate limit exceeded",
			message: "Please wait before starting another quiz",
			retryAfter: "10 minutes",
		},
	},

	// File upload endpoints (very restrictive)
	upload: {
		windowMs: 60 * 60 * 1000, // 1 hour
		max: 10, // 10 uploads per hour
		message: {
			error: "Upload limit exceeded",
			message: "Maximum uploads per hour reached",
			retryAfter: "1 hour",
		},
	},

	// Public endpoints (lenient)
	public: {
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 200, // 200 requests per 15 minutes
		message: {
			error: "Rate limit exceeded",
			message: "Too many requests, please slow down",
			retryAfter: "15 minutes",
		},
	},

	// Admin endpoints (very restrictive)
	admin: {
		windowMs: 5 * 60 * 1000, // 5 minutes
		max: 20, // 20 admin requests per 5 minutes
		message: {
			error: "Admin rate limit exceeded",
			message: "Administrative actions are rate limited",
			retryAfter: "5 minutes",
		},
	},
};

// Slow down configuration for progressive delays
export const slowDownConfig = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	delayAfter: 50, // allow 50 requests per 15 minutes at full speed
	// v2 behavior: always add a constant delay after delayAfter is reached
	delayMs: () => 500,
	maxDelayMs: 20000, // maximum delay of 20 seconds
	skipSuccessfulRequests: true,
};

// re-export for consumers that may import the default by mistake
export default { rateLimitConfig, slowDownConfig, rateLimit, slowDown };


