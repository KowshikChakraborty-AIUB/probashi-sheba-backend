import { Request, Response, NextFunction, RequestHandler } from "express";
import AppError from "../../errors/AppError";
import sendResponse from "../../utils/sendResponse";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import { TestimonialModel } from "./testimonial.model";
import { TestimonialServices } from "./testimonial.service";


const postTestimonial: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (!req.files || !("testimonial_image" in req.files)) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: 'Testimonial image are required',
        });
    }


    let image, image_key;
    try {
        const testimonialImage = req.files["testimonial_image"][0];

        const testimonialImageUpload = await FileUploadHelper.uploadToSpaces(testimonialImage);

        if (testimonialImageUpload) {
            image = testimonialImageUpload?.Location;
            image_key = testimonialImageUpload?.Key;
        }


        // Get the highest serial
        const lastTestimonialSerial = await TestimonialModel.findOne().sort({ testimonial_serial: -1 });

        // Determine the new serial
        const newTestimonialSerial = (lastTestimonialSerial?.testimonial_serial ?? 0) + 1;

       

        const testimonialsData = { ...req.body, image, image_key, testimonial_serial: newTestimonialSerial };

        const result = await TestimonialServices.postTestimonialService(testimonialsData);

        return sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Testimonial created successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error uploading files:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const getTestimonial = catchAsync(async (req, res) => {
    const result = await TestimonialServices.getTestimonialService();

    if (result.length === 0) {
        throw new AppError(404, "No data found");
    }

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'For Migration Worker info info retrieved successfully',
        data: result,
    });

});

const updateTestimonial: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const requestData = req.body;
        const forMigrationWorkerId = requestData?._id;

        // ========== Update ==========
        const result = await TestimonialServices.updateTestimonialService(forMigrationWorkerId, requestData);


        if (result) {
            return sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "For Migration Worker info Updated Successfully!",
                data: result
            });
        } else {
            throw new AppError(400, "For Migration Worker info Update Failed!");
        }
    } catch (error) {
        next(error);
    }
};


const deleteTestimonial = catchAsync(async (req, res, next) => {

    try {
        const TestimonialId = req.body._id
        const result = await TestimonialServices.deleteTestimonialService(TestimonialId);
        if (result) {
            if (req.body?.for_migrant_workers_tab_image_key) {
                await FileUploadHelper.deleteFromSpaces(req.body?.for_migrant_workers_tab_image_key);
            }
            if (req.body?.for_migrant_workers_tab_icon_key) {
                await FileUploadHelper.deleteFromSpaces(req.body?.for_migrant_workers_tab_icon_key);
            }
            return sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "For Migrant Worker info deleted successfully !",
            });
        } else {
            throw new AppError(400, "For Migrant Worker info delete failed !");
        }
    } catch (error: any) {
        next(error);
    }
    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "For Migrant Worker info deleted successfully !",
    });
});

export const TestimonialController = {
    postTestimonial,
    getTestimonial,
    updateTestimonial,
    deleteTestimonial
};