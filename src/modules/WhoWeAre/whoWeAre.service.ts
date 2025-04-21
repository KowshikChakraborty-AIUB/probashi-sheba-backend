import AppError from "../../errors/AppError";
import { IWhoWeAre } from "./whoWeAre.interface";
import { WhoWeAreModel } from "./whoWeAre.model";
import httpStatus from 'http-status'

// Create Settings
const postWhoWeAreServices = async (payload: IWhoWeAre): Promise<IWhoWeAre> => {
    const existingWhoWeAre = await WhoWeAreModel.find({ who_we_are_title_english: payload?.who_we_are_title_english })

    if (existingWhoWeAre.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'You already added this about us info!');
    }

    const result = await WhoWeAreModel.create(payload);
    return result;
};

//get Faq info
const getWhoWeAreService = async () => {
    const result = await WhoWeAreModel.find();
    return result[0];
};


export const WhoWeAreService = {
    postWhoWeAreServices,
    getWhoWeAreService,
};
