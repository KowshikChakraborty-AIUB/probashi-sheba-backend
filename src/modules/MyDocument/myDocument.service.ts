import AppError from "../../errors/AppError";
import statusCodes from 'http-status';
import { MyDocumentModel } from "./myDocument.model";
import { IMyDocument } from "./myDocument.interface";

// Create MyDocument
const postMyDocumentService = async (
    payload: IMyDocument
): Promise<IMyDocument> => {

    const existingMyDocument = await MyDocumentModel.findOne({ document_name: payload?.document_name })

    if (existingMyDocument) {
        throw new AppError(statusCodes.BAD_REQUEST, 'You already added this myDocument!');
    }

    

    const result = await MyDocumentModel.create(payload);
    return result;
};


//get MyDocument info
const getMyDocumentService = async () => {
    const result = await MyDocumentModel.find();
    return result;
};

// update MyDocument info
const updateMyDocumentService = async (
    myDocumentId: string,
    payload: Partial<IMyDocument>
): Promise<any> => {
    const existingMyDocument = await MyDocumentModel.findById({ _id: myDocumentId });

    if (!existingMyDocument) {
        throw new AppError(statusCodes.NOT_FOUND, 'MyDocument not found');
    }



    const result = await MyDocumentModel.findByIdAndUpdate({ _id: myDocumentId }, payload, {
        new: true, // returns the updated doc
        runValidators: true,
    });
    return result;
};

// delete MyDocument info
export const deleteMyDocumentService = async (_id: string): Promise<IMyDocument | any> => {

    const myDocumentInfo = await MyDocumentModel.findById({ _id: _id });
    console.log("myDocumentInfo", myDocumentInfo);
    if (!myDocumentInfo) {
        return {};
    }
    const result = await MyDocumentModel.findByIdAndDelete({ _id: _id }
    );
    return result;
};

export const MyDocumentServices = {
    postMyDocumentService,
    getMyDocumentService,
    updateMyDocumentService,
    deleteMyDocumentService
};