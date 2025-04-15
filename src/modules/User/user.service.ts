import httpStatus from "http-status";
import userModel, { IUserDocument } from "./user.model";
import { comparePassword, hashPassword } from "../../helpers/hashHelper";
import AppError from "../../errors/AppError";
import { createToken } from "../../utils/createToken";
import config from "../../config";
import { emailTemplate } from "../../utils/emailTemplate";
import { emailHelper } from "../../helpers/emailHelper";
import { IUserInterface } from "./user.interface";
import { customAlphabet } from 'nanoid';


// Send phone otp
const sendPhoneOtpService = async (user_phone: string) => {
  const existingUser = await userModel.findOne({ user_phone });

  // if (existingUser && existingUser.user_phone_is_verified) {
  //     throw new Error("Phone number already registered");
  // }
  const nanoid = customAlphabet('1234567890', 5)
  const otp_code = nanoid()
  const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

  if (existingUser) {
    existingUser.otp_code = Number(otp_code);
    existingUser.otp_expires_at = otp_expires_at;
    await existingUser.save();
    return existingUser;
  }

  const user = await userModel.create({
    user_phone,
    otp_code,
    otp_expires_at,
    user_status: 'in-active',
    login_type: 'phone',
    user_phone_is_verified: false,
    role: 'user',
  });

  return user;
}

// Send email otp
const sendEmailOtpService = async (user_email: string, user_name: string) => {

  if (!user_email) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Please provide email');
  }

  const isEmail = await userModel.findOne({ user_email });

  if (isEmail) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email already registered');
  }

  //  // Generate OTP and prepare email
  const emailOtp = customAlphabet('1234567890', 5)();

  const emailValues = {
    name: user_name || 'User',
    email: user_email,
    otp: Number(emailOtp),
  };
  const accountEmailTemplate = emailTemplate.verifyEmail(emailValues);
  emailHelper.sendEmail(accountEmailTemplate);

  // // Update user with authentication details
  const authentication = {
    otp_code: Number(emailOtp),
    otp_expires_at: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes,
    role: 'user',
  };

  const updatedAuthenticationUser = await userModel.findOneAndUpdate(
    { user_name },
    authentication,
    { new: true, upsert: true } // Create if not exists 
  )

  return updatedAuthenticationUser
}

// Register an user
const registerUserServices = async (payload: IUserInterface) => {
  const existingUser = await userModel.findOne({ user_phone: payload.user_phone });

  if (!existingUser || !existingUser.user_phone_is_verified) {
    throw new Error("Phone number not verified");
  }
  // if (existingUser.user_phone_is_verified) {
  //     throw new Error("Phone number already registered");
  // }
  if (existingUser.user_status === "active") {
    throw new Error("User already registered and active");
  }
  if (existingUser.user_status === "in-active") {
    existingUser.user_status = "active";
    existingUser.user_name = payload.user_name;
    existingUser.user_email = payload.user_email ?? existingUser.user_email;
    existingUser.user_password = await hashPassword(payload.user_password ?? existingUser.user_password);
    existingUser.user_phone_is_verified = true;
    existingUser.user_gender = payload.user_gender ?? existingUser.user_gender;
    existingUser.user_date_of_birth = payload.user_date_of_birth ?? existingUser.user_date_of_birth;
    existingUser.user_educational_qualification = payload.user_educational_qualification ?? existingUser.user_educational_qualification;
    existingUser.user_country = payload.user_country ?? existingUser.user_country;
    existingUser.user_city = payload.user_city ?? existingUser.user_city;
    existingUser.user_why_interested = payload.user_why_interested ?? existingUser.user_why_interested;
    existingUser.user_why_interested_other = payload.user_why_interested_other;
    existingUser.user_selected_countries = payload.user_selected_countries;
    existingUser.user_selected_skills = payload.user_selected_skills;
    existingUser.user_jobs = payload.user_jobs;
    existingUser.user_is_experienced = payload.user_is_experienced;
    existingUser.user_current_job = payload.user_current_job;
    existingUser.user_current_job_country = payload.user_current_job_country;
    existingUser.user_is_have_passport = payload.user_is_have_passport;
    existingUser.user_passport_number = payload.user_passport_number;
    // existingUser.login_type = payload.login_type || "phone";
    existingUser.social_id = payload.social_id;
    existingUser.social_email = payload.social_email;
    existingUser.user_publisher_id = payload.user_publisher_id;
    existingUser.user_updated_by = payload.user_updated_by;
    existingUser.role = payload.role || 'user';

    await existingUser.save();
    return existingUser;
  }

  // await existingUser.save();

  // return existingUser;
};

