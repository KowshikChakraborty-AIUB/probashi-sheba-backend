import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WhoWeAreService } from "./whoWeAre.service";
import httpStatus from 'http-status';

const postWhoWeAre = catchAsync(async (req, res) => {

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Who we are info retrieved successfully',
        // data: result,
    });

});

export const WhoWeAreController = {
    postWhoWeAre,
};