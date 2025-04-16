import AppError from "../../errors/AppError";

import statusCodes from 'http-status';
import { IForMigrantWorker } from "./ForMigrantWorker.interface";
import { ForMigrantWorkerModel } from "./ForMigrantWorker.model";

// Create BMET Registration
const postForMigrantWorkerService = async (
    payload: IForMigrantWorker
): Promise<IForMigrantWorker> => {

    const existingforMigrantWorker = await ForMigrantWorkerModel.find({ for_migrant_workers_tab_name: payload?.for_migrant_workers_tab_name })

    if (existingforMigrantWorker.length) {
        throw new AppError(statusCodes.BAD_REQUEST, 'You already added this tab!');
    }


    const result = await ForMigrantWorkerModel.create(payload);
    return result;
};


//get BMET Registration info
const getForMigrantWorkerService = async () => {
    const result = await ForMigrantWorkerModel.find();
    return result;
};

// update BMET Registration info
const updateForMigrantWorkerService = async (
    forMigrantWorkerId: string,
    payload: Partial<IForMigrantWorker>
): Promise<any> => {
    const result = await ForMigrantWorkerModel.findByIdAndUpdate({ _id: forMigrantWorkerId }, payload, {
        new: true, // returns the updated doc
        runValidators: true,
    });
    return result;
};


export const ForMigrantWorkerServices = {
    postForMigrantWorkerService,
    getForMigrantWorkerService,
    updateForMigrantWorkerService,
};