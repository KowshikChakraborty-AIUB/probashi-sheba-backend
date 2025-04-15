import AppError from "../../errors/AppError";
import { IBMETRegistration } from "./BMETRegistration.interface";
import BMETModel from "./BMETRegistration.model";
import statusCodes from 'http-status';

// Create BMET Registration
export const postBMETRegistrationService = async (
  payload: IBMETRegistration
): Promise<IBMETRegistration> => {

  const userData = await BMETModel.find({ passport_number: payload?.passport_number })

  if (userData.length) {
    throw new AppError(statusCodes.BAD_REQUEST, 'You already completed registration');
  }


  const created = await BMETModel.create(payload);
  return created;
};


//get BMET Registration info
export const getBMETRegistrationService = async () => {
  const result = await BMETModel.find();
  return result;
};

// update BMET Registration info
export const updateBMETRegistrationService = async (
  bmetId: string,
  payload: Partial<IBMETRegistration>
): Promise<any> => {
  const result = await BMETModel.findByIdAndUpdate({ _id: bmetId }, payload, {
    new: true, // returns the updated doc
    runValidators: true,
  });
  return result;
};