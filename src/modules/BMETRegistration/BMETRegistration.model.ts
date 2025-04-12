import { Schema, model, Types } from "mongoose";
import { IBMETRegistration } from "./BMETRegistration.interface";

const EducationalQualificationsSchema = new Schema({
    qualification: String,
    passing_year: Number,
    institution_name: String,
    board_name: String,
    subject_name: String,
    grade_division: String,
});

const LanguageSchema = new Schema({
    language_name: String,
    verbal_skill: String,
    written_skill: String,
});

const SupportingDocumentSchema = new Schema({
    document_name: String,
    document_image: String,
    document_image_key: String,
});

const BMETSchema = new Schema<IBMETRegistration>(
    {
        user_id: {
            type: Types.ObjectId,
            ref: "users",
        },
        country_to_go: { type: String, required: true },
        interested_profession: { type: String },
        has_experience_that_profession: { type: String },
        user_name: { type: String, required: true },
        passport_image: { type: String, required: true },
        passport_image_key: { type: String, required: true },
        passport_number: { type: String, required: true },
        passport_issue_date: { type: Date, required: true },
        passport_expire_date: { type: Date, required: true },

        nid: { type: String },
        birth_place: { type: String, required: true },
        birth_date: { type: Date, required: true },
        gender: { type: String, required: true },
        father_name: { type: String, required: true },
        mother_name: { type: String, required: true },
        marital_status: { type: String, required: true },
        spouse_name: { type: String },
        religion: { type: String, required: true },
        weight: { type: Number, required: true },
        phone: { type: Number, required: true },
        email: { type: String, required: true },

        // Permanent Address
        permanent_district: { type: String, required: true },
        permanent_thana_upozilla: { type: String, required: true },
        permanent_ward_union: { type: String, required: true },
        permanent_village: { type: String, required: true },
        permanent_house_name_no: { type: String, required: true },

        // Present Address
        present_district: { type: String },
        present_thana_upozilla: { type: String },
        present_ward_union: { type: String },
        present_village: { type: String },
        present_house_name_no: { type: String },

        // Nominee Info
        nominee_relation: { type: String, required: true },
        nominee_name: { type: String, required: true },
        nominee_nid: { type: String },
        nominee_phone: { type: Number, required: true },
        nominee_father_name: { type: String, required: true },
        nominee_mother_name: { type: String, required: true },
        nominee_present_district: { type: String },
        nominee_present_thana_upozilla: { type: String },
        nominee_present_ward_union: { type: String },
        nominee_present_village: { type: String },
        nominee_present_house_name_no: { type: String },

        // Emergency Contact
        emergency_contact_relationship: { type: String, required: true },
        emergency_contact_name: { type: String, required: true },
        emergency_contact_phone: { type: Number, required: true },

        // Nested Data
        educational_qualifications: {
            type: [EducationalQualificationsSchema],
            default: [],
        },
        languages: {
            type: [LanguageSchema],
            default: [],
        },
        supporting_documents: {
            type: [SupportingDocumentSchema],
            default: [],
        },
        //document_name: {type: [String], required: true}
    },
    {
        timestamps: true,
    }
);

const BMETModel = model<IBMETRegistration>("bmetregistrations", BMETSchema);

export default BMETModel;