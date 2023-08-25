// import funcs utils
// import model
// import libs
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
interface UserData {
    email: string;
    password: string;
}
// Create tokens
const generateTokens = (payload: { email: any; password: any; }) => {
    const { email, password } = payload;
    const accessToken = jwt.sign(
      { email, password },
      config.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    // const refreshToken = jwt.sign({ email }, config.REFRESH_TOKEN_SECRET, {
    //   expiresIn: "1h",
    // });
    // return { accessToken, refreshToken };
  };
  
//   const updateRefreshToken = async (email: any, refreshToken: any) => {
//     await Account.findOneAndUpdate({ email }, { refreshToken });
//   };

export async function login<LoginResponse>(req: Request, res: Response) {
    const { email, password } = req.body;
    // Đường dẫn đến file JSON
    const filePath = '../../dummyData/user.storage.json';
    // Đọc dữ liệu hiện có trong file JSON (nếu có)
    // let jsonData = [];
    // if (fs.existsSync(filePath)) {
    //     const rawData = fs.readFileSync(filePath);
    //     jsonData = JSON.parse(rawData.toString());
    // }
    if (!fs.existsSync(filePath)) {
        res.status(500).json({ success: false, message: "Không tìm thấy dữ liệu người dùng" });
        return;
    }
    try {
        const rawData = fs.readFileSync(filePath);
        const jsonData: UserData[] = JSON.parse(rawData.toString());
        const user = jsonData.find(userData => userData.email === email);
        if (!user) {
            res.status(401).json({ success: false, message: "Email không tồn tại" });
            return;
        }

        const match = bcrypt.compareSync(password, user.password);
        console.log("match", match);
        if (match) {
            const tokens = generateTokens(user);
            res.status(200).json({ success: true, message: "Đăng nhập thành công", tokens });
        } else {
            res.status(401).json({ success: false, message: "Mật khẩu không đúng" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
}
