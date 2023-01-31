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
    ForeignKey } from 'sequelize-typescript';

import { v4 } from 'uuid';
import User from '../../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'PatientInsurance',
    tableName       : 'patient_insurances',
    paranoid        : true,
    freezeTableName : true
})
export default class PatientInsurance extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    InsuranceProvider: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    InsurancePolicyCode: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    ValidFrom: Date;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    ValidTill: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
