import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from 'bcrypt';
import config from "../../config";


const userSchema = new Schema<TUser, UserModel>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true,
    },
    address: { type: String, required: true },
    profileImg: { type: String, required: false },
    verified: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    followers: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    following: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    isDeleted: { type: Boolean, default: false }
});

userSchema.pre('save', function (next) {

    if (!this.followers) {
        this.followers = [];
    }

    if (!this.following) {
        this.following = [];
    }

    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this; // doc
    // hashing password and save into DB
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds),
    );
    next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
    return await User.findOne({ email, isDeleted: { $ne: true } });
};

userSchema.statics.isPasswordMatched = async function (
    plainTextPassword,
    hashedPassword,
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>('User', userSchema);