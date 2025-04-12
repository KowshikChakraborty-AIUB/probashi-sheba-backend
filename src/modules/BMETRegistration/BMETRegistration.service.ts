import { IBMETRegistration } from "./BMETRegistration.interface";
import BMETModel from "./BMETRegistration.model";

// Create BMET Registration
export const postBMETRegistrationService = async (
  data: IBMETRegistration
): Promise<IBMETRegistration> => {
  const created = await BMETModel.create(data);
  return created;
};