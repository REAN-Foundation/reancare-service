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
    IsDate,
    ForeignKey,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import User from '../user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'FileResource',
    tableName       : 'file_resources',
    paranoid        : true,
    freezeTableName : true,
})
export default class FileResource extends Model {

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
    
    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    EhrId: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : true,
    })
    FileName: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    OwnerUserId: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    UploadedByUserId: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : true,
    })
    StorageKey: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false
    })
    IsPublic: boolean;
    
    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false
    })
    IsMultiResolutionImage: boolean;

    @Length({ max: 2048 })
    @Column({
        type      : DataType.STRING(2048),
        allowNull : true,
    })
    Tags: string; //Comma separated string list

    @Length({ max: 64 })
    @Column({ 
        type      : DataType.STRING(64),
        allowNull : true,
    })
    MimeType: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    MetaInformation: string;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    SizeInKB: number;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    UploadedDate: Date

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
