import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
    points: 100, // Number of requests
    duration: 3600, // Per hour (in seconds)
});

export const rateLimiterMiddleware = async(req, res, next) => {
    try {
        const apiKey = req.params.apiKey;
        await rateLimiter.consume(apiKey);
        next();
    } catch (error) {
        res.status(429).json({
            status: "error",
            message: "Too many requests. Please try again later."
        });
    }
};