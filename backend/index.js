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

dotenv.config({
    path: "./.env"
});

const PORT = process.env.PORT || 8080;
const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
)
app.use(express.json({ limit: "1000kb" }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: "1000kb" }))
app.use(express.static("public"))

app.use("/api/v1", loginroutes)
app.use("/api/v1", apiRoutes)
app.use("/api/v1", createProductRoutes)
app.use("/api/v1", getProductsRoutes)

const CLIENT_URL = process.env.CLIENT_URL;

app.get('/', (req, res) => {
    res.send('Hello World! finally the backedn deployed', CLIENT_URL);
})


try {
    const res = await mongoose.connect(process.env.mongoUrl)
    console.log(`db connected ${res.connection.host}`);
    app.listen(PORT, () => {
        console.log('Server is running on port', PORT);
    })
} catch (error) {
    console.log('some error in server connecting db', error);
}