import dotenv from "dotenv";
dotenv.config();
const {SECRET} = process.env;

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({message:'No token provided.'});
  
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) return res.status(500).json({message:'Failed to authenticate token.'});
      req.userId = decoded._id;
      req.email = decoded.email;
      next();
    });
  };
  
  const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.email !== 'admin') return res.status(403).json({message:'Access denied.'});
      next();
    });
  };
  export default verifyAdmin;