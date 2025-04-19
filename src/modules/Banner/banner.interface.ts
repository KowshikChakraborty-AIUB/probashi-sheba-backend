import { Types } from "mongoose";
import { IAdminInterface } from "../Admin/admin.interface";


export type IBanner = {
  banner_title_english: string;
  banner_title_bangla: string;
  banner_description_english: string;
  banner_description_bangla: string;
  banner_image?: string;
  banner_image_key?: string;
  banner_status: "active" | "in-active";
  banner_path?: string;
  banner_playstore_path?: string;
  banner_applestore_path?: string;
  banner_serial: number;
  banner_publisher_id?: Types.ObjectId | IAdminInterface;
  banner_updated_by?: Types.ObjectId | IAdminInterface;
};