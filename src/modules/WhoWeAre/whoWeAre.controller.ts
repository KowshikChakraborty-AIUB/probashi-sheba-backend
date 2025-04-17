import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WhoWeAreService } from "./whoWeAre.service";

const postWhoWeAre = catchAsync(async (req, res) => {
    console.log("req.body", req.body);
    
    const result = await WhoWeAreService.postWhoWeAreServices();

    // if (result.length === 0) {
    //     throw new AppError(404, "No data found");
    // }

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Who we are info retrieved successfully',
        data: result,
    });

});

export const WhoWeAreController = {
    postWhoWeAre,
};