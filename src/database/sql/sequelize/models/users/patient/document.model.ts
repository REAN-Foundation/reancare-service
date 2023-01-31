import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsDate, IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import { OrderTypes } from '../../../../../../domain.types/clinical/order/order.types';
import { VisitType, VisitTypeList } from '../../../../../../domain.types/miscellaneous/clinical.types';
import { DocumentTypes, DocumentTypesList } from '../../../../../../domain.types/users/patient/document/document.types';
import { Roles } from '../../../../../../domain.types/role/role.types';
import Order from '../../clinical/order.model';
import Visit from '../../clinical/visit.model';
import FileResource from '../../general/file.resource/file.resource.model';
import User from '../../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Document',
    tableName       : 'patient_documents',
    paranoid        : true,
    freezeTableName : true,
})
export default class Document extends Model {

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

    @Length({ max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : false,
    })
    DisplayId: string;

    @Length({ max: 128 })
    @Column({
        type         : DataType.STRING(128),
        allowNull    : false,
        values       : DocumentTypesList,
        defaultValue : DocumentTypes.Unknown
    })
    DocumentType: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    MedicalPractitionerUserId: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
        values    : [
            Roles.Doctor,
            Roles.LabUser,
            Roles.Nurse,
            Roles.PharmacyUser,
            Roles.SocialHealthWorker
        ]
    })
    MedicalPractionerRole: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    UploadedByUserId: string;

    @IsUUID(4)
    @ForeignKey(() => Visit)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    AssociatedVisitId: string;

    @Length({ max: 64 })
    @Column({
        type         : DataType.STRING(64),
        allowNull    : true,
        values       : VisitTypeList,
        defaultValue : VisitType.Unknown
    })
    AssociatedVisitType: string;

    @IsUUID(4)
    @ForeignKey(() => Order)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    AssociatedOrderId: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
        values    : [
            OrderTypes.DrugOrder,
            OrderTypes.DiagnosticPathologyLabOrder,
            OrderTypes.DiagnosticImagingStudyOrder,
            OrderTypes.MiscellaneousOrder,
            OrderTypes.Unknown
        ]
    })
    AssociatedOrderType: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : true,
    })
    FileName: string;

    @IsUUID(4)
    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    ResourceId: string;

    @Length({ max: 512 })
    @Column({
        type         : DataType.STRING(512),
        allowNull    : false,
        defaultValue : ''
    })
    AuthenticatedUrl: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    MimeType: string;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    SizeInKBytes: number;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    RecordDate: Date;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    UploadedDate: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
