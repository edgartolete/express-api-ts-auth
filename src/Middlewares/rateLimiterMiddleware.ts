import { rateLimit } from 'express-rate-limit';

export const requestRateLimiter = rateLimit({
	windowMs: 60000, //1 minute
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 minute)
	standardHeaders: 'draft-7', // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false // Disable the `X-RateLimit-*` headers
});
