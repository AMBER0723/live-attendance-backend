import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const signup = async (req, res) => {

    try {
        const { name, email, password, role } = req.body;

        console.log(req.body); // Debugging line to check incoming data

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashpassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashpassword,
            role
        });

        await user.save(); 
        console.log("USER SAVED IN DB:", user);

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || require('crypto').randomBytes(64).toString('hex'),
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User registered successfully",
            token
        });
    } catch (error) {
        console.error(error);  // log full error
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || require('crypto').randomBytes(64).toString('hex'),
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });
    } catch (error) {
        console.error(error);  // log full error
        res.status(500).json({
            message: error.message
        })
    }
}

//mongodb+srv://ambershaikh74_db_user:qifuMUn2BjjJu9H2@live-attendance-cluster.o7izi3w.mongodb.net/live_attendance