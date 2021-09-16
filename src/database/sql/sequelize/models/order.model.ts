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

import { OrderStates, OrderTypes } from '../../../../domain.types/order/order.types';
import { v4 } from 'uuid';
import Organization from './organization.model';
import User from './user.model';
import FileResource from './file.resource.model';
import Visit from './visit.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Order',
    tableName       : 'orders',
    paranoid        : true,
    freezeTableName : true,
})
export default class Order extends Model {

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
    
    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
        values    : [
            OrderTypes.DrugOrder,
            OrderTypes.DiagnosticPathologyLabOrder,
            OrderTypes.DiagnosticImagingStudyOrder,
            OrderTypes.MiscellaneousOrder,
            OrderTypes.Unknown
        ],
        defaultValue : OrderTypes.Unknown
    })
    Type: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    EhrId: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    DisplayId: string;

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

    @IsUUID(4)
    @ForeignKey(() => Visit)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    VisitId: string;

    @IsUUID(4)
    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ResourceId: string;

    @IsUUID(4)
    @ForeignKey(() => Order)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ReferenceOrderId: string;

    @Length({ max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : false,
        values    : [
            OrderStates.Initiated,
            OrderStates.Confirmed,
            OrderStates.InProgress,
            OrderStates.RaisedQuery,
            OrderStates.Cancelled,
            OrderStates.Completed,
            OrderStates.Unknown
        ],
        defaultValue : OrderStates.Unknown
    })
    CurrentState: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    OrderDate: Date

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    FulfilledByUserId: string;

    @IsUUID(4)
    @ForeignKey(() => Organization)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    FulfilledByOrganizationId: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    AdditionalInformation: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
