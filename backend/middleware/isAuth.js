import jwt from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No header provided"
            })
        }
        const token = authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided"
            })
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.id;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token"
            })
        }
    } catch (error) {
        console.log("Error in isAuth middleware: ", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}