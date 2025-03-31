import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import Pregnancy from './pregnancy.model';
import Delivery from './delivery.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'PostNatalVisit',
    tableName       : 'maternity_postnatal_visits',
    paranoid        : true,
    freezeTableName : true,
})
export default class PostNatalVisit extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        allowNull    : false,
        defaultValue : () => v4()
    })
    id:string;

    @IsUUID(4)
    @ForeignKey(() => Delivery)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    DeliveryId: string;

    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    DateOfVisit: Date;

    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    BodyWeightId: string;

    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ComplicationId: string;

    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    BodyTemperatureId: string;

    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    BloodPressureId: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;
}
