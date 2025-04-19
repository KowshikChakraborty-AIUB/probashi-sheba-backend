import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { createSettingsSchema, updateSettingsSchema } from './banner.validation';
import { FileUploadHelper } from '../../../helpers/helpers/image.upload';
import { BannerController } from './banner.controller';


const router = express.Router();

// get user active category and post update delete category
router.route("/")
    .get(BannerController.findBanners)
    .post(FileUploadHelper.ImageUpload.fields([{ name: "banner_logo", maxCount: 1 }]), BannerController.createBanner)
    .patch(FileUploadHelper.ImageUpload.fields([
        { name: "banner_logo", maxCount: 1 },
    ]),
        BannerController.updateBanner)
    .delete(BannerController.deleteBannerInfo)

// get all active inactive category for dashboard
router.route("/dashboard").get(BannerController.findAllDashboardBanners)
// router.post('/create', fileUploadHandler(), validateRequest(createSettingsSchema), SettingsController.createSettings);
// router.get('/', SettingsController.getSettings);
// router.patch('/', fileUploadHandler(), SettingsController.updateSettings)

export const BannerRoutes = router;