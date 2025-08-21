import fs from "fs";
import path from "path";

// Log rate limit violations for monitoring
export const logRateLimitViolation = (req, limitType, remainingPoints) => {
	const logEntry = {
		timestamp: new Date().toISOString(),
		ip: req.ip,
		userAgent: req.get("User-Agent"),
		path: req.path,
		method: req.method,
		limitType,
		remainingPoints,
		userId: (req.user && req.user.id) || "anonymous",
	};

	// Log to file (in production, use proper logging service)
	const logPath = path.join(process.cwd(), "logs", "rate-limit-violations.log");

	try {
		if (!fs.existsSync(path.dirname(logPath))) {
			fs.mkdirSync(path.dirname(logPath), { recursive: true });
		}

		fs.appendFileSync(logPath, JSON.stringify(logEntry) + "\n");
	} catch (error) {
		console.error("Failed to log rate limit violation:", error);
	}

	// Console log for development
	if (process.env.NODE_ENV === "development") {
		console.warn("🚨 Rate limit violation:", logEntry);
	}
};

// Middleware to track rate limit usage
export const rateLimitAnalytics = (req, res, next) => {
	const originalSend = res.send.bind(res);

	res.send = function (data) {
		// Log rate limit headers for analytics
		const limitHeaders = {
			limit: res.get("RateLimit-Limit"),
			remaining: res.get("RateLimit-Remaining"),
			reset: res.get("RateLimit-Reset"),
			retryAfter: res.get("Retry-After"),
		};

		if (res.statusCode === 429) {
			logRateLimitViolation(req, "unknown", limitHeaders.remaining);
		}

		return originalSend(data);
	};

	next();
};


