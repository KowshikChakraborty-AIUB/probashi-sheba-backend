

export interface IWhoWeAreItems {
    who_we_are_item_image?: string;
    who_we_are_item_image_key?: string;
    who_we_are_item_unit?: number;
    who_we_are_item_title?: string;
}

export interface IWhoWeAre {
    _id?: string;
    who_we_are_title?: string;
    who_we_are_description?: string;
    who_we_are_services?: IWhoWeAreItems;
    who_we_are_migrants?: IWhoWeAreItems;
    who_we_are_saved?: IWhoWeAreItems;
    who_we_are_days?: IWhoWeAreItems;
    who_we_are_employees?: IWhoWeAreItems;
}


