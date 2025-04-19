import { Request, Response, NextFunction, RequestHandler } from "express";
import AppError from "../../errors/AppError";
import sendResponse from "../../utils/sendResponse";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import { FaqModel } from "./faq.model";
import { FaqServices } from "./faq.service";


const postFaq: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const result = await FaqServices.postFaqService(req.body);

    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Faq created successfully",
        data: result,
    });
};

const getFaq = catchAsync(async (req, res) => {
    const result = await FaqServices.getFaqService();

    if (result.length === 0) {
        throw new AppError(404, "No data found");
    }

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Faq info retrieved successfully',
        data: result,
    });

});

const updateFaq: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const requestData = req.body;
        const faqId = requestData?._id;

        // ========== Update ==========
        const result = await FaqServices.updateFaqService(faqId, requestData);


        if (result) {
            return sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "Faq info Updated Successfully!",
                data: result
            });
        } else {
            throw new AppError(400, "Faq info Update Failed!");
        }
    } catch (error) {
        next(error);
    }
};


const deleteFaq = catchAsync(async (req, res, next) => {
    const FaqId = req.body._id
    const result = await FaqServices.deleteFaqService(FaqId);

    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Faq deleted successfully !",
    });
});

export const FaqController = {
    postFaq,
    getFaq,
    updateFaq,
    deleteFaq
};