import AppError from "../../Errors/AppError";
import { INearestPassportOffice } from "./nearestPassportOffice.interface";
import nearestPassportOfficeModel from "./nearestPassportOffice.model";
import statusCodes from 'http-status';

export const postNearestPassportOfficeService = async (payload: INearestPassportOffice) => {
    const isOfficeEntered = await nearestPassportOfficeModel.findOne({ nearest_passport_phone: payload?.nearest_passport_phone })
    if (isOfficeEntered) {
        throw new AppError(statusCodes.CONFLICT, 'Passport office already entered');
    }

    const result = await nearestPassportOfficeModel.create(payload);
    return result;
};

export const getNearestPassportOfficeService = async () => {
    const result = await nearestPassportOfficeModel.find();
    return result;
}