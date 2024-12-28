import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({
    path: "../.env"
})

function generateToken(email) {
    const token = jwt.sign({email}, process.env.PRIVATE_KEY, {
        expiresIn: "1d"
    })

    return token;
}

export default generateToken;