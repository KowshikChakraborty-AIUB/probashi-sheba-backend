import { Request, Response, NextFunction, RequestHandler } from "express";
import AppError from "../../errors/AppError";
import sendResponse from "../../utils/sendResponse";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import { MyDocumentModel } from "./myDocument.model";
import { MyDocumentServices } from "./myDocument.service";


const postMyDocument: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (!req.files || !("document_image" in req.files)) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: 'MyDocument image are required',
        });
    }


    let document_image, document_image_key;
    try {
        const myDocumentImage = req.files["document_image"][0];

        const myDocumentImageUpload = await FileUploadHelper.uploadToSpaces(myDocumentImage);

        if (myDocumentImageUpload) {
            document_image = myDocumentImageUpload?.Location;
            document_image_key = myDocumentImageUpload?.Key;
        }


        const myDocumentsData = { ...req.body, document_image, document_image_key };

        const result = await MyDocumentServices.postMyDocumentService(myDocumentsData);

        return sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "MyDocument created successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const getMyDocument = catchAsync(async (req, res) => {
    const result = await MyDocumentServices.getMyDocumentService();

    if (result.length === 0) {
        throw new AppError(404, "No data found");
    }

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'My Document retrieved successfully',
        data: result,
    });

});

const updateMyDocument: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const requestData = req.body;
        const forMigrationWorkerId = requestData?._id;

        const existingData = await MyDocumentModel.findById(forMigrationWorkerId);
        if (!existingData) throw new AppError(404, "Document not found");

           // ========== Passport Upload ==========
    if (req.files && "document_image" in req.files) {
        const documentImg = req.files["document_image"][0];
        const uploaded = await FileUploadHelper.uploadToSpaces(documentImg);
        requestData.document_image = uploaded?.Location;
        requestData.document_image_key = uploaded?.Key;
  
        if (existingData.document_image_key) {
          await FileUploadHelper.deleteFromSpaces(existingData.document_image_key);
        }
      }

        // ========== Update ==========
        const result = await MyDocumentServices.updateMyDocumentService(forMigrationWorkerId, requestData);


        if (result) {
            return sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "My Document Updated Successfully!",
                data: result
            });
        } else {
            throw new AppError(400, "My Document Update Failed!");
        }
    } catch (error) {
        next(error);
    }
};


const deleteMyDocument = catchAsync(async (req, res, next) => {

    try {
        const MyDocumentId = req.body._id
        const result = await MyDocumentServices.deleteMyDocumentService(MyDocumentId);
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
                message: "My Document deleted successfully !",
            });
        } else {
            throw new AppError(400, "My Document delete failed !");
        }
    } catch (error: any) {
        next(error);
    }
    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Document deleted successfully !",
    });
});

export const MyDocumentController = {
    postMyDocument,
    getMyDocument,
    updateMyDocument,
    deleteMyDocument
};