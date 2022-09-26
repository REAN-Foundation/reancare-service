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
    HasOne,
    HasMany,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import User from '../../users/user/user.model';
import FileResourceReference from './file.resource.reference.model';
import FileResourceVersion from './file.resource.version.model';

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

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false
    })
    IsPublicResource: boolean;

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

    @IsUUID(4)
    @ForeignKey(() => FileResourceVersion)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    DefaultVersionId: string;

    @HasOne(() => FileResourceVersion)
    DefaultVersion: FileResourceVersion;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    UploadedDate: Date;

    @HasMany(() => FileResourceReference)
    References: FileResourceReference[];

    @HasMany(() => FileResourceVersion)
    Versions: FileResourceVersion[];

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}

// FileResource.hasMany(FileResourceReference, { as: 'References'});
// FileResource.hasMany(FileResourceVersion, { as: 'Versions'});
//FileResource.hasOne(FileResourceVersion, { as: 'DefaultVersion', foreignKey: 'DefaultVersionId'});
