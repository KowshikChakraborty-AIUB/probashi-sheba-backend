export interface IChecklist {
    _id?: string;
    checklist_title: string;
    checklist_description?: string;
    checklist_status: 'next' | 'completed' | 'upcoming';
    checklist_index_group: number;
    checklist_origin?: string;
    // checklist_origin?: 'next' | 'upcoming';
}
