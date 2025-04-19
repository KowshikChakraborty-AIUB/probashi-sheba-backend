import mongoose, { Schema } from 'mongoose';
import { IBanner } from './banner.interface';

const BannerSchema = new mongoose.Schema<IBanner>(
  {
    banner_title_english: {
      type: String,
    },
    banner_title_bangla: {
      type: String,
    },
    banner_description_english: {
      type: String,
    },
    banner_description_bangla: {
      type: String,
    },
    banner_image: {
      type: String,
      required: true,
    },
    banner_image_key: {
      type: String,
      required: true,
    },
    banner_status: {
      required: true,
      type: String,
      enum: ["active", "in-active"],
      default: "active",
    },
    banner_path: {
      type: String,
      required: true,
    },
    banner_applestore_path: {
      type: String,
      required: true,
    },
    banner_playstore_path: {
      type: String,
      required: true,
    },
    banner_serial: {
      required: true,
      type: Number,
    },
    banner_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "admins",
      // required: true,
    },
    banner_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "admins",
    },
  },
  {
    timestamps: true,
  }
);

export const BannerModel = mongoose.model<IBanner>('banners', BannerSchema);