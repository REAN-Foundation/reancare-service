import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsDate,
    IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import { DocumentTypes, DocumentTypesList } from '../../../../../../domain.types/users/patient/document/document.types';
import FileResource from '../../general/file.resource/file.resource.model';
import User from '../user/user.model';
import Document from './document.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'SharedDocumentDetails',
    tableName       : 'shared_document_details',
    paranoid        : true,
    freezeTableName : true,
})
export default class SharedDocumentDetails extends Model {

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
    @ForeignKey(() => Document)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    DocumentId: string;

    @IsUUID(4)
    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    ResourceId: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : false,
        values       : DocumentTypesList,
        defaultValue : DocumentTypes.Unknown
    })
    DocumentType: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : false,
    })
    OriginalLink: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    ShortLink: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : false,
    })
    Key: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    SharedWithUserId: string;

    @Column({
        type         : DataType.INTEGER,
        allowNull    : false,
        defaultValue : 720
    })
    SharedForDurationMin: number;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    SharedDate: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
