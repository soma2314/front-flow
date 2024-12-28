import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import loginroutes from './src/routes/loginroutes.js';
import apiRoutes from './src/routes/apiRoutes.js';
import cookieParser from 'cookie-parser';
import createProductRoutes from './src/routes/createProductRoutes.js';
import getProductsRoutes from './src/routes/getProductsRoutes.js';
import user from './src/routes/user.js';

dotenv.config({
    path: "./.env"
});

const PORT = process.env.PORT || 8080;
const app = express();

const CLIENT_URL = process.env.CLIENT_URL;
const normalizedClientUrl = CLIENT_URL.replace(/\/$/, '');

console.log(CLIENT_URL);
app.use(cors({
    origin: [
        normalizedClientUrl,
        `${normalizedClientUrl}/`
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Date', 'X-Api-Version']
}));

app.use(express.json({ limit: "1000kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "1000kb" }));
app.use(express.static("public"));

app.use("/api/v1", loginroutes);
app.use("/api/v1", apiRoutes);
app.use("/api/v1", createProductRoutes);
app.use("/api/v1", getProductsRoutes);

app.get('/', (req, res) => {
    res.send('Hello World! finally the backend deployed');
});

// https://front-flow-v1.vercel.app/api/v1/v2/aboutTeam
app.get('/api/v1/v2/aboutTeam', (req, res) => {
    console.log("dummyController is hit at:", new Date().toISOString());
    res.json({ message: "Simple dummy controller for about team is hit" });
});

app.get('/check-env', (req, res) => {
    try {
        const clientUrl = process.env.CLIENT_URL;
        res.json({ clientUrl });
    } catch (error) {
        res.json({ error: error.message });
    }
});

try {
    const res = await mongoose.connect(process.env.mongoUrl);
    console.log(`db connected ${res.connection.host}`);
    app.listen(PORT, () => {
        console.log('Server is running on port', PORT);
    });
} catch (error) {
    console.log('some error in server connecting db', error);
}