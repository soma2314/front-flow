import { User } from "../../models/user.models.js";
import bcrypt from "bcrypt";
import generateToken from "../../tokenGeneration/generateToken.js";

export const createUser = async(req, res) => {
    try {
        const { email, password, name, userType } = req.body;

        // Admin-specific check
        if (userType === "admin") {
            const { adminPassword } = req.body;
            if (adminPassword !== process.env.ADMIN_PASSWORD) {
                return res.status(400).json({ message: "Admin password is wrong" });
            }
        }

        const role = userType === "admin" ? "admin" : "user";

        if (!email || !password || !name || !role) {
            return res.status(400).json({ message: "All input are required" });
        }

        // Check if the user already exists
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(409).json({ message: "User already exists. Please login." });
        }

        // Hash password
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        // Save new user to the database
        const user = await newUser.save();

        // Generate a token with both email and ObjectId
        const details = {
            objectId: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
        const token = generateToken(details);

        // Set the token in the cookie with email and ObjectId
        res.cookie("token", token, {
            path: "/",
            expires: new Date(Date.now() + 86400000), // 24 hours
            secure: true, // Make sure this is enabled in production with HTTPS
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
            sameSite: 'none',
        });

        console.log("Cookie set successfully");
        console.log("User is registered");

        return res.status(201).json({ message: "User created successfully", user: { "email": user.email, "name": user.name, "role": user.role } });
    } catch (error) {
        console.error("Got an error", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};