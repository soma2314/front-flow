import express from "express";
import { apiKeyValidator } from "../middlewares/apiKeyValidatorMiddleware.js";
import { serveAllProducts, serveParticularCategoryProducts, serveParticularSubCategoryProducts, wrongRequest } from "../controllers/serveClientRequestsController.js";
import { rateLimiterMiddleware } from "../middlewares/rateLimiterMiddleware.js"
const router = express.Router()

router.get("/:apiKey/getProducts/getAllProducts", apiKeyValidator, rateLimiterMiddleware, serveAllProducts);
router.get("/:apiKey/getProducts/category/:category", apiKeyValidator, rateLimiterMiddleware, serveParticularCategoryProducts);
router.get("/:apiKey/getProducts/subcategory/:subcategory", apiKeyValidator, rateLimiterMiddleware, serveParticularSubCategoryProducts);
router.get("/:apiKey/getProducts/*", apiKeyValidator, rateLimiterMiddleware, wrongRequest);

export default router;