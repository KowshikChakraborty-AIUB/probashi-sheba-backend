import AppError from "../../errors/AppError";
import statusCodes from 'http-status';
import { IVisaVerification } from "./visaVerification.interface";
import { VisaVerificationModel } from "./visaVerification.model";

const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape special chars
};


// Create VisaVerification
const postVisaVerificationService = async (
    payload: IVisaVerification
): Promise<IVisaVerification> => {
    console.log(payload, 'payload from service');

    const existingVisaVerification = await VisaVerificationModel.findOne({
        $or: [
            { visaVerification_country_name_english: payload.visaVerification_country_name_english },
            { visaVerification_country_name_bangla: payload.visaVerification_country_name_bangla }
        ]
    }).collation({ locale: 'en', strength: 2 }); // strength: 2 → case insensitive


    if (existingVisaVerification) {
        throw new AppError(statusCodes.BAD_REQUEST, 'You already added this visa verification info!');
    }


    const result = await VisaVerificationModel.create(payload);
    return result;
};


//get VisaVerification info
const getVisaVerificationService = async () => {
    const result = await VisaVerificationModel.find();
    return result;
};

// update VisaVerification info
const updateVisaVerificationService = async (
    VisaVerificationId: string,
    payload: Partial<IVisaVerification>
): Promise<any> => {
    const result = await VisaVerificationModel.findByIdAndUpdate({ _id: VisaVerificationId }, payload, {
        new: true, // returns the updated doc
        runValidators: true,
    });
    return result;
};

// delete VisaVerification info
export const deleteVisaVerificationService = async (_id: string): Promise<IVisaVerification | any> => {

    const VisaVerificationInfo = await VisaVerificationModel.findById({ _id: _id });

    if (!VisaVerificationInfo) {
        return {};
    }
    const result = await VisaVerificationModel.findByIdAndDelete({ _id: _id }
    );
    return result;
};

export const VisaVerificationServices = {
    postVisaVerificationService,
    getVisaVerificationService,
    updateVisaVerificationService,
    deleteVisaVerificationService
};