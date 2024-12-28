import { User } from "../../models/user.models.js"
import bcrypt from "bcrypt";
import generateToken from "../../tokenGeneration/generateToken.js";


export const userController = async(req, res) => {
    console.log("I am hit from the frontend dashboard", req.user);

    if (!req.user.email) {
        res.status(401).send("Access denied...No token provided...");
    } else {
        res.status(200).send({
            email: req.user.email,
            role: req.user.role,
            name: req.user.name,
        });
    }
}

export const logoutController = async(req, res) => {
    console.log("came for the logout");

    res.clearCookie("token", {
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: 'none'
    });
    return res.status(200).send("Logout successful");
}

export const loginController = async(req, res) => {
    const { email, password } = req.body;
    console.log("I am hit from the frontend login");

    if (!email || !password) {
        return res.status(400).json({
            message: ("All input are required, or in am not getting proper things from the frontend"),
            receivedDetails: req.body
        });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({
            message: ("User not found"),
            receivedDetails: req.body
        });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).json({
            message: ("Incorrect password"),
            receivedDetails: req.body
        });
    }

    console.log("password correct");
    const details = {
        objectId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    }

    const token = generateToken(details);
    console.log("token", token);

    res.cookie("token", token, {
        path: "/",
        expires: new Date(Date.now() + 86400000), // 24 hours
        secure: true, // Make sure this is enabled in production with HTTPS
        sameSite: 'none', // Important for cross-domain (cookie will be sent even if the request is made from a different domain)
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    });

    console.log("Cookie set successfully");

    return res.status(201).json({
        message: "Login successful",
        user: {
            email: user.email,
            role: user.role,
            name: user.name,
        }
    });
}




// const response = await User.find({}); // Returns an array of all matching documents
// res.status(200).json({
//     message: "All input are there, or I am getting proper things from the frontend",
//     dbResponseLength: response.length, // The length of the array of documents
//     receivedDetails: req.body,
//     fromDB: response
// });