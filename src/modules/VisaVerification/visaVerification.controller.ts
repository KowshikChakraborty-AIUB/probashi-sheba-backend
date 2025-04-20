import { Request, Response, NextFunction, RequestHandler } from "express";
import AppError from "../../errors/AppError";
import sendResponse from "../../utils/sendResponse";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import { VisaVerificationServices } from "./visaVerification.service";
import { VisaVerificationModel } from "./visaVerification.model";


const postVisaVerification: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

    if (!req.files || !("visaVerification_country_image" in req.files)) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: 'Visa verification image are required',
        });
    }


    let visaVerification_country_image, visaVerification_country_image_key;
    try {
        const visaVerificationImage = req.files["visaVerification_country_image"][0];

        const visaVerificationImageUpload = await FileUploadHelper.uploadToSpaces(visaVerificationImage);

        if (visaVerificationImageUpload) {
            visaVerification_country_image = visaVerificationImageUpload?.Location;
            visaVerification_country_image_key = visaVerificationImageUpload?.Key;
        }


        const visaVerificationsData = { ...req.body, visaVerification_country_image, visaVerification_country_image_key };

        const result = await VisaVerificationServices.postVisaVerificationService(visaVerificationsData);

        return sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Visa Verification info created successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const getVisaVerification = catchAsync(async (req, res) => {
    const result = await VisaVerificationServices.getVisaVerificationService();

    if (result.length === 0) {
        throw new AppError(404, "No data found");
    }

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'VisaVerification info retrieved successfully',
        data: result,
    });

});

const updateVisaVerification: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const requestData = req.body;
        const faqId = requestData?._id;

        // ========== Update ==========
        const result = await VisaVerificationServices.updateVisaVerificationService(faqId, requestData);


        if (result) {
            return sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "VisaVerification info Updated Successfully!",
                data: result
            });
        } else {
            throw new AppError(400, "VisaVerification info Update Failed!");
        }
    } catch (error) {
        next(error);
    }
};


const deleteVisaVerification = catchAsync(async (req, res, next) => {
    const VisaVerificationId = req.body._id
    const result = await VisaVerificationServices.deleteVisaVerificationService(VisaVerificationId);

    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "VisaVerification deleted successfully !",
    });
});

export const VisaVerificationController = {
    postVisaVerification,
    getVisaVerification,
    updateVisaVerification,
    deleteVisaVerification
};