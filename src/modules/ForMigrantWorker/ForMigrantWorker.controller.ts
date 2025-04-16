import { Request, Response, NextFunction, RequestHandler } from "express";
import AppError from "../../errors/AppError";
import sendResponse from "../../utils/sendResponse";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import statusCodes from 'http-status';
import catchAsync from "../../utils/catchAsync";
import { IForMigrantWorker } from "./ForMigrantWorker.interface";
import { ForMigrantWorkerServices } from "./ForMigrantWorker.service";
import { ForMigrantWorkerModel } from "./ForMigrantWorker.model";

const postForMigrantWorker: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const requestData = req.body;

        // Handle passport image
        let passport_image = "";
        let passport_image_key = "";

        if (req.files && "passport_image" in req.files) {

            const passportImg = req.files["passport_image"][0];
            const uploaded = await FileUploadHelper.uploadToSpaces(passportImg); // assuming your helper
            passport_image = uploaded?.Location;
            passport_image_key = uploaded?.Key;
        } else {
            throw new AppError(400, "Passport image is required.");
        }

        // Handle supporting documents
        let supporting_documents = [];
        if (req.files && "supporting_documents" in req.files) {
            const files = req.files["supporting_documents"];
            const documentNames: string[] = JSON.parse(req.body.document_names || "[]");

            if (documentNames.length !== files.length) {
                throw new AppError(400, "Number of document names and files must match");
            }

            for (let i = 0; i < files.length; i++) {
                const uploaded = await FileUploadHelper.uploadToSpaces(files[i]);
                supporting_documents.push({
                    document_name: documentNames[i],
                    document_image: uploaded?.Location,
                    document_image_key: uploaded?.Key,
                });
            }
        }

        const data: IForMigrantWorker = {
            ...requestData,
            passport_image,
            passport_image_key,

        };

        const result = await ForMigrantWorkerServices.postForMigrantWorkerService(data);

        return sendResponse<IForMigrantWorker>(res, {
            statusCode: statusCodes.CREATED,
            success: true,
            message: "For Migration Worker info Created Successfully!",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getForMigrantWorker = catchAsync(async (req, res) => {
    const result = await ForMigrantWorkerServices.getForMigrantWorkerService();

    //console.log(result);
    //console.log(result.length);

    if (result.length === 0) {
        throw new AppError(404, "No data found");
    }

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'BMET registration info retrieved successfully',
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
                statusCode: statusCodes.OK,
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


export const ForMigrantWorkerController = {
    postForMigrantWorker,
    getForMigrantWorker,
    updateForMigrantWorker,
};