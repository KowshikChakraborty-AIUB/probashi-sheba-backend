import httpStatus from 'http-status';
import catchAsync from "../../utils/catchAsync";
import { IAdminInterface } from "./admin.interface";
import AdminModel from "./admin.model";
import { AdminServices } from "./admin.services";
import sendResponse from '../../utils/sendResponse';


// login an admin
const loginAdmin = catchAsync(async (req, res) => {
  const resultController = await AdminServices.loginAdminServices(req.body);
  const { accessToken } = resultController;

  const adminLoginInfo = await AdminModel.find({ admin_phone: req.body.admin_phone }).select('-admin_password')


  //console.log(adminLoginInfo);

  // Set token in HTTP-only cookie
  // res.cookie('admin_token', `${accessToken}`, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'development',
  //   sameSite: 'strict',
  //   maxAge: 24 * 60 * 60 * 1000, // 1 day
  // });


  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin logged in successfully',
    token: accessToken,
    data: adminLoginInfo
  });
});


// create an admin
const registerAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.registerAdminServices(req.body);
  const token = result.accessToken

  // Set token in HTTP-only cookie
  res.cookie('admin_token', `Bearer ${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin registered successfully',
    data: result.result,
    token: token
  });
});

//get all admins
// const getAllAdmins = catchAsync(async (req, res) => {
//   const query = req.query
//   const {result, totalCount} = await AdminServices.getAllAdminsServices(query);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'All admins retrieved successfully',
//     data: result,
//     totalData: totalCount
//   });

// });


//get admin by _id (logged in admin info)
const getAdminById = catchAsync(async (req, res) => {
  const _id = req?.params?._id;

  const result = await AdminServices.getAdminByIdServices(_id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logged-In admin retrieved successfully',
    data: result,
  });

});


//update admin
// const updateAdmin = catchAsync(async (req, res) => {
//   const admin_id = req.body._id;


//   // admin profile upload
//   let admin_profile;
//   let admin_profile_key;

//   if (req.files && "admin_profile" in req.files) {
//     const adminImage = req.files["admin_profile"][0];
//     const admin_profile_upload = await FileUploadHelper.uploadToSpaces(
//       adminImage
//     );
//     admin_profile = admin_profile_upload?.Location;
//     admin_profile_key = admin_profile_upload?.Key;
//   }

//   const data = { ...req.body, admin_profile, admin_profile_key };


//   const result: IAdminInterface | any = await AdminServices.updateAdminServices(admin_id, data);



//   if (req.body?.admin_profile_key) {
//     await FileUploadHelper.deleteFromSpaces(
//       req.body?.admin_profile_key
//     );
//   }

//   sendResponse<IAdminInterface>(res, {
//     success: true,
//     statusCode: 200,
//     message: 'Admin updated successfully',
//   });

// });

//delete admin
const deleteAdmin = catchAsync(async (req, res) => {
  const admin_id = req.body._id;

  const result = await AdminServices.deleteAdminServices(admin_id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Admin deleted successfully',
    data: result,
  });
});

//change admin  password
const changeAdminPassword = catchAsync(async (req, res) => {

  const result = await AdminServices.changeAdminPasswordServices(req.user, req.body);
  console.log(req);


  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

export const AdminControllers = {
  loginAdmin,
  registerAdmin,
  //   getAllAdmins,
  getAdminById,
  //   updateAdmin,
  deleteAdmin,
  changeAdminPassword
};