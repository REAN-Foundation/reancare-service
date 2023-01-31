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
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import FileResource from '../file.resource/file.resource.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Rssfeed',
    tableName       : 'rss_feeds',
    paranoid        : true,
    freezeTableName : true,
})
export default class Rssfeed extends Model {

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
        type         : DataType.TEXT,
        allowNull    : false,
        defaultValue : 'en-us'
    })
    Language: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Copyright: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Favicon: string;

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
    ProviderName: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    ProviderEmail: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    ProviderLink: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    AtomFeedLink: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    JsonFeedLink: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    RssFeedLink: string;

    @IsUUID(4)
    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    AtomFeedResourceId: string;

    @IsUUID(4)
    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    RssFeedResourceId: string;

    @IsUUID(4)
    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    JsonFeedResourceId: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    LastUpdatedOn: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
