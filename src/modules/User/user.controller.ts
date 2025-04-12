import httpStatus from "http-status";
import catchAsync from "../../Utils/catchAsync";
import { UserServices } from "./user.service";
import sendResponse from "../../Utils/sendResponse";
import { User } from "./user.model";
//import sendResponse from "../../Utils/sendResponse";

const registerUser = catchAsync(async (req, res) => {
    const result = await UserServices.registerUserIntoDB(req.body);
    const { _id, name, email, phone, address, profileImg, role, verified, following, followers } = result.result;
    const token = result.accessToken

    res.status(httpStatus.OK).json({
        success: true,
        statusCode: httpStatus.OK,
        message: 'User registered successfully',
        data: { _id, name, email, phone, address, profileImg, role, verified, following, followers },
        token: token
    });
});

const getAllUsers = catchAsync(async (req, res) => {
    const result = await UserServices.getAllUsersFromDB();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All users retrieved successfully',
        data: result,
    });

});

const getUsersByUserId = catchAsync(async (req, res) => {
    const { useId } = req.params;

    const result = await UserServices.getUsersByUserIdFromDB(useId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Users by user Id retrieved successfully',
        data: result,
    });
});

const getUserByEmailId = catchAsync(async (req, res) => {
    const { email } = req.params;

    const result = await UserServices.getUserByEmailIdFromDB(email);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });

});

const updateUserByEmailId = catchAsync(async (req, res) => {
    const { email } = req.params;
    const updateData = req.body;


    const result = await UserServices.updateUserByEmailId(email, updateData);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User updated successfully',
        data: result,
    });
});

const followUnfollowUsers = catchAsync(async (req, res) => {
    const { userId, userIWantToFolllowId, action } = req.params;

    let result;
    if (action === 'follow') {
        result = await UserServices.followUser(userId, userIWantToFolllowId);
    } else if (action === 'unfollow') {
        result = await UserServices.unfollowUser(userId, userIWantToFolllowId);
    } else {
        return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: 'Error! "follow" or "unfollow" should be expected',
            data: null,
        });
    }

    sendResponse(res, {
        statusCode: 200,
        success: result.success,
        message: result.message,
        data: result.data,
    });
});

const updateUserRole = catchAsync(async (req, res) => {
    const result = await UserServices.updateUserRoleIntoDB(req.params?.userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Role updated successfully",
        data: result,
    });
});

const deleteUser = catchAsync(async (req, res) => {
    const result = await UserServices.deleteUserFromDB(req.params?.userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User deleted successfully",
        data: result,
    });
});

const getTotalUsersCount = catchAsync(async (req, res) => {

    const totalUsers = await User.countDocuments();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Total Users retrieved successfully',
        data: totalUsers,
    });
})

export const UserControllers = {
    registerUser,
    getAllUsers,
    getUsersByUserId,
    followUnfollowUsers,
    getUserByEmailId,
    updateUserByEmailId,
    updateUserRole,
    deleteUser,
    getTotalUsersCount
};