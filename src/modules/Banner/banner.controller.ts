import { NextFunction, Request, Response } from 'express';
import { BannerService } from './banner.service';
import { BannerModel } from './banner.model';
import * as fs from "fs";
import { IBanner } from './banner.interface';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { FileUploadHelper } from '../../helpers/FileUploadHelper';
import sendResponse from '../../utils/sendResponse';


const createBanner = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.files && "banner_image" in req.files && req.body) {
      const requestData = req.body;
      const bannerTitle = requestData?.banner_title
      const findBannerNameExist = await BannerModel.exists({ bannerTitle });

      if (findBannerNameExist) {
        if (req.files?.banner_image?.[0]?.path) {
          try {
            fs.unlinkSync(req.files.banner_image[0].path);
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        }
        throw new AppError(httpStatus.BAD_REQUEST, 'This banner already exists!');
      }

      // Get the highest banner_serial
      const lastBanner = await BannerModel.findOne().sort({ banner_serial: -1 });

      // Determine the new banner_serial
      const newBannerSerial = lastBanner ? lastBanner.banner_serial + 1 : 1;


      // get the brand image and upload
      let banner_image;
      let banner_image_key;
      if (req.files && "banner_image" in req.files) {
        const bannerImage = req.files["banner_image"][0];
        const banner_image_upload = await FileUploadHelper.uploadToSpaces(
          bannerImage
        );
        banner_image = banner_image_upload?.Location;
        banner_image_key = banner_image_upload?.Key;
      }

      const data = { ...requestData, banner_image, banner_image_key, banner_serial: newBannerSerial };

      const result = await BannerService.createBannerServices(data);

      if (result) {
        return sendResponse<IBanner>(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Banner Added Successfully !",
          data: result
        });
      } else {
        throw new AppError(400, "Banner Added Failed !");
      }
    } else {
      throw new AppError(400, "Image Upload Failed");
    }
  } catch (error: any) {
    next(error);
  }
});


const findBanners = catchAsync(async (req, res) => {
  const query = req.query
  const result = await BannerService.findBannersServices(query);

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
    message: 'Banners retrieved successfully',
    data: result,
  });
});

const findAllDashboardBanners = catchAsync(async (req, res) => {
  const query = req.query
  const result = await BannerService.findAllDashboardBannerServices(query);

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
    message: 'Dashboard banners retrieved successfully',
    data: result,
  });
});

const updateBanner = catchAsync(async (req, res, next) => {
  try {
    if (req.files && "banner_image" in req.files && req.body) {
      const requestData = req.body;

      // const findBannerNameExist = await BannerModel.exists({ banner_title: requestData?.banner_title });
      // if (findBannerNameExist) {
      //   if (req.files?.banner_image?.[0]?.path) {
      //     try {
      //       fs.unlinkSync(req.files.banner_image[0].path);
      //     } catch (error) {
      //       console.error("Error deleting file:", error);
      //     }
      //   }
      //   throw new AppError(httpStatus.BAD_REQUEST, 'This banner already exists!');
      // }

      // const findBrandSerialExist = await BannerModel.exists({
      //   banner_serial: requestData?.banner_serial,
      // });
      // if (findBrandSerialExist) {
      //   if (req.files?.banner_image?.[0]?.path) {
      //     try {
      //       fs.unlinkSync(req.files.banner_image[0].path);
      //     } catch (error) {
      //       console.error("Error deleting file:", error);
      //     }
      //   }
      //   throw new AppError(httpStatus.BAD_REQUEST, 'Serial Number Previously Added!');
      // }


      // Find the brand that currently has the given newSerial
      const existingBanner = await BannerModel.findOne({ banner_serial: requestData?.banner_serial });

      //console.log("hello",existingBanner);


      // Find the brand that is being updated
      const bannerToUpdate = await BannerModel.findById(requestData?._id);

      //console.log(bannerToUpdate);


      if (!bannerToUpdate) {
        throw new Error("brand to update not found.");
      }

      if (existingBanner) {
        // Swap serials if another brand already has the newSerial
        await BannerModel.findByIdAndUpdate(existingBanner._id, { banner_serial: bannerToUpdate.banner_serial });
      }

      // Update the requested brand with the new serial
      await BannerModel.findByIdAndUpdate(requestData?._id, { banner_serial: requestData?.banner_serial });

      // get the brand image and upload
      let banner_image;
      let banner_image_key;
      if (req.files && "banner_image" in req.files) {
        const bannerImage = req.files["banner_image"][0];
        const banner_image_upload = await FileUploadHelper.uploadToSpaces(
          bannerImage
        );
        banner_image = banner_image_upload?.Location;
        banner_image_key = banner_image_upload?.Key;
      }
      const data = { ...requestData, banner_image, banner_image_key };
      const result: IBanner | any = await BannerService.updateBannerServices(data, requestData?._id
      );

      if (result) {
        if (requestData?.banner_image_key) {
          await FileUploadHelper.deleteFromSpaces(
            requestData?.banner_image_key
          );
        }
        return sendResponse<IBanner>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Banner Update Successfully !",
        });
      } else {
        throw new AppError(httpStatus.BAD_REQUEST, "Banner Update Failed !");
      }
    } else {
      const requestData = req.body;

      // const findBannerNameExist = await BannerModel.exists({ banner_title: requestData?.banner_title });
      // if (findBannerNameExist && requestData?._id !== findBannerNameExist?._id.toString()) {
      //   throw new AppError(httpStatus.BAD_REQUEST, 'Already added!');
      // }


      // Find the brand that currently has the given newSerial
      const existingBanner = await BannerModel.findOne({ banner_serial: requestData?.banner_serial });

      // Find the brand that is being updated
      const bannerToUpdate = await BannerModel.findById(requestData?._id);

      //console.log(bannerToUpdate);


      if (!bannerToUpdate) {
        throw new Error("banner to update not found.");
      }

      if (existingBanner) {
        // Swap serials if another banner already has the newSerial
        await BannerModel.findByIdAndUpdate(existingBanner._id, { banner_serial: bannerToUpdate.banner_serial });
      }

      // Update the requested banner with the new serial
      await BannerModel.findByIdAndUpdate(requestData?._id, { banner_serial: requestData?.banner_serial });

      const result: IBanner | any = await BannerService.updateBannerServices(requestData, requestData?._id
      );
      if (result) { // ✅ Check if result is not null
        return sendResponse<IBanner>(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Banner Updated Successfully !",
        });
      } else {
        throw new AppError(400, "Banner Updated Failed !");
      }

    }
  } catch (error: any) {
    next(error);
  }
});

const deleteBannerInfo = catchAsync(async (req, res, next) => {
  try {
    const banner_id = req.body._id
    const result = await BannerService.deleteBannerServices(banner_id);
    if (result) {
      if (req.body?.banner_image_key) {
        await FileUploadHelper.deleteFromSpaces(req.body?.banner_image_key);
      }
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Banner deleted successfully !",
      });
    } else {
      throw new AppError(400, "Banner delete failed !");
    }
  } catch (error: any) {
    next(error);
  }
});

export const BannerController = {
  createBanner,
  findBanners,
  findAllDashboardBanners,
  updateBanner,
  deleteBannerInfo
};