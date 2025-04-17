import { Request, Response, NextFunction, RequestHandler } from "express";
import AppError from "../../errors/AppError";
import sendResponse from "../../utils/sendResponse";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import { ForMigrantWorkerServices } from "./testimonial.service";
import { ForMigrantWorkerModel } from "./testimonial.model";

const postForMigrantWorker: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (!req.files || !("for_migrant_workers_tab_image" in req.files) || !("for_migrant_workers_tab_icon" in req.files)) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: 'Image and Icon are required',
        });
    }


    let image, image_key;
    let icon, icon_key;
    try {
        const tabImage = req.files["for_migrant_workers_tab_image"][0];
        const tabIcon = req.files["for_migrant_workers_tab_icon"][0];

        const tabImageUpload = await FileUploadHelper.uploadToSpaces(tabImage);

        if (tabImageUpload) {
            image = tabImageUpload?.Location;
            image_key = tabImageUpload?.Key;
        }

        const tabIconUpload = await FileUploadHelper.uploadToSpaces(tabIcon);

        if (tabIconUpload) {
            icon = tabIconUpload.Location;
            icon_key = tabIconUpload.Key;
        }

        // Get the highest serial
        const lastForMigrantWorkerSerial = await ForMigrantWorkerModel.findOne().sort({ for_migrant_workers_tab_serial: -1 });

        // Determine the new serial
        const newForMigrantWorkerSerial = (lastForMigrantWorkerSerial?.for_migrant_workers_tab_serial ?? 0) + 1;

        const { for_migrant_workers_tab_contents } = req.body;
        console.log(for_migrant_workers_tab_contents, 'for_migrant_workers_tab_contents');

        const parsedContents = JSON.parse(for_migrant_workers_tab_contents);

        const forMigrantWorkersData = { ...req.body, icon, icon_key, image, image_key, for_migrant_workers_tab_serial: newForMigrantWorkerSerial, for_migrant_workers_tab_contents: parsedContents };

        const result = await ForMigrantWorkerServices.postForMigrantWorkerService(forMigrantWorkersData);

        return sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "For Migrant Worker info created successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error uploading files:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const getForMigrantWorker = catchAsync(async (req, res) => {
    const result = await ForMigrantWorkerServices.getForMigrantWorkerService();

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

const updateForMigrantWorker: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const requestData = req.body;
        const forMigrationWorkerId = requestData?._id;

        // ========== Update ==========
        const result = await ForMigrantWorkerServices.updateForMigrantWorkerService(forMigrationWorkerId, requestData);


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


const deleteForMigrantWorker = catchAsync(async (req, res, next) => {

    try {
        const forMigrantWorkerId = req.body._id
        const result = await ForMigrantWorkerServices.deleteForMigrantWorkerService(forMigrantWorkerId);
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

export const ForMigrantWorkerController = {
    postForMigrantWorker,
    getForMigrantWorker,
    updateForMigrantWorker,
    deleteForMigrantWorker
};