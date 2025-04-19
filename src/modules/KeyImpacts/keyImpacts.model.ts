import mongoose, { Schema } from 'mongoose';
import { IKeyImpacts } from './keyImpacts.interface';

const KeyImpactsSchema = new mongoose.Schema<IKeyImpacts>(
  {
    keyImpacts_title_english: {
      type: String,
    },
    keyImpacts_title_bangla: {
      type: String,
    },
    keyImpacts_image: {
      type: String,
      required: true,
    },
    keyImpacts_image_key: {
      type: String,
      required: true,
    },
    keyImpacts_status: {
      required: true,
      type: String,
      enum: ["active", "in-active"],
      default: "active",
    },
    keyImpacts_serial: {
      required: true,
      type: Number,
    },
    keyImpacts_publisher_id: {
      type: Schema.Types.ObjectId,
      ref: "admins",
      // required: true,
    },
    keyImpacts_updated_by: {
      type: Schema.Types.ObjectId,
      ref: "admins",
    },
  },
  {
    timestamps: true,
  }
);

export const KeyImpactsModel = mongoose.model<IKeyImpacts>('keyImpacts', KeyImpactsSchema);