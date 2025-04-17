import { Request, Response, NextFunction, RequestHandler } from "express";
import AppError from "../../errors/AppError";
import sendResponse from "../../utils/sendResponse";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import { ChecklistServices } from "./checklist.services";

const postChecklist: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {


    const result = await ChecklistServices.postChecklistService(req.body);

    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Checklist created successfully",
        data: result,
    });
};

const getChecklist = catchAsync(async (req, res) => {
    const result = await ChecklistServices.getChecklistService();

    if (result.length === 0) {
        throw new AppError(404, "No data found");
    }

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Checklist retrieved successfully',
        data: result,
    });

});

const updateChecklist: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const requestData = req.body;
        const checklistId = requestData?._id;

        // ========== Update ==========
        const result = await ChecklistServices.updateChecklistService(checklistId, requestData);


        if (result) {
            return sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "Checklist Updated Successfully!",
                data: result
            });
        } else {
            throw new AppError(400, "Checklist Update Failed!");
        }
    } catch (error) {
        next(error);
    }
};


const deleteChecklist = catchAsync(async (req, res, next) => {
    const ChecklistId = req.body._id
    const result = await ChecklistServices.deleteChecklistService(ChecklistId);

    return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Checklist deleted successfully !",
    });
});

export const ChecklistController = {
    postChecklist,
    getChecklist,
    updateChecklist,
    deleteChecklist
};