import catchAsync from "../../Utils/catchAsync";
import { UserServices } from "./user.service";
import httpStatus from "http-status";
import { customAlphabet } from 'nanoid'

const sendOtp = catchAsync(async (req, res) => {
    const { user_phone } = req.body;

    const { user_phone: phone, user_phone_verified, otp_code, otp_expires_at } = await UserServices.sendOtpService(user_phone);

    const userData = {
        user_phone: phone,
        user_phone_verified,
        otp_code,
        otp_expires_at
    }

    res.status(httpStatus.OK).json({
        success: true,
        message: "OTP sent successfully",
        data: userData,
    });
});


const registerUser = catchAsync(async (req, res) => {

    const user = await UserServices.registerUserServices(req.body);
    console.log("Register User Controller", user);

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
    const { ...loginData } = req.body;
    const { user, accessToken } = await UserServices.loginServices(loginData);

    res.status(httpStatus.OK).json({
        success: true,
        message: "User logged in successfully",
        data: user,
        accessToken: accessToken,
    });
});

export const UserControllers = {
    registerUser,
    verifyOtp,
    login,
    sendOtp
};  