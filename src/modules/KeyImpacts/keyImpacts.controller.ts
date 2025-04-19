import { NextFunction, Request, Response } from 'express';
import * as fs from "fs";
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { FileUploadHelper } from '../../helpers/FileUploadHelper';
import sendResponse from '../../utils/sendResponse';
import { KeyImpactsModel } from './keyImpacts.model';
import { KeyImpactsService } from './keyImpacts.service';
import { IKeyImpacts } from './keyImpacts.interface';


const createKeyImpacts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.files && "keyImpacts_image" in req.files && req.body) {
      const requestData = req.body;
      const keyImpactsTitleEnglish = requestData?.keyImpacts_title_english
      const findKeyImpactsNameExist = await KeyImpactsModel.exists({ keyImpactsTitleEnglish });

      if (findKeyImpactsNameExist) {
        if (req.files?.keyImpacts_image?.[0]?.path) {
          try {
            fs.unlinkSync(req.files.keyImpacts_image[0].path);
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        }
        throw new AppError(httpStatus.BAD_REQUEST, 'This keyImpacts already exists!');
      }

      // Get the highest keyImpacts_serial
      const lastKeyImpacts = await KeyImpactsModel.findOne().sort({ keyImpacts_serial: -1 });

      // Determine the new keyImpacts_serial
      const newKeyImpactsSerial = lastKeyImpacts ? lastKeyImpacts.keyImpacts_serial + 1 : 1;


      // get the keyImpacts image and upload
      let keyImpacts_image;
      let keyImpacts_image_key;
      if (req.files && "keyImpacts_image" in req.files) {
        const keyImpactsImage = req.files["keyImpacts_image"][0];
        const keyImpacts_image_upload = await FileUploadHelper.uploadToSpaces(
          keyImpactsImage
        );
        keyImpacts_image = keyImpacts_image_upload?.Location;
        keyImpacts_image_key = keyImpacts_image_upload?.Key;
      }

      const data = { ...requestData, keyImpacts_image, keyImpacts_image_key, keyImpacts_serial: newKeyImpactsSerial };

      const result = await KeyImpactsService.createKeyImpactsServices(data);

      if (result) {
        return sendResponse<IKeyImpacts>(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "KeyImpacts Added Successfully !",
          data: result
        });
      } else {
        throw new AppError(400, "KeyImpacts Added Failed !");
      }
    } else {
      throw new AppError(400, "Image Upload Failed");
    }
  } catch (error: any) {
    next(error);
  }
});


const findKeyImpacts = catchAsync(async (req, res) => {
  const query = req.query
  const result = await KeyImpactsService.findKeyImpactsServices(query);

  // Check if the database collection is empty or no matching data is found
  if (!result || result.length === 0) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No data found.',
      data: [],
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'KeyImpacts retrieved successfully',
    data: result,
  });
});

const findAllDashboardKeyImpacts = catchAsync(async (req, res) => {
  const query = req.query
  const result = await KeyImpactsService.findAllDashboardKeyImpactservices(query);

  // Check if the database collection is empty or no matching data is found
  if (!result || result.length === 0) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No data found.',
      data: [],
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Dashboard keyImpactss retrieved successfully',
    data: result,
  });
});

