import express from 'express';
import { UserControllers } from './user.controller';


const router = express.Router();

router.route('/')
    .post(UserControllers.registerUser)

export const UserRoutes = router;