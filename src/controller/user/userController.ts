import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import config from '../../config/config';
import Account from '../../models/Account';


const saltRounds: number = 10;
const salt = bcrypt.genSaltSync(saltRounds);
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
  const refreshToken = jwt.sign({ email }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  return { accessToken, refreshToken };
};

const updateRefreshToken = async (email: any, refreshToken: any) => {
  await Account.findOneAndUpdate({ email }, { refreshToken });
};
class UserController {
  async signup(req: Request, res: Response) {
    let { email, username, password } = req.body;
    username = username.toString().trim();
    email = email.toString().trim();
    password = password.toString().trim();
    const checkPassword = await Account.findOne({ email });
    if (checkPassword) {
      res.json({
        message: `${email} đã tồn tại`
      });
    }
    const hashed = bcrypt.hashSync(password, salt);
    try {
      const newUser = new Account({
        username,
        email,
        password: hashed,
      });
      newUser.save();
      res.json({ message: "Đăng ký thành công", newUser });
    } catch (err) {
      console.log(err);
    }
  }

  // async login<LoginResponse>(req: Request, res: Response) {
  //   let { email, password } = req.body;
  //   const a: LoginResponse = {
  //     b: 1,
  //   }
  //   return a;
  //   email = email.toString().trim();
  //   password = password.toString().trim();
  //   const check = await Account.findOne({ email });
  //   if (check === null) {
  //     res.json({ message: "Mật khẩu không hợp lệ" });
  //   } else {
  //     const hashedPassword = check?.password;
  //     if (typeof hashedPassword === "undefined") {
  //       res.json({ message: "Mật khẩu không hợp lệ" });
  //     } else {
  //       try {
  //         const match = bcrypt.compareSync(password, hashedPassword);
  //         console.log("match", match);

  //         if (match) {
  //           const tokens = generateTokens(check.toJSON());
  //           updateRefreshToken(email, tokens.refreshToken);

  //           res.cookie("token", tokens.accessToken, { httpOnly: true });
  //           res.cookie("refreshToken", tokens.refreshToken, {
  //             httpOnly: true,
  //             expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
  //           });

  //           // res.redirect("/login/getCookie");
  //           res.json({message: "Đăng nhập thành công", check, tokens});
  //           // res.json({ message: "Đăng nhập thành công", check });
  //         } else {
  //           res.json({ message: "Sai mật khẩu" });
  //         }
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }

  //   }
  // }
  // async logout(req: Request, res: Response) {
  //   const check = await Account.findOne({ email: req.UserEmail });
  //   updateRefreshToken(check?.email, null);
  //   console.log(check);
  //   res.json({message: "Log out thành công"});
  // }

  async token(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.sendStatus(401);
      return;
    }

    const check = await Account.findOne({ refreshToken });

    if (!check) {
      res.sendStatus(403);
      return;
    }
    else {

      try {
        jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
        const tokens = generateTokens({ email: check.email, password: check.password });
        updateRefreshToken(check.email, tokens.refreshToken);
        res.json(tokens);
      } catch (error) {
        console.log(error);
        res.sendStatus(403);
      }
    }

  }

  async viewUser(req:Request, res:Response)
  {
    try {
      const haha = await Account.find();
      res.json({'LOGIN: ': haha});
    } catch (error) {
      console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi tải dữ liệu",
    });
    }
  }
}

export default new UserController;
export { generateTokens, updateRefreshToken };