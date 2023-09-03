import { uuid } from "../../miscellaneous/system.types";

export interface RssfeedDto {
    id?                 : uuid;
    Title?              : string;
    Description?        : string;
    Link?               : string;
    Language?           : string;
    Copyright?          : string;
    Favicon?            : string;
    Updated?            : Date;
    Image?              : string;
    Category?           : string;
    Tags?               : string[];
    ProviderName?       : string;
    ProviderEmail?      : string;
    ProviderLink ?      : string;
    AtomFeedLink?       : string;
    JsonFeedLink?       : string;
    RssFeedLink?        : string;
    AtomFeedResourceId? : uuid;
    RssFeedResourceId?  : uuid;
    JsonFeedResourceId? : uuid;
    FeedItems?          : RssfeedItemDto[];
    CreatedAt?          : Date;
}

export interface RssfeedItemDto {
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
