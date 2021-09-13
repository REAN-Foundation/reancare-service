export interface ResourceReferenceItem {
    ItemId: string;
    ItemType: string;
    Keyword?: string;
}

export interface SiblingResource {
    ResourceId: string;
    SizeInKB: number;
    Tag?: string;
}
