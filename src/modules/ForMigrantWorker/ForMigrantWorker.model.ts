import { Schema, model } from 'mongoose';
import { IForMigrantWorker } from './ForMigrantWorker.interface';


const forMigrantWorkerSchema = new Schema<IForMigrantWorker>(
    {
        for_migrant_workers_tab_name: String,
        for_migrant_workers_tab_image: String,
        for_migrant_workers_tab_image_key: String,
        for_migrant_workers_tab_icon: String,
        for_migrant_workers_tab_icon_key: String,
        for_migrant_workers_tab_status: { type: String, default: 'active' },
        for_migrant_workers_tab_serial: String,
        for_migrant_workers_tab_contents: [
            {
                for_migrant_workers_tab_contents_title: String,
                for_migrant_workers_tab_contents_description: String,
                for_migrant_workers_tab_contents_link: String,
                for_migrant_workers_tab_contents_link_text: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const ForMigrantWorkerModel = model<IForMigrantWorker>('forMigrantWorkers', forMigrantWorkerSchema);
