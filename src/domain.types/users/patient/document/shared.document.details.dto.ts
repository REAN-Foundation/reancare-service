import { DocumentTypes } from "./document.types";

export interface SharedDocumentDetailsDto {
    id?: string;
    DocumentId?: string;
    ResourceId?: string;
    PatientUserId?: string;
    DocumentType?: DocumentTypes;
    OriginalLink?: string;
    ShortLink?: string;
    Key?: string;
    SharedWithUserId?: string;
    SharedForDurationMin?: number;
    SharedDate?: Date;
}