// Verify phone OTP
const verifyPhoneOtpServices = async (payload: IUserInterface) => {
  const { user_phone, otp_code } = payload;
  const user = await userModel.findOne({ user_phone, otp_code });

  if (!user) {
    throw new Error("Invalid OTP or phone number");
  }
  if (user.otp_expires_at && user.otp_expires_at < new Date()) {
    throw new Error("OTP expired");
  }
  // Update user status to verified and clear OTP
  user.user_phone_is_verified = true;
  user.otp_code = undefined;
  user.otp_expires_at = undefined;
  await user.save();
  return user;
}

// Verify email OTP
const verifyEmailOtpServices = async (payload: IUserInterface) => {
  const { user_email, otp_code } = payload;
  const existingUser = await userModel.findOne({ user_email, otp_code });
  if (!existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP or email address");
  }

  if (existingUser.otp_expires_at && existingUser.otp_expires_at < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP expired");
  }

  if (!otp_code) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP is required");
  }

  console.log(typeof otp_code, "OTP Code");
  console.log(typeof existingUser.otp_code, "Existing OTP Code");

  if (existingUser.otp_code !== otp_code) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  let message;
  let data;

  if (!existingUser.user_email_is_verified) {
    await userModel.findOneAndUpdate({ user_email }, { otp_code: undefined, otp_expires_at: undefined, user_email_is_verified: true }, { new: true });
    message = "Your email has been successfully verified. Your account is now fully activated.";
    data = null;
  } else {
    existingUser.user_email_is_verified = true;
    existingUser.otp_code = undefined;
    existingUser.otp_expires_at = undefined;
    await existingUser.save();
    message = "Your email has been successfully verified. Your account is now fully activated.";
    data = existingUser;
  }

  return { message, data };
}

