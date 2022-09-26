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
    Length,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import FileResource from './file.resource.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'FileResourceVersion',
    tableName       : 'file_resource_versions',
    paranoid        : true,
    freezeTableName : true,
})
export default class FileResourceVersion extends Model {

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
    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    ResourceId: string;

    @BelongsTo(() => FileResource)
    Resource: FileResource;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    FileName: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    OriginalFileName: string;

    @Length({ max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : false,
    })
    Version: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    MimeType: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : true,
    })
    StorageKey: string;
        
    @Column({
        type         : DataType.FLOAT,
        allowNull    : false,
        defaultValue : 0
    })
    SizeInKB: number;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
