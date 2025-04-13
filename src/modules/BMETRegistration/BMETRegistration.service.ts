import AppError from "../../Errors/AppError";
import { IBMETRegistration } from "./BMETRegistration.interface";
import BMETModel from "./BMETRegistration.model";
import statusCodes from 'http-status';

// Create BMET Registration
export const postBMETRegistrationService = async (
  data: IBMETRegistration
): Promise<IBMETRegistration> => {

  const userData = await BMETModel.find({passport_number: data?.passport_number})
  
  if (userData.length) {
    throw new AppError(statusCodes.BAD_REQUEST, 'You already completed registration');
  }


  const created = await BMETModel.create(data);
  return created;
};