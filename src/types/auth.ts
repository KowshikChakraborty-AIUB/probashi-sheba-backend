import { IUserInterface } from "../modules/User/user.interface";

export type IVerifyEmail = {
    email: string;
    oneTimeCode: number;
};

// export type ILoginData = {
//   email: string;
//   password: string;
// };

export type ILoginData = {
    user_email: string;
    user_password: string;
    social_id: string;
    user_name: string;
    login_type: string;
};

export interface LoginResponse {
    user: IUserInterface; // Replace with your actual user type
    accessToken: string;
    newUser?: boolean; // Optional if applicable
  }

export type IAuthResetPassword = {
    newPassword: string;
    confirmPassword: string;
};

export type IChangePassword = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};