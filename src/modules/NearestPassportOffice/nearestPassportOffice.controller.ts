import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { getNearestPassportOfficeService, postNearestPassportOfficeService, updateNearestPassportOfficeService } from "./nearestPassportOffice.service";

export const postNearestPassportOffice = catchAsync(async (req, res) => {
    const result = await postNearestPassportOfficeService(req.body);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Nearest passport office info created successfully',
        data: result,
    });
});


export const getNearestPassportOffice = catchAsync(async (req, res) => {
    const query = req.query

    const result = await getNearestPassportOfficeService(query);

    if (result.length === 0) {
        throw new AppError(404, "No data found");
    }

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Nearest Passport Office info retrieved successfully',
        data: result,
    });

});

export const updateNearestPassportOffice = catchAsync(async (req, res) => {
    const _id = req.body._id;

    const result = await updateNearestPassportOfficeService(_id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Passport Office info updated successfully',
        data: result,
    });
});