const updateKeyImpacts = catchAsync(async (req, res, next) => {
  try {
    if (req.files && "keyImpacts_image" in req.files && req.body) {
      const requestData = req.body;

      // const findKeyImpactsNameExist = await KeyImpactsModel.exists({ keyImpacts_title: requestData?.keyImpacts_title });
      // if (findKeyImpactsNameExist) {
      //   if (req.files?.keyImpacts_image?.[0]?.path) {
      //     try {
      //       fs.unlinkSync(req.files.keyImpacts_image[0].path);
      //     } catch (error) {
      //       console.error("Error deleting file:", error);
      //     }
      //   }
      //   throw new AppError(httpStatus.BAD_REQUEST, 'This keyImpacts already exists!');
      // }

      // const findBrandSerialExist = await KeyImpactsModel.exists({
      //   keyImpacts_serial: requestData?.keyImpacts_serial,
      // });
      // if (findBrandSerialExist) {
      //   if (req.files?.keyImpacts_image?.[0]?.path) {
      //     try {
      //       fs.unlinkSync(req.files.keyImpacts_image[0].path);
      //     } catch (error) {
      //       console.error("Error deleting file:", error);
      //     }
      //   }
      //   throw new AppError(httpStatus.BAD_REQUEST, 'Serial Number Previously Added!');
      // }


      // Find the keyImpacts that currently has the given newSerial
      const existingKeyImpacts = await KeyImpactsModel.findOne({ keyImpacts_serial: requestData?.keyImpacts_serial });

      //console.log("hello",existingKeyImpacts);


      // Find the keyImpacts that is being updated
      const keyImpactsToUpdate = await KeyImpactsModel.findById(requestData?._id);

      //console.log(keyImpactsToUpdate);


      if (!keyImpactsToUpdate) {
        throw new Error("keyImpacts to update not found.");
      }

      if (existingKeyImpacts) {
        // Swap serials if another keyImpacts already has the newSerial
        await KeyImpactsModel.findByIdAndUpdate(existingKeyImpacts._id, { keyImpacts_serial: keyImpactsToUpdate.keyImpacts_serial });
      }

      // Update the requested keyImpacts with the new serial
      await KeyImpactsModel.findByIdAndUpdate(requestData?._id, { keyImpacts_serial: requestData?.keyImpacts_serial });

      // get the keyImpacts image and upload
      let keyImpacts_image;
      let keyImpacts_image_key;
      if (req.files && "keyImpacts_image" in req.files) {
        const keyImpactsImage = req.files["keyImpacts_image"][0];
        const keyImpacts_image_upload = await FileUploadHelper.uploadToSpaces(
          keyImpactsImage
        );
        keyImpacts_image = keyImpacts_image_upload?.Location;
        keyImpacts_image_key = keyImpacts_image_upload?.Key;
      }
      const data = { ...requestData, keyImpacts_image, keyImpacts_image_key };
      const result: IKeyImpacts | any = await KeyImpactsService.updateKeyImpactsServices(data, requestData?._id
      );

      if (result) {
        if (requestData?.keyImpacts_image_key) {
          await FileUploadHelper.deleteFromSpaces(
            requestData?.keyImpacts_image_key
          );
        }
        return sendResponse<IKeyImpacts>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "KeyImpacts Update Successfully !",
        });
      } else {
        throw new AppError(httpStatus.BAD_REQUEST, "KeyImpacts Update Failed !");
      }
    } else {
      const requestData = req.body;

      // const findKeyImpactsNameExist = await KeyImpactsModel.exists({ keyImpacts_title: requestData?.keyImpacts_title });
      // if (findKeyImpactsNameExist && requestData?._id !== findKeyImpactsNameExist?._id.toString()) {
      //   throw new AppError(httpStatus.BAD_REQUEST, 'Already added!');
      // }


      // Find the keyImpacts that currently has the given newSerial
      const existingKeyImpacts = await KeyImpactsModel.findOne({ keyImpacts_serial: requestData?.keyImpacts_serial });

      // Find the keyImpacts that is being updated
      const keyImpactsToUpdate = await KeyImpactsModel.findById(requestData?._id);

      //console.log(keyImpactsToUpdate);


      if (!keyImpactsToUpdate) {
        throw new Error("keyImpacts to update not found.");
      }

      if (existingKeyImpacts) {
        // Swap serials if another keyImpacts already has the newSerial
        await KeyImpactsModel.findByIdAndUpdate(existingKeyImpacts._id, { keyImpacts_serial: keyImpactsToUpdate.keyImpacts_serial });
      }

      // Update the requested keyImpacts with the new serial
      await KeyImpactsModel.findByIdAndUpdate(requestData?._id, { keyImpacts_serial: requestData?.keyImpacts_serial });

      const result: IKeyImpacts | any = await KeyImpactsService.updateKeyImpactsServices(requestData, requestData?._id
      );
      if (result) { // ✅ Check if result is not null
        return sendResponse<IKeyImpacts>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "KeyImpacts Updated Successfully !",
        });
      } else {
        throw new AppError(400, "KeyImpacts Updated Failed !");
      }

    }
  } catch (error: any) {
    next(error);
  }
});

const deleteKeyImpactsInfo = catchAsync(async (req, res, next) => {
  try {
    const keyImpacts_id = req.body._id
    const result = await KeyImpactsService.deleteKeyImpactsServices(keyImpacts_id);
    if (result) {
      if (req.body?.keyImpacts_image_key) {
        await FileUploadHelper.deleteFromSpaces(req.body?.keyImpacts_image_key);
      }
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "KeyImpacts deleted successfully !",
      });
    } else {
      throw new AppError(400, "KeyImpacts delete failed !");
    }
  } catch (error: any) {
    next(error);
  }
});

export const KeyImpactsController = {
  createKeyImpacts,
  findKeyImpacts,
  findAllDashboardKeyImpacts,
  updateKeyImpacts,
  deleteKeyImpactsInfo
};