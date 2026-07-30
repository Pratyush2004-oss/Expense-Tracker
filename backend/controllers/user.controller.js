import { sql } from "../config/db.js";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";

// signup
export const signup = async (req, res) => {
    try {
        // check for req.body
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Bad request"
            })
        }
        const { name, email, password } = req.body;
        if (!(name && email && password)) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        // check for user with email
        const userExists = await sql`
        SELECT email FROM users WHERE email = ${email} limit 1
        `
        if (userExists.length > 0) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        // create id for user with UUID
        const id = uuid();
        // hash password
        const hpassword = await bcrypt.hash(password, 10);
        // insert user to database
        const user = await sql`
        INSERT INTO users (id, name, email, password) 
        VALUES (${id}, ${name}, ${email}, ${hpassword})
        RETURNING *;
        `
        if (user.length == 0) {
            return res.status(400).json({
                success: false,
                message: "User not created"
            })
        }

        // create token
        const token = jwt.sign({ id }, process.env.JWT_SECRET)
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: user[0].id,
                name: user[0].name,
                email: user[0].email,
                created_at: user[0].created_at
            },
            token
        })
    } catch (error) {
        console.log("Error in signup controller: ", error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// login 
export const login = async (req, res) => {
    try {
        // check for req.body
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Bad request"
            })
        }
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        // check for user with email
        const user = await sql`
        SELECT * FROM users WHERE email = ${email} limit 1
        `
        if (user.length == 0) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }
        // check password
        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }
        // create token
        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET)
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user[0].id,
                name: user[0].name,
                email: user[0].email,
                created_at: user[0].created_at
            },
            token
        })
    } catch (error) {
        console.log("Error in login controller: ", error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}
// check me
export const checkMe = async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No id found"
            })
        }
        // check for user with id
        const user = await sql`
        SELECT name , email, created_at, id FROM users WHERE id = ${id} limit 1
        `
        if (user.length == 0) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }
        res.status(200).json({
            success: true,
            user: {
                id: user[0].id,
                name: user[0].name,
                email: user[0].email,
                created_at: user[0].created_at
            },
        })
    } catch (error) {
        console.log("Error in checkMe controller: ", error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}