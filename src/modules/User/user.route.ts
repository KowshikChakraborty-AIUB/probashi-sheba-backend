import express from 'express';
import { UserControllers } from './user.controller';
import { FileUploadHelper } from '../../helpers/FileUploadHelper';


const router = express.Router();

router.route('/')
    .post(FileUploadHelper.ImageUpload.fields([
        { name: "admin_profile", maxCount: 1 },
      ]),UserControllers.registerUser)

export const UserRoutes = router;