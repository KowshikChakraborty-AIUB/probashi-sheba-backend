import catchAsync from "../../Utils/catchAsync";
import { UserServices } from "./user.service";
import httpStatus from "http-status";

const registerUser = catchAsync(async (req, res) => {
    console.log("Register User Controller", req.body);
    
    const user = await UserServices.registerUserServices(req.body);

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "User registered successfully",
        data: user,
    });
});

export const UserControllers = {
    registerUser,
};  