import { Types } from "mongoose";

export interface IEducationalQualifications {
    _id?: any;
    qualification: string;
    passing_year: number;
    institution_name: string;
    board_name: string;
    subject_name: string;
    grade_division: string;
}

export interface ILanguages {
    language_name: string;
    verbal_skill: string;
    written_skill: string;
}

export interface ISupportingDocuments {
    document_name: string;
    document_image: string;
    document_image_key: string;
}

export interface IBMETRegistration {
    _id?: any;
    user_id?: Types.ObjectId;
    country_to_go: string;
    interested_profession?: string;
    has_experience_that_profession?: string;
    user_name: string;
    passport_image: string;
    passport_image_key: string;
    passport_number: string;
    passport_issue_date: Date;
    passport_expire_date: Date;
    passport_verification_status: "verified" | "pending";
    nid?: string;
    birth_place: string;
    birth_date: Date;
    gender: string;
    father_name: string;
    mother_name: string;
    marital_status: string;
    spouse_name?: string;
    religion: string;
    weight: number;
    phone: number;
    email: string;
    permanent_district: string;
    permanent_thana_upozilla: string;
    permanent_ward_union: string;
    permanent_village: string;
    permanent_house_name_no: string
    present_district?: string;
    present_thana_upozilla?: string;
    present_ward_union?: string;
    present_village?: string;
    present_house_name_no?: string;
    nominee_relation: string;
    nominee_name: string;
    nominee_nid?: string;
    nominee_phone: number;
    nominee_father_name: string;
    nominee_mother_name: string;
    nominee_present_district?: string;
    nominee_present_thana_upozilla?: string;
    nominee_present_ward_union?: string;
    nominee_present_village?: string;
    nominee_present_house_name_no?: string;
    emergency_contact_relationship: string;
    emergency_contact_name: string;
    emergency_contact_phone: number;
    educational_qualifications: Types.ObjectId | IEducationalQualifications[];
    languages: Types.ObjectId | ILanguages[];
    supporting_documents: Types.ObjectId | ISupportingDocuments[];
    //document_name: string[];
}