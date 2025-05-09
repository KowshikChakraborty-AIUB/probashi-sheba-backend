
export interface IAdditionalImagesArray {
    additional_image?: string;
    additional_image_key?: string;
}

export interface IWhoWeAreItems {
    who_we_are_item_image?: string;
    who_we_are_item_image_key?: string;
    who_we_are_item_unit_english?: number;
    who_we_are_item_unit_bangla?: string;
    who_we_are_item_title_english?: string;
    who_we_are_item_title_bangla?: string;
}

export interface IWhoWeAre {
    _id?: string;
    who_we_are_title_english?: string;
    who_we_are_title_bangla?: string;
    who_we_are_description_english?: string;
    who_we_are_description_bangla?: string;
    who_we_are_details_english?: string;
    who_we_are_details_bangla?: string;
    who_we_are_image?: string;
    who_we_are_image_key?: string;
    who_we_are_additional_images?: IAdditionalImagesArray[];
    who_we_are_services?: IWhoWeAreItems;
    who_we_are_migrants?: IWhoWeAreItems;
    who_we_are_saved?: IWhoWeAreItems;
    who_we_are_days?: IWhoWeAreItems;
    who_we_are_employees?: IWhoWeAreItems;
}


