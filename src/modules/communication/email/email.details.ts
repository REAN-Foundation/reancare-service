export interface EmailDetails {
    EmailTo     : string;
    Subject     : string;
    Body        : string;
    Attachments?: string[];
    CcTo       ?: string;
}
