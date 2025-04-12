import catchAsync from "../../Utils/catchAsync";
import { UserServices } from "./user.service";
import httpStatus from "http-status";
import { customAlphabet } from 'nanoid'

const registerUser = catchAsync(async (req, res) => {
    const nanoid = customAlphabet('1234567890abcdef', 5)
    const otp_code = nanoid()
    const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    const userData = {
        ...req.body,
        otp_code,
        otp_expires_at,
    }

    const user = await UserServices.registerUserServices(userData);

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "User registered successfully",
        data: user,
    });
});

// Verify OTP
const verifyOtp = catchAsync(async (req, res) => {
    console.log("Verify OTP Controller", req.body);

    const user = await UserServices.verifyOtpServices(req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "OTP verified successfully",
        data: user,
    });
});

// Login
const login = catchAsync(async (req, res) => {
    console.log("Login Controller", req.body);

    const user = await UserServices.loginServices(req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "User logged in successfully",
        data: user,
    });
});

export const UserControllers = {
    registerUser,
    verifyOtp,
    login
};  