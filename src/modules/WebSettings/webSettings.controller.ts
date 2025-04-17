
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { FileUploadHelper } from '../../helpers/FileUploadHelper';
import { WebSettingsService } from './webSettings.services';
import AppError from '../../errors/AppError';



const createSettings = catchAsync(async (req, res) => {
    if (!req.files || !("logo" in req.files) || !("favicon" in req.files)) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: 'Logo and favicon are required',
        });
    }


    let logo, logo_key;
    let favicon, favicon_key;

    try {
        const logoImage = req.files["logo"][0];
        const faviconImage = req.files["favicon"][0];

        const logoUpload = await FileUploadHelper.uploadToSpaces(logoImage);

        if (logoUpload) {
            logo = logoUpload?.Location;
            logo_key = logoUpload?.Key;
        }

        const faviconUpload = await FileUploadHelper.uploadToSpaces(faviconImage);

        if (faviconUpload) {
            favicon = faviconUpload.Location;
            favicon_key = faviconUpload.Key;
        }

        const settingsData = { ...req.body, favicon, favicon_key, logo, logo_key };

        const result = await WebSettingsService.createSettingsServices(settingsData);

        return sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Settings created successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});


const getSettings = catchAsync(async (req, res) => {
    const result = await WebSettingsService.getSettingsServices();

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
        message: 'Settings retrieved successfully',
        data: result,
    });
});

const updateSettings = catchAsync(async (req, res) => {
    // Fetch existing settings from DB to get old image keys
    const existingSettingsArray = await WebSettingsService.getSettingsServices();

    // Ensure we are working with a single settings object
    const existingSettings = existingSettingsArray?.[0];

    // Default values if settings don't exist
    let logo = existingSettings?.logo || "";
    let logo_key = existingSettings?.logo_key || "";
    let favicon = existingSettings?.favicon || "";
    let favicon_key = existingSettings?.favicon_key || "";
    try {
        if (req.files && "logo" in req.files) {
            const logoImage = req.files["logo"][0];

            // Delete old logo from Spaces if it exists
            if (logo_key) {
                console.log("Deleting old logo from DigitalOcean Spaces...");
                await FileUploadHelper.deleteFromSpaces(logo_key);
            }

            // Upload new logo
            console.log("Uploading new logo...");
            const logoUpload = await FileUploadHelper.uploadToSpaces(logoImage);
            if (logoUpload) {
                logo = logoUpload?.Location;
                logo_key = logoUpload?.Key;
            }
        }

        if (req.files && "favicon" in req.files) {
            const faviconImage = req.files["favicon"][0];

            // Delete old favicon from Spaces if it exists
            if (favicon_key) {
                console.log("Deleting old favicon from DigitalOcean Spaces...");
                await FileUploadHelper.deleteFromSpaces(favicon_key);
            }

            // Upload new favicon
            console.log("Uploading new favicon...");
            const faviconUpload = await FileUploadHelper.uploadToSpaces(faviconImage);
            if (faviconUpload) {
                favicon = faviconUpload.Location;
                favicon_key = faviconUpload.Key;
            }
        }

        // Handle for_migrant_workers files
        // let for_migrant_workers: any[] = [];

        // const migrantWorkerFiles = (req.files as MulterFile[])?.filter((file) =>
        //     file.fieldname.includes("for_migrant_workers")
        // );

        // // Group files by index
        // const filesByIndex: Record<string, any> = {};

        // migrantWorkerFiles.forEach((file) => {
        //     const match = file.fieldname.match(/\[([0-9]+)\]/);
        //     if (match) {
        //         const index = match[1];

        //         if (!filesByIndex[index]) {
        //             filesByIndex[index] = {};
        //         }

        //         if (file.fieldname.includes("tab_image")) {
        //             filesByIndex[index].image = file;
        //         } else if (file.fieldname.includes("tab_icon")) {
        //             filesByIndex[index].icon = file;
        //         }
        //     }
        // });

        // // Now loop through each index and prepare full object
        // for (const index in filesByIndex) {
        //     const name = req.body?.for_migrant_workers?.[index]?.for_migrant_workers_tab_name || "";
        //     const status = req.body?.for_migrant_workers?.[index]?.for_migrant_workers_tab_status || "";
        //     const serial = req.body?.for_migrant_workers?.[index]?.for_migrant_workers_tab_serial || "";

        //     const imageFile = filesByIndex[index].image;
        //     const iconFile = filesByIndex[index].icon;

        //     const uploadedImage = imageFile ? await FileUploadHelper.uploadToSpaces(imageFile) : null;
        //     const uploadedIcon = iconFile ? await FileUploadHelper.uploadToSpaces(iconFile) : null;

        //     for_migrant_workers.push({
        //         for_migrant_workers_tab_name: name,
        //         for_migrant_workers_tab_status: status,
        //         for_migrant_workers_tab_serial: serial,
        //         for_migrant_workers_tab_image: uploadedImage?.Location,
        //         for_migrant_workers_tab_image_key: uploadedImage?.Key,
        //         for_migrant_workers_tab_icon: uploadedIcon?.Location,
        //         for_migrant_workers_tab_icon_key: uploadedIcon?.Key,
        //     });
        // }


        // Prepare updated data
        const updatedSettingsData = {
            logo,
            logo_key,
            favicon,
            favicon_key,
            ...req.body,
            // for_migrant_workers: for_migrant_workers.length > 0 ? for_migrant_workers : existingSettings?.for_migrant_workers || [],
        };

        const result = await WebSettingsService.updateSettingsServices(updatedSettingsData);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Settings updated successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});




export const WebSettingsController = {
    createSettings,
    getSettings,
    updateSettings
};