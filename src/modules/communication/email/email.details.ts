export interface EmailDetails {
    EmailTo     : string;
    Subject     : string;
    Body        : string;
    Attachments?: any[];
    CcTo       ?: string;
}
