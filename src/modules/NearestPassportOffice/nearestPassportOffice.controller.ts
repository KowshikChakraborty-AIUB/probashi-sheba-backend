import AppError from "../../Errors/AppError";
import catchAsync from "../../Utils/catchAsync";
import sendResponse from "../../Utils/sendResponse";
import { getNearestPassportOfficeService, postNearestPassportOfficeService } from "./nearestPassportOffice.service";

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