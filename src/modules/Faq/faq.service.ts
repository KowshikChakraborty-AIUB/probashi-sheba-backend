import AppError from "../../errors/AppError";
import statusCodes from 'http-status';
import { FaqModel } from "./faq.model";
import { IFaq } from "./faq.interface";

// Create Faq
const postFaqService = async (
    payload: IFaq
): Promise<IFaq> => {

    const existingFaq = await FaqModel.findOne({
        $or: [
            { faq_question_english: new RegExp(`^${payload.faq_question_english}$`, 'i') },
            { faq_question_bangla: new RegExp(`^${payload.faq_question_bangla}$`, 'i') }
        ]
    });


    if (existingFaq) {
        throw new AppError(statusCodes.BAD_REQUEST, 'You already added this faq!');
    }


    const result = await FaqModel.create(payload);
    return result;
};


//get Faq info
const getFaqService = async () => {
    const result = await FaqModel.find();
    return result;
};

// update Faq info
const updateFaqService = async (
    FaqId: string,
    payload: Partial<IFaq>
): Promise<any> => {
    const result = await FaqModel.findByIdAndUpdate({ _id: FaqId }, payload, {
        new: true, // returns the updated doc
        runValidators: true,
    });
    return result;
};

// delete Faq info
export const deleteFaqService = async (_id: string): Promise<IFaq | any> => {

    const FaqInfo = await FaqModel.findById({ _id: _id });

    if (!FaqInfo) {
        return {};
    }
    const result = await FaqModel.findByIdAndDelete({ _id: _id }
    );
    return result;
};

export const FaqServices = {
    postFaqService,
    getFaqService,
    updateFaqService,
    deleteFaqService
};