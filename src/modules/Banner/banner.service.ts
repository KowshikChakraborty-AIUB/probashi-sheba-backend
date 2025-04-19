import httpStatus from 'http-status';
import { IBanner } from './banner.interface';
import { BannerModel } from './banner.model';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';


// Create Banners
const createBannerServices = async (banner: IBanner) => {
  const isBannerExists = await BannerModel.findOne({ name: banner.banner_title_english })
  if (isBannerExists) {
    throw new AppError(httpStatus.CONFLICT, 'This banner is already exists!');
  }
  const result = await BannerModel.create(banner)
  return result
};

// Find Banners
const findBannersServices = async (queryParams: Record<string, unknown>) => {
  const modelQuery = BannerModel.find({ banner_status: "active" }).sort({banner_serial: 1}) // Initial Mongoose query

  const query = new QueryBuilder(modelQuery, queryParams)
    .search(['banner_title_english']) // Provide searchable fields
    // .filter()
    .sort()
    .paginate()
  // .fields();

  const result = await query.modelQuery; // Execute the query
  // const result = await query.modelQuery.sort({ sequence: 1 }); // Execute the query
  return result;
};

// find all dashboard Banners
export const findAllDashboardBannerServices = async (queryParams: Record<string, unknown>) => {
  const modelQuery = BannerModel.find().sort({ banner_serial: 1 });

  const query = new QueryBuilder(modelQuery, queryParams)
    .search(['banner_title_english']) // Provide searchable fields
    // .filter()
    .sort()
    .paginate()
  // .fields();

  const result = await query.modelQuery; // Execute the query
  return result;
};

// Update Banners
const updateBannerServices = async (banner: IBanner, _id: string): Promise<IBanner | any> => {
  const updateBannerInfo = await BannerModel.findOne({ _id: _id });
  if (!updateBannerInfo) {
    return {};
  }
  const Brand = await BannerModel.findByIdAndUpdate({ _id: _id },
    { $set: banner }, // ✅ This ensures only provided fields are updated
    { new: true, runValidators: true, context: "query" }
  );
  return Brand;
};

// Delete a Banner
export const deleteBannerServices = async (_id: string): Promise<IBanner | any> => {
  const updateBannerInfo = await BannerModel.findOne({ _id: _id });
  if (!updateBannerInfo) {
    return {};
  }
  const Banner = await BannerModel.findByIdAndDelete({ _id: _id }
  );
  return Banner;
};

export const BannerService = {
  createBannerServices,
  findBannersServices,
  updateBannerServices,
  findAllDashboardBannerServices,
  deleteBannerServices
};