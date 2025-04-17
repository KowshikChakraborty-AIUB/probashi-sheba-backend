import AppError from "../../errors/AppError";
import statusCodes from 'http-status';
import { ITestimonial } from "./testimonial.interface";
import { TestimonialModel } from "./testimonial.model";
import e from "express";

// Create Testimonial
const postTestimonialService = async (
    payload: ITestimonial
): Promise<ITestimonial> => {

    const existingTestimonial = await TestimonialModel.findOne({ testimonial_name: payload?.testimonial_name })
    console.log(existingTestimonial, "existingTestimonial");

    if (existingTestimonial) {
        throw new AppError(statusCodes.BAD_REQUEST, 'You already added this testimonial!');
    }


    const result = await TestimonialModel.create(payload);
    return result;
};


//get Testimonial info
const getTestimonialService = async () => {
    const result = await TestimonialModel.find();
    return result;
};

// update Testimonial info
const updateTestimonialService = async (
    TestimonialId: string,
    payload: Partial<ITestimonial>
): Promise<any> => {
    const result = await TestimonialModel.findByIdAndUpdate({ _id: TestimonialId }, payload, {
        new: true, // returns the updated doc
        runValidators: true,
    });
    return result;
};

// delete Testimonial info
export const deleteTestimonialService = async (_id: string): Promise<ITestimonial | any> => {

    const TestimonialInfo = await TestimonialModel.findById({ _id: _id });
    console.log("TestimonialInfo", TestimonialInfo);
    if (!TestimonialInfo) {
        return {};
    }
    const result = await TestimonialModel.findByIdAndDelete({ _id: _id }
    );
    return result;
};

export const TestimonialServices = {
    postTestimonialService,
    getTestimonialService,
    updateTestimonialService,
    deleteTestimonialService
};