import { NextFunction, Request, RequestHandler, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WhoWeAreService } from "./whoWeAre.service";
import httpStatus from 'http-status';
import { FileUploadHelper } from "../../helpers/FileUploadHelper";
import { IWhoWeAre } from "./whoWeAre.interface";
import AppError from "../../errors/AppError";

const postWhoWeAre: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    console.log(req.files)
    if (!req.files || !("who_we_are_image" in req.files)) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: 'Image is required',
        });
    }


    // let image, image_key;
    // let itemImage, itemImage_key;
    try {
        // const whoWeAreImage = req.files["who_we_are_image"][0];
        // const whoWeAreItemImage = req.files["who_we_are_services_image"][0];

        // const whoWeAreImageUpload = await FileUploadHelper.uploadToSpaces(whoWeAreImage);

        // if (whoWeAreImageUpload) {
        //     image = whoWeAreImageUpload?.Location;
        //     image_key = whoWeAreImageUpload?.Key;
        // }

        // const whoWeAreItemImageUpload = await FileUploadHelper.uploadToSpaces(whoWeAreItemImage);

        // if (whoWeAreItemImageUpload) {
        //     itemImage = whoWeAreItemImageUpload.Location;
        //     itemImage_key = whoWeAreItemImageUpload.Key;
        // }
        const files = req.files as Record<string, Express.Multer.File[]>;

        // Who We Are Main Image
        const whoWeAreImageUpload = await FileUploadHelper.uploadToSpaces(files["who_we_are_image"]?.[0]);
        const who_we_are_image = whoWeAreImageUpload?.Location;
        const who_we_are_image_key = whoWeAreImageUpload?.Key;

        // Services Image
        const servicesImageUpload = await FileUploadHelper.uploadToSpaces(files["who_we_are_services_image"]?.[0]);
        const services_image = servicesImageUpload?.Location;
        const services_image_key = servicesImageUpload?.Key;

        // Migrants Image
        // const migrantsImageUpload = await FileUploadHelper.uploadToSpaces(files["who_we_are_migrants_image"]?.[0]);
        // const migrants_image = migrantsImageUpload?.Location;
        // const migrants_image_key = migrantsImageUpload?.Key;

        // // Saved Image
        // const savedImageUpload = await FileUploadHelper.uploadToSpaces(files["who_we_are_saved_image"]?.[0]);
        // const saved_image = savedImageUpload?.Location;
        // const saved_image_key = savedImageUpload?.Key;

        // // Days Image
        // const daysImageUpload = await FileUploadHelper.uploadToSpaces(files["who_we_are_days_image"]?.[0]);
        // const days_image = daysImageUpload?.Location;
        // const days_image_key = daysImageUpload?.Key;

        // // Employees Image
        // const employeesImageUpload = await FileUploadHelper.uploadToSpaces(files["who_we_are_employees_image"]?.[0]);
        // const employees_image = employeesImageUpload?.Location;
        // const employees_image_key = employeesImageUpload?.Key;

        // Array to store additional_images URLs and keys
        const additional_images = [];

        // Handle additional_images
        const additionalImageFiles = files?.who_we_are_additional_images; // It's an array
        if (additionalImageFiles && Array.isArray(additionalImageFiles)) {
            for (const file of additionalImageFiles) {
                const imageUpload = await FileUploadHelper.uploadToSpaces(file);
                additional_images.push({
                    additional_image: imageUpload.Location,
                    additional_image_key: imageUpload.Key,
                });
            }
        }


        const whoWeAreData: IWhoWeAre = {
            who_we_are_title_english: req.body.who_we_are_title_english,
            who_we_are_title_bangla: req.body.who_we_are_title_bangla,
            who_we_are_description_english: req.body.who_we_are_description_english,
            who_we_are_description_bangla: req.body.who_we_are_description_bangla,
            who_we_are_details_english: req.body.who_we_are_details_english,
            who_we_are_details_bangla: req.body.who_we_are_details_bangla,
            who_we_are_image,
            who_we_are_image_key,
            who_we_are_additional_images: additional_images ?? [],

            who_we_are_services: {
                who_we_are_item_image: services_image,
                who_we_are_item_image_key: services_image_key,
                who_we_are_item_unit_english: Number(req.body.who_we_are_services_unit_english),
                who_we_are_item_unit_bangla: req.body.who_we_are_services_unit_bangla,
                who_we_are_item_title_english: req.body.who_we_are_services_title_english,
                who_we_are_item_title_bangla: req.body.who_we_are_services_title_bangla,
            },
            // who_we_are_migrants: {
            //   who_we_are_item_image: migrants_image,
            //   who_we_are_item_image_key: migrants_image_key,
            //   who_we_are_item_unit_english: Number(req.body.who_we_are_migrants_unit_english),
            //   who_we_are_item_unit_bangla: Number(req.body.who_we_are_migrants_unit_bangla),
            //   who_we_are_item_title_english: req.body.who_we_are_migrants_title_english,
            //   who_we_are_item_title_bangla: req.body.who_we_are_migrants_title_bangla,
            // },
            // who_we_are_saved: {
            //   who_we_are_item_image: saved_image,
            //   who_we_are_item_image_key: saved_image_key,
            //   who_we_are_item_unit_english: Number(req.body.who_we_are_saved_unit_english),
            //   who_we_are_item_unit_bangla: Number(req.body.who_we_are_saved_unit_bangla),
            //   who_we_are_item_title_english: req.body.who_we_are_saved_title_english,
            //   who_we_are_item_title_bangla: req.body.who_we_are_saved_title_bangla,
            // },
            // who_we_are_days: {
            //   who_we_are_item_image: days_image,
            //   who_we_are_item_image_key: days_image_key,
            //   who_we_are_item_unit_english: Number(req.body.who_we_are_days_unit_english),
            //   who_we_are_item_unit_bangla: Number(req.body.who_we_are_days_unit_bangla),
            //   who_we_are_item_title_english: req.body.who_we_are_days_title_english,
            //   who_we_are_item_title_bangla: req.body.who_we_are_days_title_bangla,
            // },
            // who_we_are_employees: {
            //   who_we_are_item_image: employees_image,
            //   who_we_are_item_image_key: employees_image_key,
            //   who_we_are_item_unit_english: Number(req.body.who_we_are_employees_unit_english),
            //   who_we_are_item_unit_bangla: Number(req.body.who_we_are_employees_unit_bangla),
            //   who_we_are_item_title_english: req.body.who_we_are_employees_title_english,
            //   who_we_are_item_title_bangla: req.body.who_we_are_employees_title_bangla,
            // },
        };
        console.log(whoWeAreData, 'whoWeAreData');


        const result = await WhoWeAreService.postWhoWeAreServices(whoWeAreData);

        return sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "About us info created successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const getWhoWeAre = catchAsync(async (req, res) => {
    const result = await WhoWeAreService.getWhoWeAreService();

    if (result.length === 0) {
        throw new AppError(404, "No data found");
    }

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'About info retrieved successfully',
        data: result,
    });

});


export const WhoWeAreController = {
    postWhoWeAre,
    getWhoWeAre,

};