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
        const migrantsImageUpload = await FileUploadHelper.uploadToSpaces(files["who_we_are_migrants_image"]?.[0]);
        const migrants_image = migrantsImageUpload?.Location;
        const migrants_image_key = migrantsImageUpload?.Key;

        // // Saved Image
        const savedImageUpload = await FileUploadHelper.uploadToSpaces(files["who_we_are_saved_image"]?.[0]);
        const saved_image = savedImageUpload?.Location;
        const saved_image_key = savedImageUpload?.Key;

        // // Days Image
        const daysImageUpload = await FileUploadHelper.uploadToSpaces(files["who_we_are_days_image"]?.[0]);
        const days_image = daysImageUpload?.Location;
        const days_image_key = daysImageUpload?.Key;

        // // Employees Image
        const employeesImageUpload = await FileUploadHelper.uploadToSpaces(files["who_we_are_employees_image"]?.[0]);
        const employees_image = employeesImageUpload?.Location;
        const employees_image_key = employeesImageUpload?.Key;

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
            who_we_are_migrants: {
                who_we_are_item_image: migrants_image,
                who_we_are_item_image_key: migrants_image_key,
                who_we_are_item_unit_english: Number(req.body.who_we_are_migrants_unit_english),
                who_we_are_item_unit_bangla: req.body.who_we_are_migrants_unit_bangla,
                who_we_are_item_title_english: req.body.who_we_are_migrants_title_english,
                who_we_are_item_title_bangla: req.body.who_we_are_migrants_title_bangla,
            },
            who_we_are_saved: {
                who_we_are_item_image: saved_image,
                who_we_are_item_image_key: saved_image_key,
                who_we_are_item_unit_english: Number(req.body.who_we_are_saved_unit_english),
                who_we_are_item_unit_bangla: req.body.who_we_are_saved_unit_bangla,
                who_we_are_item_title_english: req.body.who_we_are_saved_title_english,
                who_we_are_item_title_bangla: req.body.who_we_are_saved_title_bangla,
            },
            who_we_are_days: {
                who_we_are_item_image: days_image,
                who_we_are_item_image_key: days_image_key,
                who_we_are_item_unit_english: Number(req.body.who_we_are_days_unit_english),
                who_we_are_item_unit_bangla: req.body.who_we_are_days_unit_bangla,
                who_we_are_item_title_english: req.body.who_we_are_days_title_english,
                who_we_are_item_title_bangla: req.body.who_we_are_days_title_bangla,
            },
            who_we_are_employees: {
                who_we_are_item_image: employees_image,
                who_we_are_item_image_key: employees_image_key,
                who_we_are_item_unit_english: Number(req.body.who_we_are_employees_unit_english),
                who_we_are_item_unit_bangla: req.body.who_we_are_employees_unit_bangla,
                who_we_are_item_title_english: req.body.who_we_are_employees_title_english,
                who_we_are_item_title_bangla: req.body.who_we_are_employees_title_bangla,
            },
        };
        // console.log(whoWeAreData, 'whoWeAreData');


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

    if (!result) {
        throw new AppError(404, "No data found");
    }

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'About info retrieved successfully',
        data: result,
    });

});

// const updateWhoWeAre: RequestHandler = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<any> => {
//     try {
//         const requestData = req.body;
//         // console.log(requestData, 'requestData');


//         // Restructure the data to match the schema
//         const updateData: Partial<IWhoWeAre> = {
//             ...requestData
//         };

//         // Handle services update if any services fields are present
//         if (requestData.who_we_are_services_title_english ||
//             requestData.who_we_are_services_title_bangla ||
//             requestData.who_we_are_services_unit_english ||
//             requestData.who_we_are_services_unit_bangla) {

//             updateData.who_we_are_services = {
//                 ...updateData.who_we_are_services,
//                 who_we_are_item_title_english: requestData.who_we_are_services_title_english,
//                 who_we_are_item_title_bangla: requestData.who_we_are_services_title_bangla,
//                 who_we_are_item_unit_english: requestData.who_we_are_services_unit_english
//                     ? Number(requestData.who_we_are_services_unit_english)
//                     : undefined,
//                 who_we_are_item_unit_bangla: requestData.who_we_are_services_unit_bangla
//             };
//         }

