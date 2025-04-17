import AppError from "../../errors/AppError";
import statusCodes from 'http-status';
import { IChecklist } from "./checklist.interface";
import { ChecklistModel } from "./checklist.model";

// Create Checklist
const postChecklistService = async (
    payload: IChecklist
): Promise<IChecklist> => {

    const existingChecklist = await ChecklistModel.findOne({ checklist_title: payload?.checklist_title })

    if (existingChecklist) {
        throw new AppError(statusCodes.BAD_REQUEST, 'You already added this checklist!');
    }


    const result = await ChecklistModel.create(payload);
    return result;
};


//get Checklist info
const getChecklistService = async () => {
    const result = await ChecklistModel.find();
    return result;
};

// update Checklist info
const updateChecklistService = async (
    checklistId: string,
    payload: Partial<IChecklist>
): Promise<any> => {
    const result = await ChecklistModel.findByIdAndUpdate({ _id: checklistId }, payload, {
        new: true, // returns the updated doc
        runValidators: true,
    });
    return result;
};

// delete Checklist info
export const deleteChecklistService = async (_id: string): Promise<IChecklist | any> => {

    const checklistInfo = await ChecklistModel.findById({ _id: _id });
    console.log("checklistInfo", checklistInfo);
    if (!checklistInfo) {
        return {};
    }
    const result = await ChecklistModel.findByIdAndDelete({ _id: _id }
    );
    return result;
};

export const ChecklistServices = {
    postChecklistService,
    getChecklistService,
    updateChecklistService,
    deleteChecklistService
};