import { Types } from "mongoose";

export interface IForMigrantWorker {
    _id?: Types.ObjectId;
    for_migrant_workers_tab_name?: string;
    for_migrant_workers_tab_image?: string;
    for_migrant_workers_tab_image_key?: string;
    for_migrant_workers_tab_icon?: string;
    for_migrant_workers_tab_icon_key?: string;
    for_migrant_workers_tab_status?: string;
    for_migrant_workers_tab_serial?: number;
    for_migrant_workers_tab_contents?: {
        for_migrant_workers_tab_contents_title?: string;
        for_migrant_workers_tab_contents_description?: string;
        for_migrant_workers_tab_contents_link?: string;
        for_migrant_workers_tab_contents_link_text?: string;
    }[];
}