// Login user with phone number and OTP
const loginServices = async (payload: IUserInterface): Promise<{
  accessToken?: string;
  user?: IUserDocument;
  newUser?: IUserDocument;
}> => {
  const { user_phone, user_password, user_email, login_type, social_id, device_id } = payload;

  // If login type is phone
  if (login_type === "phone") {
    if (!user_password) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Password is required');
    }

    const isExistUser = await userModel.findOne({ user_phone }).select('+user_password');
    if (!isExistUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist!");
    }

    //check verified and status
    if (!isExistUser.user_phone_is_verified) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Please verify your account, then try to login again'
      );
    }

    //check user status
    if (isExistUser.user_status === 'in-active') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You don’t have permission to access this content. It looks like your account is not active.'
      );
    }

    //check match password
    if (
      user_password &&
      !(await comparePassword(user_password, isExistUser.user_password))
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Password is incorrect!');
    }

    //create token
    const accessToken = createToken(
      { _id: isExistUser._id as string, user_phone: isExistUser.user_phone },
      config.jwt_access_secret as string,
      '7d'
    );

    return { accessToken, user: isExistUser };
  }

  // If login type is email
  if (login_type === "email") {
    if (!user_password) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Password is required');
    }

    const isExistUser = await userModel.findOne({ user_email }).select('+user_password');
    if (!isExistUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist!");
    }

    //check verified and status
    if (!isExistUser.user_email_is_verified) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Please verify your account, then try to login again'
      );
    }

    //check user status
    if (isExistUser.user_status === 'in-active') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You don’t have permission to access this content. It looks like your account is not active.'
      );
    }

    //check match password
    if (
      user_password &&
      !(await comparePassword(user_password, isExistUser.user_password))
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Password is incorrect!');
    }

    //create token
    const accessToken = createToken(
      { _id: isExistUser._id as string, user_email: isExistUser.user_email },
      config.jwt_access_secret as string,
      '7d'
    );

    return { accessToken, user: isExistUser };
  }

  // If login type is social

  if (login_type === 'social') {
    // if (login_type !== "phone" && !social_id) {
    //   throw new AppError(httpStatus.BAD_REQUEST, 'Social ID is required for social login');
    // }
    // if (login_type === "email" && !user_email) {
    //   throw new AppError(httpStatus.BAD_REQUEST, 'Email is required for phone login');
    // }
    let existingUser = null;

    // 1. Try to find by social_id (preferred)
    if (social_id) {
      existingUser = await userModel.findOne({ social_id });
    }

    // 2. If not found, try to find by user_phone
    if (!existingUser && user_phone) {
      existingUser = await userModel.findOne({ user_phone });
    }

    // 3. If not found, try to find by user_email
    if (!existingUser && user_email) {
      existingUser = await userModel.findOne({ user_email });
    }

    if (!existingUser) {
      const newUser = await userModel.create({
        user_email,
        social_id,
        user_social_is_verified: true,
      });
      return { newUser };
    }

    // 4. Link social_id if it was missing before
    if (!existingUser.social_id && social_id) {
      existingUser.social_id = social_id;
      existingUser.user_social_is_verified = true;
      await existingUser.save();
    }

    //create token
    const accessToken = createToken(
      { _id: existingUser._id as string, user_email: existingUser.user_email },
      config.jwt_access_secret as string,
      '7d'
    );

    return { accessToken, user: existingUser };
  }

  return {};
}

// Social login
// const socialLoginServices = async (payload: ILoginData) => {
//   const { user_email, login_type, social_id, user_name } = payload;

//   if (login_type !== "phone" && !social_id) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Social ID is required for social login');
//   }
//   if (login_type === "phone" && !user_email) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Email is required for phone login');
//   }

//   if (login_type === 'google') {
//     const session = await startSession()
//     let user: IUserInterface | null = null

//     try {
//       session.startTransaction()

//       // Check if user already exists
//       user = await userModel.findOne({ user_email }).session(session)
//       console.log("User", user);

//       if (!user) {
//         const [newUser] = await userModel.create([{
//           user_name,
//           user_email,
//           login_type,
//           social_id,
//         }], { session })
// console.log("New User", newUser);

//         // if (!newUser) {
//         //   throw new AppError(
//         //     httpStatus.INTERNAL_SERVER_ERROR,
//         //     'Failed to create user'
//         //   );
//         // }

//         // user = newUser
//       }

//       // Commit transaction
//       // await session.commitTransaction();

//       // //create token
//       // const accessToken = createToken(
//       //   { _id: user._id, user_phone: user.user_phone },
//       //   config.jwt_access_secret as string,
//       //   '7d'
//       // );

//       // return { accessToken, user };
//     } catch (error) {
//       session.abortTransaction()
//       throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create user')

//     }
//   }

//   throw new AppError(httpStatus.BAD_REQUEST, 'Invalid login type');
// }

const updateUserServices = async (_id: string, payload: Partial<IUserInterface>) => {
  const userData = await userModel.findById(_id);
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // If the user wants to update the password, hash it
  if (payload.user_password) {
    payload.user_password = await hashPassword(
      payload.user_password,
    );
  }

  const result = await userModel.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  })

  return result;
}

export const UserServices = {
  registerUserServices,
  verifyPhoneOtpServices,
  loginServices,
  sendPhoneOtpService,
  sendEmailOtpService,
  verifyEmailOtpServices,
  updateUserServices
};  