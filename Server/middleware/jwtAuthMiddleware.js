import jwt from "jsonwebtoken";

async function jwtAuthMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorised." });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Invalid Token." });
    }

}

const generateToken = (payload) => {
    return jwt.sign(payload,process.env.JWT_SECRET, { expiresIn: '1d' });
}

export {generateToken, jwtAuthMiddleware};