import { rateLimit } from 'express-rate-limit';

export const rateLimiter = rateLimit({
	windowMs: 10000, // 1 minute
	max: 25, // Limit each IP to 25 requests per `window` (here, per 1 minute)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false // Disable the `X-RateLimit-*` headers
});
