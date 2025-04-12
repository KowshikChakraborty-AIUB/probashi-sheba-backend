import { Request, Response, NextFunction, RequestHandler } from "express";
import { IBMETRegistration } from "./BMETRegistration.interface";
import AppError from "../../Errors/AppError";
import { postBMETRegistrationService } from "./BMETRegistration.service";
import sendResponse from "../../Utils/sendResponse";

export const postBMETRegistration: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requestData = req.body;

    // If you're dealing with file uploads (like passport images), handle that here
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

    const data: IBMETRegistration = {
      ...requestData,
      passport_image,
      passport_image_key,
    };

    const result = await postBMETRegistrationService(data);

    return sendResponse<IBMETRegistration>(res, {
      statusCode: http-s.CREATED,
      success: true,
      message: "BMET Registration Created Successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};