//         // ========== Update ==========
//         const result = await WhoWeAreService.updateWhoWeAreService(updateData);

//         if (result) {
//             return sendResponse(res, {
//                 statusCode: httpStatus.OK,
//                 success: true,
//                 message: "About info Updated Successfully!",
//                 data: result
//             });
//         } else {
//             throw new AppError(400, "About info Update Failed!");
//         }
//     } catch (error) {
//         next(error);
//     }
// };

const updateWhoWeAre: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const requestData = req.body;

        const files = req.files as Record<string, Express.Multer.File[]>;

        const currentData = await WhoWeAreService.getWhoWeAreService();
        console.log(currentData);
        
        // Initialize updateData with basic fields
        const updateData: Partial<IWhoWeAre> = {
            ...requestData
        };

        // Handle main image update if provided
        if (files?.who_we_are_image?.[0]) {
            const upload = await FileUploadHelper.uploadToSpaces(files.who_we_are_image[0]);
            updateData.who_we_are_image = upload.Location;
            updateData.who_we_are_image_key = upload.Key;
        }

        // Handle additional images update if provided
        if (files?.who_we_are_additional_images || requestData.who_we_are_additional_images) {
            const existingImages = currentData.who_we_are_additional_images || [];
            const additional_images = [...existingImages]

            // Handle new files from request body (if any)
            if (requestData?.who_we_are_additional_images && Array.isArray(requestData.who_we_are_additional_images)) {
                for (const file of requestData.who_we_are_additional_images) {
                    // Only process if it's actually a new file (not just a URL string)
                    if (file instanceof File || file instanceof Buffer) {
                        const upload = await FileUploadHelper.uploadToSpaces(file);
                        additional_images.push({
                            additional_image: upload.Location,
                            additional_image_key: upload.Key,
                        });
                    }
                }
            }

            if (files?.who_we_are_additional_images) {
                for (const file of files.who_we_are_additional_images) {
                    const upload = await FileUploadHelper.uploadToSpaces(file);
                    additional_images.push({
                        additional_image: upload.Location,
                        additional_image_key: upload.Key,
                    });
                }
                updateData.who_we_are_additional_images = additional_images;
            }
        }

        // services
        if (requestData.who_we_are_services_title_english ||
            requestData.who_we_are_services_title_bangla ||
            requestData.who_we_are_services_unit_english ||
            requestData.who_we_are_services_unit_bangla ||
            requestData.who_we_are_services_image ||
            files?.who_we_are_services_image?.[0]) {

            const servicesData: any = {
                who_we_are_item_image: requestData.who_we_are_services_image,
                who_we_are_item_title_english: requestData.who_we_are_services_title_english,
                who_we_are_item_title_bangla: requestData.who_we_are_services_title_bangla,
                who_we_are_item_unit_english: requestData.who_we_are_services_unit_english
                    ? Number(requestData.who_we_are_services_unit_english)
                    : undefined,
                who_we_are_item_unit_bangla: requestData.who_we_are_services_unit_bangla
            };

            if (files?.who_we_are_services_image?.[0]) {
                const upload = await FileUploadHelper.uploadToSpaces(files.who_we_are_services_image[0]);
                servicesData.who_we_are_item_image = upload.Location;
                servicesData.who_we_are_item_image_key = upload.Key;
            }

            updateData.who_we_are_services = servicesData;
        }

        // migrants:
        if (requestData.who_we_are_migrants_title_english ||
            requestData.who_we_are_migrants_title_bangla ||
            requestData.who_we_are_migrants_unit_english ||
            requestData.who_we_are_migrants_unit_bangla ||
            requestData.who_we_are_migrants_image ||
            files?.who_we_are_migrants_image?.[0]) {

            const migrantsData: any = {
                who_we_are_item_image: requestData.who_we_are_migrants_image,
                who_we_are_item_title_english: requestData.who_we_are_migrants_title_english,
                who_we_are_item_title_bangla: requestData.who_we_are_migrants_title_bangla,
                who_we_are_item_unit_english: requestData.who_we_are_migrants_unit_english
                    ? Number(requestData.who_we_are_migrants_unit_english)
                    : undefined,
                who_we_are_item_unit_bangla: requestData.who_we_are_migrants_unit_bangla
            };

            if (files?.who_we_are_migrants_image?.[0]) {
                const upload = await FileUploadHelper.uploadToSpaces(files.who_we_are_migrants_image[0]);
                migrantsData.who_we_are_item_image = upload.Location;
                migrantsData.who_we_are_item_image_key = upload.Key;
            }

            updateData.who_we_are_migrants = migrantsData;
        }

        // saved
        if (requestData.who_we_are_saved_title_english ||
            requestData.who_we_are_saved_title_bangla ||
            requestData.who_we_are_saved_unit_english ||
            requestData.who_we_are_saved_unit_bangla ||
            requestData.who_we_are_saved_image ||
            files?.who_we_are_saved_image?.[0]) {

            const savedData: any = {
                who_we_are_item_image: requestData.who_we_are_saved_image,
                who_we_are_item_title_english: requestData.who_we_are_saved_title_english,
                who_we_are_item_title_bangla: requestData.who_we_are_saved_title_bangla,
                who_we_are_item_unit_english: requestData.who_we_are_saved_unit_english
                    ? Number(requestData.who_we_are_saved_unit_english)
                    : undefined,
                who_we_are_item_unit_bangla: requestData.who_we_are_saved_unit_bangla
            };

            if (files?.who_we_are_saved_image?.[0]) {
                const upload = await FileUploadHelper.uploadToSpaces(files.who_we_are_saved_image[0]);
                savedData.who_we_are_item_image = upload.Location;
                savedData.who_we_are_item_image_key = upload.Key;
            }

            updateData.who_we_are_saved = savedData;
        }

        // days
        if (requestData.who_we_are_days_title_english ||
            requestData.who_we_are_days_title_bangla ||
            requestData.who_we_are_days_unit_english ||
            requestData.who_we_are_days_unit_bangla ||
            requestData.who_we_are_days_image ||
            files?.who_we_are_days_image?.[0]) {

            const daysData: any = {
                who_we_are_item_image: requestData.who_we_are_days_image,
                who_we_are_item_title_english: requestData.who_we_are_days_title_english,
                who_we_are_item_title_bangla: requestData.who_we_are_days_title_bangla,
                who_we_are_item_unit_english: requestData.who_we_are_days_unit_english
                    ? Number(requestData.who_we_are_days_unit_english)
                    : undefined,
                who_we_are_item_unit_bangla: requestData.who_we_are_days_unit_bangla
            };

            if (files?.who_we_are_days_image?.[0]) {
                const upload = await FileUploadHelper.uploadToSpaces(files.who_we_are_days_image[0]);
                daysData.who_we_are_item_image = upload.Location;
                daysData.who_we_are_item_image_key = upload.Key;
            }

            updateData.who_we_are_days = daysData;
        }

        // employees
        if (requestData.who_we_are_employees_title_english ||
            requestData.who_we_are_employees_title_bangla ||
            requestData.who_we_are_employees_unit_english ||
            requestData.who_we_are_employees_unit_bangla ||
            requestData.who_we_are_employees_image ||
            files?.who_we_are_employees_image?.[0]) {

            const employeesData: any = {
                who_we_are_item_image: requestData.who_we_are_employees_image,
                who_we_are_item_title_english: requestData.who_we_are_employees_title_english,
                who_we_are_item_title_bangla: requestData.who_we_are_employees_title_bangla,
                who_we_are_item_unit_english: requestData.who_we_are_employees_unit_english
                    ? Number(requestData.who_we_are_employees_unit_english)
                    : undefined,
                who_we_are_item_unit_bangla: requestData.who_we_are_employees_unit_bangla
            };

            if (files?.who_we_are_employees_image?.[0]) {
                const upload = await FileUploadHelper.uploadToSpaces(files.who_we_are_employees_image[0]);
                employeesData.who_we_are_item_image = upload.Location;
                employeesData.who_we_are_item_image_key = upload.Key;
            }

            updateData.who_we_are_employees = employeesData;
        }

        // ========== Update ==========
        const result = await WhoWeAreService.updateWhoWeAreService(updateData);

        if (result) {
            return sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "About info Updated Successfully!",
                data: result
            });
        } else {
            throw new AppError(400, "About info Update Failed!");
        }
    } catch (error) {
        next(error);
    }
};
export const WhoWeAreController = {
    postWhoWeAre,
    getWhoWeAre,
    updateWhoWeAre,
};