import express from 'express';
import { BannerController } from './banner.controller';
import { FileUploadHelper } from '../../helpers/FileUploadHelper';


const router = express.Router();

// get user active category and post update delete category
router.route("/")
    .get(BannerController.findBanners)
    .post(FileUploadHelper.ImageUpload.fields([{ name: "banner_image", maxCount: 1 }]), BannerController.createBanner)
    .patch(FileUploadHelper.ImageUpload.fields([
        { name: "banner_image", maxCount: 1 },
    ]),
        BannerController.updateBanner)
    .delete(BannerController.deleteBannerInfo)

// get all active inactive category for dashboard
router.route("/dashboard").get(BannerController.findAllDashboardBanners)
// router.post('/create', fileUploadHandler(), validateRequest(createSettingsSchema), SettingsController.createSettings);
// router.get('/', SettingsController.getSettings);
// router.patch('/', fileUploadHandler(), SettingsController.updateSettings)

export const BannerRoutes = router;