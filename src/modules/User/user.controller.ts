import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import catchAsync from "../../Utils/catchAsync";
import sendResponse from "../../Utils/sendResponse";
import { UserServices } from "./user.service";
import httpStatus from "http-status";

const sendPhoneOtp = catchAsync(async (req, res) => {
    const { user_phone } = req.body;

    const { user_phone: phone, user_phone_is_verified, otp_code, otp_expires_at } = await UserServices.sendPhoneOtpService(user_phone);

    const userData = {
        user_phone: phone,
        user_phone_is_verified,
        otp_code,
        otp_expires_at
    }

    res.status(httpStatus.OK).json({
        success: true,
        message: "OTP sent successfully",
        data: userData,
    });
});

const sendEmailOtp = catchAsync(async (req, res) => {
    const { user_email, user_name } = req.body;

    // const { user_email: email, user_email_is_verified, otp_code, otp_expires_at } = await UserServices.sendEmailOtpService(user_email);

    const user = await UserServices.sendEmailOtpService(user_email, user_name);

    // const userData = {
    //     user_email: email,
    //     user_email_is_verified,
    //     otp_code,
    //     otp_expires_at
    // }

    res.status(httpStatus.OK).json({
        success: true,
        message: "OTP sent to email successfully",
        data: user,
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

// Verify phone OTP
const verifyPhoneOtp = catchAsync(async (req, res) => {
    const user = await UserServices.verifyPhoneOtpServices(req.body);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Phone OTP verified successfully",
        data: user,
    });
});

// Verify email OTP
const verifyEmailOtp = catchAsync(async (req, res) => {
    const { ...verifyEmailData } = req.body;
    const result = await UserServices.verifyEmailOtpServices(verifyEmailData);

    res.status(httpStatus.OK).json({
        success: true,
        message: result.message,
        data: result.data,
    });
});

// Login
const login = catchAsync(async (req, res) => {
    const { ...loginData } = req.body;
    const { user, accessToken, newUser } = await UserServices.loginServices(loginData);

    res.status(httpStatus.OK).json({
        success: true,
        message: "User logged in successfully",
        data: user || newUser,
        accessToken: accessToken,
    });
});

// const socialLogin = catchAsync(async (req, res) => {
//     const { ...loginData } = req.body;
//     const result = await UserServices.socialLoginServices(loginData);

//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: 'User login successfully',
//         data: result,
//     });
// });

const updateUser = catchAsync(async (req, res) => {
    const user_id = req.body._id;
console.log("Update User Controller", req.body, user_id);

    // user profile image upload
    let user_profile;
    let user_profile_key;

    if (req.files && 'user_profile' in req.files) {
        const userImage = req.files['user_profile'][0];
        const user_profile_upload = await FileUploadHelper.uploadToSpaces(userImage)

        user_profile = user_profile_upload.Location;
        user_profile_key = user_profile_upload.Key;
    }

    const userData = {
        ...req.body,
        user_profile,
        user_profile_key,
    };
    const result = await UserServices.updateUserServices(user_id, userData);

    if (req.body?.user_profile_key) {
        await FileUploadHelper.deleteFromSpaces(req.body.user_profile_key)
    }

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User updated successfully',
        data: result,
    });
});

export const UserControllers = {
    sendPhoneOtp,
    sendEmailOtp,
    verifyPhoneOtp,
    verifyEmailOtp,
    registerUser,
    login,
    updateUser
};  