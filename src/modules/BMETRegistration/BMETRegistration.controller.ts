import { Request, Response, NextFunction, RequestHandler } from "express";
import { IBMETRegistration } from "./BMETRegistration.interface";
import AppError from "../../Errors/AppError";
import { getBMETRegistrationService, postBMETRegistrationService, updateBMETRegistrationService } from "./BMETRegistration.service";
import sendResponse from "../../Utils/sendResponse";
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import statusCodes from 'http-status';
import BMETModel from "./BMETRegistration.model";
import catchAsync from "../../Utils/catchAsync";

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

export const getBMETRegistration = catchAsync(async (req, res) => {
    const result = await getBMETRegistrationService();

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

export const updateBMETRegistration: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const requestData = req.body;
      const bmetId = requestData?._id;
  
      // Parse stringified fields
    //   requestData.educational_qualifications = JSON.parse(requestData.educational_qualifications || "[]");
    //   requestData.languages = JSON.parse(requestData.languages || "[]");
  
      // Fetch existing data to delete old files later
      const existingData = await BMETModel.findById(bmetId);
      if (!existingData) throw new AppError(404, "BMET record not found");
  
      // ========== Passport Upload ==========
      if (req.files && "passport_image" in req.files) {
        const passportImg = req.files["passport_image"][0];
        const uploaded = await FileUploadHelper.uploadToSpaces(passportImg);
        requestData.passport_image = uploaded?.Location;
        requestData.passport_image_key = uploaded?.Key;
  
        if (existingData.passport_image_key) {
          await FileUploadHelper.deleteFromSpaces(existingData.passport_image_key);
        }
      }
  
      // ========== Supporting Documents ==========
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // type assertion
      const documentNames = JSON.parse(requestData.document_names || "[]"); // From frontend
    //   const documentNames = requestData.document_names || []; // From frontend
      const documentImages = files?.["supporting_documents"] || [];
      
  
      if (documentNames.length !== documentImages.length) {
        throw new AppError(400, "Mismatch between document names and uploaded files");
      }
  
      // 🔥 Delete existing supporting documents from cloud
      if (Array.isArray(existingData?.supporting_documents) && existingData.supporting_documents.length > 0) {
        for (const doc of existingData.supporting_documents) {
          if (doc.document_image_key) {
            await FileUploadHelper.deleteFromSpaces(doc.document_image_key);
          }
        }
      }
  
      // 📥 Upload new supporting documents
      const supporting_documents = [];
      for (let i = 0; i < documentNames.length; i++) {
        const uploaded = await FileUploadHelper.uploadToSpaces(documentImages[i]);
        supporting_documents.push({
          document_name: documentNames[i],
          document_image: uploaded?.Location,
          document_image_key: uploaded?.Key,
        });
      }
  
      requestData.supporting_documents = supporting_documents;
  
      // ========== Update ==========
      const result = await updateBMETRegistrationService(bmetId, requestData);
      
  
      if (result) {
        return sendResponse(res, {
          statusCode: statusCodes.OK,
          success: true,
          message: "BMET Registration Updated Successfully!",
          data: result
        });
      } else {
        throw new AppError(400, "BMET Registration Update Failed!");
      }
    } catch (error) {
      next(error);
    }
  };
  