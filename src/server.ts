import express from 'express';
import mongoose from 'mongoose';

// api
import route from './api';
import cookieParser from 'cookie-parser';
import verifyToken from './controller/middleware/auth';

const url: string =
  "mongodb+srv://dinhtankhanh14:Khanhdeptrai0408@cluster-norsmither.udr8t5i.mongodb.net/?retryWrites=true&w=majority";
async function connect() {
  try {
    await mongoose.connect(url);
    console.log("Connect to MongoDB");
  } catch (error) {
    console.log(error);
  }
}
connect();
 
const app: express.Application = express();
app.use(cookieParser());
// app.use(verifyToken);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
 
const port: number = 3000;

// Route init
route(app);
 
app.get('/', (_req, _res) => {
    _res.send("TypeScript With Express");
});
 
app.listen(port, () => {
    console.log(`TypeScript with Express
         http://localhost:${port}/`);
});