const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided"
            });
        }


        // Token format: Bearer token
        const token = authHeader.split(" ")[1];


        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // Store user data in request
        req.user = decoded;


        next();


    } catch (error) {

        res.status(401).json({
            message: "Invalid token"
        });

    }

};


module.exports = authMiddleware;