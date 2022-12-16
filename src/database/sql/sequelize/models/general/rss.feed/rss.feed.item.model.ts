import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    IsUUID,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import Rssfeed from './rss.feed.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'RssfeedItem',
    tableName       : 'rss_feed_items',
    paranoid        : true,
    freezeTableName : true,
})
export default class RssfeedItem extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => {
            return v4();
        },
        allowNull : false,
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => Rssfeed)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    FeedId: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    Title: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Description: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Link: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : false,
    })
    Content: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Image: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Category: string;

    @Column({
        type         : DataType.TEXT,
        allowNull    : false,
        defaultValue : "[]"
    })
    Tags: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    AuthorName: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    AuthorEmail: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    AuthorLink: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    PublishingDate: Date;

    @BelongsTo(() => Rssfeed, 'FeedId')
    Feed: Rssfeed;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}

