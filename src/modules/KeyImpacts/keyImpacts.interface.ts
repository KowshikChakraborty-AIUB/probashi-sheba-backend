import { Types } from "mongoose";
import { IAdminInterface } from "../Admin/admin.interface";


export type IKeyImpacts = {
  keyImpacts_title_english: string;
  keyImpacts_title_bangla: string;
  keyImpacts_image?: string;
  keyImpacts_image_key?: string;
  keyImpacts_status: "active" | "in-active";
  keyImpacts_serial: number;
  keyImpacts_publisher_id?: Types.ObjectId | IAdminInterface;
  keyImpacts_updated_by?: Types.ObjectId | IAdminInterface;
};