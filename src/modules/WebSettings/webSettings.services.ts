import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import { ForMigrantWorkerModel, IForMigrantWorker } from "../ForMigrantWorker/ForMigrantWorker.model";
import { IWebSettings } from "./webSettings.interface";
import { WebSettingsModel } from "./webSettings.model";
import httpStatus from "http-status";


// Create Settings
const createSettingsServices = async (settings: IWebSettings) => {
    const isSettingsExists = await WebSettingsModel.findOne({ name: settings.title })
    if (isSettingsExists) {
        throw new AppError(httpStatus.CONFLICT, 'This settings is already exists!');
    }
    const result = await WebSettingsModel.create(settings)
    return result
};

// Find Settings
const getSettingsServices = async () => {
    const result = await WebSettingsModel.find();
    return result;
};

// Update Settings
const updateSettingsServices = async (payload: Partial<IWebSettings>) => {
    const updatedSettings = await WebSettingsModel.findOneAndUpdate({}, payload, {
        new: true,
        runValidators: true,
    });

    if (!updatedSettings) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update settings');
    }

    return updatedSettings;
};


export const createMigrantWorkerServices = async (workerData: IForMigrantWorker) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const worker = await ForMigrantWorkerModel.create([workerData], { session });

        await WebSettingsModel.findByIdAndUpdate(
            {},
            { $push: { for_migrant_worker_refs: worker[0]._id } },
            { session }
        );

        await session.commitTransaction();
        return worker[0];
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
};


export const WebSettingsService = {
    createSettingsServices,
    getSettingsServices,
    updateSettingsServices
};