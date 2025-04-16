
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
        return res.status(500).json({ message: "Internal server error", error });
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

        const { who_we_are, testimonials, ...rest } = req.body;

        const parsedWhoWeAre = JSON.parse(who_we_are);
        // const parsedTestimonials = JSON.parse(testimonials);
        const parsedData = {
            ...rest,
            who_we_are: {
                ...existingSettings?.who_we_are,
                ...parsedWhoWeAre,
            },
            // testimonials: parsedTestimonials,
        };

        let for_migrant_workers = []
        if (req.files && "for_migrant_workers" in req.files) {
            const files = req.files["for_migrant_workers"];
            const forMigrantWorkerNames: string[] = JSON.parse(req.body.for_migrant_workers || "[]");

            if (forMigrantWorkerNames.length !== files.length) {
                throw new AppError(400, "Number of migrant workers names and files must match");
            }

            for (let i = 0; i < files.length; i++) {
                const uploaded = await FileUploadHelper.uploadToSpaces(files[i]);
                for_migrant_workers.push({
                    for_migrant_workers_tab_name: forMigrantWorkerNames[i],
                    for_migrant_workers_tab_image: uploaded?.Location,
                    for_migrant_workers_tab_image_key: uploaded?.Key,
                });
            }
        }

        console.log(req.files);
        
        // Prepare updated data
        const updatedSettingsData = {
            ...req.body,
            ...parsedData,
            who_we_are: parsedWhoWeAre,
            // testimonials: parsedTestimonials,
            for_migrant_workers,
            logo,
            logo_key,
            favicon,
            favicon_key,
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
        return res.status(500).json({ message: "Internal server error", error });
    }
});




export const WebSettingsController = {
    createSettings,
    getSettings,
    updateSettings
};