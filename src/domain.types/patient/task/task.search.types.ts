import { TaskDto } from "./task.dto";

export interface TaskSearchFilters {
    PatientUserId?: string;
    Name?: string;
    CategoryId?: number;
    Type: string;
    ReferenceItemId?: string;
    CreatedDateFrom?: Date;
    CreatedDateTo?: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface TaskSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: TaskDto[];
}
