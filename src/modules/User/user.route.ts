import { Router } from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../Middlewares/validateRequest';
import { updateUserValidationSchema } from './user.validaton';
import { auth } from '../../Middlewares/auth';
import { USER_ROLE } from './user.constant';
// import validateRequest from '../../Middlewares/validateRequest';
// import userValidationSchema from './user.validaton';
// import loginValidationSchema from '../Auth/auth.validation';
// import { AuthControllers } from '../Auth/auth.controller';

const router = Router();

// router.post(
//     '/signup',
//     validateRequest(userValidationSchema),
//     UserControllers.registerUser,
// );

// router.post(
//     '/login',
//     validateRequest(loginValidationSchema),
//     AuthControllers.loginUser,
// );

router.get('/', UserControllers.getAllUsers);

router.get('/usersByUserId/:userId', UserControllers.getUsersByUserId);

router.get('/manageUserProfile/:email', UserControllers.getUserByEmailId);

router.post(
  '/followUnfollow/:action/:userId/:userIWantToFolllowId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserControllers.followUnfollowUsers,
);

router.put('/updateUserProfile/:email',
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(updateUserValidationSchema),
  UserControllers.updateUserByEmailId,
);

router.patch("/updateUserRole/:userId",
  auth(USER_ROLE.admin),
  UserControllers.updateUserRole
);

router.put("/deleteUser/:userId", 
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserControllers.deleteUser
);

router.get('/totalUsersCount', UserControllers.getTotalUsersCount);


export const userRoute = router;