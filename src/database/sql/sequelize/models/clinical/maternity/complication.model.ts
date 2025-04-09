import {
    BelongsTo,
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import Delivery from './delivery.model';
import Baby from './baby.model';
import MedicalCondition from '../medical.condition.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Complication',
    tableName       : 'maternity_complications',
    paranoid        : true,
    freezeTableName : true,
})
export default class Complication extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        allowNull    : false,
        defaultValue : () => v4()
    })
    id:string;

    @ForeignKey(() => Delivery)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    DeliveryId: string;

    @BelongsTo(() => Delivery)
    delivery: Delivery;

    @ForeignKey(() => Baby)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    BabyId1: string;

    @ForeignKey(() => Baby)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    BabyId2: string;

    @ForeignKey(() => Baby)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    BabyId3: string;

    @Column({
        type      : DataType.STRING,
        allowNull : false,
    })
    Name: string;

    @Column({
        type      : DataType.STRING,
        allowNull : false,
    })
    Status: string;

    @Column({
        type      : DataType.STRING,
        allowNull : true,
    })
    Severity: string;

    @IsUUID(4)
    @ForeignKey(() => MedicalCondition)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    MedicalConditionId: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;
}
