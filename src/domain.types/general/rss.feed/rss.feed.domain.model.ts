import { uuid } from "../../miscellaneous/system.types";

export interface RssfeedDomainModel {
    id?                : uuid;
    Title?             : string;
    Description?       : string;
    Link?              : string;
    Language?          : string;
    Copyright?         : string;
    Favicon?           : string;
    Image?             : string;
    Category?          : string;
    Tags?              : string[];
    ProviderName?      : string;
    ProviderEmail?     : string;
    ProviderLink ?     : string;
    AtomFeedLink?      : string;
    JsonFeedLink?      : string;
    RssFeedLink?       : string;
    AtomFeedResourceId?: uuid;
    RssFeedResourceId? : uuid;
    JsonFeedResourceId?: uuid;
    LastUpdatedOn?     : Date;
}

export interface RssfeedItemDomainModel {
    id?            : uuid;
    FeedId?        : uuid;
    Title?         : string;
    Description?   : string;
    Link?          : string;
    Content?       : string;
    Image?         : string;
    Tags?          : string[];
    AuthorName?    : string;
    AuthorEmail?   : string;
    AuthorLink ?   : string;
    PublishingDate?: Date;
}
