import { Request, Response, NextFunction, RequestHandler } from "express";
import { IBMETRegistration } from "./BMETRegistration.interface";
import AppError from "../../Errors/AppError";
import { postBMETRegistrationService } from "./BMETRegistration.service";
import sendResponse from "../../Utils/sendResponse";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import statusCodes from 'http-status';

export const postBMETRegistration: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const requestData = req.body;
        let educational_qualifications = JSON.parse(req.body.educational_qualifications)
        let languages = JSON.parse(requestData?.languages)
        //console.log(requestData);


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

        const data: IBMETRegistration = {
            ...requestData,
            passport_image,
            passport_image_key,
            supporting_documents,
            educational_qualifications,
            languages
        };

        const result = await postBMETRegistrationService(data);

        return sendResponse<IBMETRegistration>(res, {
            statusCode: statusCodes.CREATED,
            success: true,
            message: "BMET Registration Created Successfully!",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};