import express from 'express';
import { FileUploadHelper } from '../../helpers/FileUploadHelper';
import { KeyImpactsController } from './keyImpacts.controller';


const router = express.Router();

// get user active category and post update delete category
router.route("/")
    .get(KeyImpactsController.findKeyImpacts)
    .post(FileUploadHelper.ImageUpload.fields([{ name: "keyImpacts_image", maxCount: 1 }]), KeyImpactsController.createKeyImpacts)
    .patch(FileUploadHelper.ImageUpload.fields([
        { name: "keyImpacts_image", maxCount: 1 },
    ]),
        KeyImpactsController.updateKeyImpacts)
    .delete(KeyImpactsController.deleteKeyImpactsInfo)

// get all active inactive category for dashboard
router.route("/dashboard").get(KeyImpactsController.findAllDashboardKeyImpacts)
// router.post('/create', fileUploadHandler(), validateRequest(createSettingsSchema), SettingsController.createSettings);
// router.get('/', SettingsController.getSettings);
// router.patch('/', fileUploadHandler(), SettingsController.updateSettings)

export const KeyImpactsRoutes = router;