// import funcs utils
// import model
// import libs
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import { Accounts } from '../../models/Account';
import { LoginResponse } from '../../models/Account'
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

export async function login(email: string, password: string) {
    // Đường dẫn đến file JSON
    const filePath = 'D:\\code\\Coaching Analyse\\src\\dummyData\\user.storage.json';
    const accounts: Accounts = JSON.parse(fs.readFileSync(filePath).toString()) || [];
    if (accounts.length === 0) {
        const a: LoginResponse = { success: false, error: ["Không tìm thấy dữ liệu người dùng"] };
        return a;
    }
    try {
        const user = accounts.find(account => account.email === email);
        if (!user) {
            const a: LoginResponse = { success: false, error: ["Email không tồn tại"] };
            return a;
        }

        const match = bcrypt.compareSync(password, user.password);
        if (match) {
            // const tokens = generateTokens(user);
            const a: LoginResponse = { success: true, error: ["Đăng nhập thành công"] };
            return a;
        } else {
            const a: LoginResponse = { success: false, error: ["Mật khẩu không đúng"] };
            return a;
        }
    } catch (error) {
        console.log(error);
        const a: LoginResponse = { success: false, error: ['Unexpected error'] };
        return a
    }
}
