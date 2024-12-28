import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'
import loginroutes from './src/routes/loginroutes.js'
import apiRoutes from './src/routes/apiRoutes.js'
import cookieParser from 'cookie-parser';
import createProductRoutes from './src/routes/createProductRoutes.js'
import getProductsRoutes from './src/routes/getProductsRoutes.js'
import user from './src/routes/user.js'

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();
const CLIENT_URL = process.env.CLIENT_URL;

// CORS configuration
app.use(
    cors({
        origin: [CLIENT_URL],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
            'Origin',
            'Access-Control-Allow-Headers',
            'Access-Control-Request-Method',
            'Access-Control-Request-Headers',
            'Access-Control-Allow-Credentials'
        ],
        exposedHeaders: ['Content-Range', 'X-Content-Range', 'set-cookie'],
        credentials: true,
        maxAge: 86400, // 24 hours
        preflightContinue: false,
        optionsSuccessStatus: 204
    })
)

// Middleware configuration
app.use(express.json({ limit: "1000kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "1000kb" }));
app.use(express.static("public"));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Routes
app.use("/api/v1/auth", loginroutes);
app.use("/api/v1", apiRoutes);
app.use("/api/v1/products", createProductRoutes);
app.use("/api/v1/products", getProductsRoutes);
app.use("/api/v1/users", user);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Database connection
const connectDB = async() => {
    try {
        await mongoose.connect(process.env.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Database connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

// Server initialization
const startServer = async() => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Accepting requests from: ${CLIENT_URL}`);
        });
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
};

startServer();