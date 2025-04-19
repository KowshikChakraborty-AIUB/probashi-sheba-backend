import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { IKeyImpacts } from './keyImpacts.interface';
import { KeyImpactsModel } from './keyImpacts.model';


// Create KeyImpactss
const createKeyImpactsServices = async (keyImpacts: IKeyImpacts) => {
  const isKeyImpactsExists = await KeyImpactsModel.findOne({ name: keyImpacts.keyImpacts_title_english })
  if (isKeyImpactsExists) {
    throw new AppError(httpStatus.CONFLICT, 'This keyImpacts is already exists!');
  }
  const result = await KeyImpactsModel.create(keyImpacts)
  return result
};

// Find KeyImpactss
const findKeyImpactsServices = async (queryParams: Record<string, unknown>) => {
  const modelQuery = KeyImpactsModel.find({ keyImpacts_status: "active" }).sort({ keyImpacts_serial: 1 }) // Initial Mongoose query

  const query = new QueryBuilder(modelQuery, queryParams)
    .search(['keyImpacts_title_english']) // Provide searchable fields
    // .filter()
    .sort()
    .paginate()
  // .fields();

  const result = await query.modelQuery; // Execute the query
  // const result = await query.modelQuery.sort({ sequence: 1 }); // Execute the query
  return result;
};

// find all dashboard KeyImpactss
export const findAllDashboardKeyImpactservices = async (queryParams: Record<string, unknown>) => {
  const modelQuery = KeyImpactsModel.find().sort({ keyImpacts_serial: 1 });

  const query = new QueryBuilder(modelQuery, queryParams)
    .search(['keyImpacts_title_english']) // Provide searchable fields
    // .filter()
    .sort()
    .paginate()
  // .fields();

  const result = await query.modelQuery; // Execute the query
  return result;
};

// Update KeyImpactss
const updateKeyImpactsServices = async (keyImpacts: IKeyImpacts, _id: string): Promise<IKeyImpacts | any> => {
  const updateKeyImpactsInfo = await KeyImpactsModel.findOne({ _id: _id });
  if (!updateKeyImpactsInfo) {
    return {};
  }
  const Brand = await KeyImpactsModel.findByIdAndUpdate({ _id: _id },
    { $set: keyImpacts }, // ✅ This ensures only provided fields are updated
    { new: true, runValidators: true, context: "query" }
  );
  return Brand;
};

// Delete a KeyImpacts
export const deleteKeyImpactsServices = async (_id: string): Promise<IKeyImpacts | any> => {
  const updateKeyImpactsInfo = await KeyImpactsModel.findOne({ _id: _id });
  if (!updateKeyImpactsInfo) {
    return {};
  }
  const KeyImpacts = await KeyImpactsModel.findByIdAndDelete({ _id: _id }
  );
  return KeyImpacts;
};

export const KeyImpactsService = {
  createKeyImpactsServices,
  findKeyImpactsServices,
  updateKeyImpactsServices,
  findAllDashboardKeyImpactservices,
  deleteKeyImpactsServices
};