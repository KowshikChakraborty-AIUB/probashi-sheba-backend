


export interface IWhoWeAreItems {
    image?: string;
    image_key?: string;
    unit?: number;
    title?: string;
}

export interface IWhoWeAre {
    who_we_are_title?: string;
    who_we_are_description?: string;
    who_we_are_services?: IWhoWeAreItems;
    who_we_are_migrants?: IWhoWeAreItems;
    who_we_are_saved?: IWhoWeAreItems;
    who_we_are_days?: IWhoWeAreItems;
    who_we_are_employees?: IWhoWeAreItems;
}

export interface ITestimonial {
    testimonial_name?: string;
    testimonial_image?: string;
    testimonial_image_key?: string;
    testimonial_occupation?: string;
    testimonial_comment?: string;
    testimonial_rating?: number;
}

export interface IForMigrantWorkersTabContents {
    for_migrant_workers_tab_contents_title?: string;
    for_migrant_workers_tab_contents_description?: string;
    for_migrant_workers_tab_contents_link?: string;
    for_migrant_workers_tab_contents_link_text?: string;
}

export interface IForMigrantWorkers {
    for_migrant_workers_tab_name?: string;
    for_migrant_workers_tab_image?: string;
    for_migrant_workers_tab_image_key?: string;
    for_migrant_workers_tab_icon?: string;
    for_migrant_workers_tab_icon_key?: string;
    for_migrant_workers_tab_status?: string;
    for_migrant_workers_tab_serial?: string;
    for_migrant_workers_tab_contents?: IForMigrantWorkersTabContents[];
}

export interface IWebSettings {
    title: string;
    favicon?: string;
    favicon_key?: string;
    logo?: string;
    logo_key?: string;
    phone?: string;
    email?: string;
    address?: string;
    facebook_link?: string;
    instagram_link?: string;
    twitter_link?: string;
    youtube_link?: string;
    whatsapp_link?: string;
    welcome_message?: string;
    about?: string;
    privacy_policy?: string;
    terms?: string;
    who_we_are?: IWhoWeAre;
    testimonials?: ITestimonial[];
    for_migrant_workers?: IForMigrantWorkers[];
};