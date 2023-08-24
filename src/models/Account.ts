import mongoose from "mongoose";
import { Schema } from "mongoose";

const accountSchema = new Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
})

export interface LoginResponse {
    success: boolean,
    error?: Array<String>,
}

// result.success

export default mongoose.model("Account", accountSchema);