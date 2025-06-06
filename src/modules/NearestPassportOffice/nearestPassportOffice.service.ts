import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
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

export const getNearestPassportOfficeService = async (queryParams: Record<string, unknown>) => {
    const modelQuery = nearestPassportOfficeModel.find();

    const query = new QueryBuilder(modelQuery, queryParams)
        .search(['nearest_passport_address']) // Provide searchable fields


    const result = await query.modelQuery;

    return result;
}


export const updateNearestPassportOfficeService = async (_id: string, payload: Partial<INearestPassportOffice>) => {
    const officeData = await nearestPassportOfficeModel.findById(_id);

    if (!officeData) {
        throw new AppError(statusCodes.NOT_FOUND, 'Passport office info does not exist!');
    }

    const result = await nearestPassportOfficeModel.findByIdAndUpdate(_id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};


// delete A Nearest Passport Office

export const deleteNearestPassportOfficeService = async (
    _id: string
): Promise<INearestPassportOffice | any> => {
    const nearestPassportOfficeInfo: INearestPassportOffice | null =
        await nearestPassportOfficeModel.findOne({ _id: _id });
    if (!nearestPassportOfficeInfo) {
        throw new AppError(404, "Info not found");
    }
    const result = await nearestPassportOfficeModel.deleteOne(
        { _id: _id },
        {
            runValidators: true,
        }
    );
    return result;
};