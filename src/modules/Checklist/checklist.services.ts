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

    // 1= completed, 2=next, 3=upcoming
    let checklistIndexGroup = 0;

    if (payload?.checklist_status === 'next') {
        checklistIndexGroup = 2;
    }

    if (payload?.checklist_status === 'upcoming') {
        checklistIndexGroup = 3;
    }

    const checklistPayload = {
        ...payload,
        checklist_index_group: checklistIndexGroup
    }
    console.log("checklistPayload", checklistPayload);

    const result = await ChecklistModel.create(checklistPayload);
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
    const existingChecklist = await ChecklistModel.findById({ _id: checklistId });

    if (!existingChecklist) {
        throw new AppError(statusCodes.NOT_FOUND, 'Checklist not found');
    }


    if (payload?.checklist_status === 'completed') {
        payload.checklist_index_group = 1;

        // Save where it came from (origin)
        // payload.checklist_origin = existingChecklist.checklist_status;
    }

    if (existingChecklist.checklist_status === 'completed' && (payload?.checklist_status === 'next' || payload?.checklist_status === 'upcoming')) {
        payload.checklist_index_group = payload?.checklist_status === 'next' ? 2 : 3;

        // Clear the origin
        // payload.checklist_origin = undefined;
    }

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