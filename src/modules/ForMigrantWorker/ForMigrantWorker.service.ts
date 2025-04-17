import AppError from "../../errors/AppError";

import statusCodes from 'http-status';
import { IForMigrantWorker } from "./ForMigrantWorker.interface";
import { ForMigrantWorkerModel } from "./ForMigrantWorker.model";

// Create ForMigrantWorker
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


//get ForMigrantWorker info
const getForMigrantWorkerService = async () => {
    const result = await ForMigrantWorkerModel.find();
    return result;
};

// update ForMigrantWorker info
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

// delete ForMigrantWorker info
export const deleteForMigrantWorkerService = async (_id: string): Promise<IForMigrantWorker | any> => {

    const forMigrantWorkerInfo = await ForMigrantWorkerModel.findById({ _id: _id });
    console.log("forMigrantWorkerInfo", forMigrantWorkerInfo);
    if (!forMigrantWorkerInfo) {
        return {};
    }
    const result = await ForMigrantWorkerModel.findByIdAndDelete({ _id: _id }
    );
    return result;
};

export const ForMigrantWorkerServices = {
    postForMigrantWorkerService,
    getForMigrantWorkerService,
    updateForMigrantWorkerService,
    deleteForMigrantWorkerService
};