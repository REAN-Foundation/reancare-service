import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import Delivery from './delivery.model';
import Complication from './complication.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Baby',
    tableName       : 'maternity_babies',
    paranoid        : true,
    freezeTableName : true,
})
export default class Baby extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        allowNull    : false,
        defaultValue : () => v4()
    })
    id: string;

   @IsUUID(4)
    @ForeignKey(() => Delivery)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    DeliveryId: string;

    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    PatientUserId: string;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    WeightAtBirthGrams: number;

    @Column({
        type      : DataType.STRING,
        allowNull : false,
    })
    Gender: string;

    @Column({
        type      : DataType.STRING,
        allowNull : false,
    })
    Status: string;

    @IsUUID(4)
    @ForeignKey(() => Complication)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ComplicationId: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;
}
