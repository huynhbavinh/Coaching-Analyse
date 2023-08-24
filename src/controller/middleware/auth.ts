import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config  from "../../config/config";


const verifyToken = (req:Request, res:Response, next:NextFunction) => {
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  if (!token || !refreshToken) {
    return res.sendStatus(401);
    // res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET) as JwtPayload;
    console.log("decoded", decoded);
    
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      config.REFRESH_TOKEN_SECRET
    ) as JwtPayload;

    if (decoded.email === decodedRefreshToken.email) {  
      req = decoded.email;
      next();
    } else {
      console.log("Token không hợp lệ");
      return res.json({mesage: "Token không hợp lệ"});
      // res.sendStatus(403);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
};

export default verifyToken;
