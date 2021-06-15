import { 
    Table, 
    Column, 
    Model,
    DataType,
    HasMany,
    HasOne,
    BelongsTo,
    BelongsToMany,
    CreatedAt, 
    UpdatedAt, 
    DeletedAt, 
    IsUUID,
    PrimaryKey,
    Length,
    BeforeCreate,
    IsEmail,
    IsDate,
    IsInt,
    ForeignKey
    } from 'sequelize-typescript';

import { UUIDV4 } from 'sequelize/types';
import * as bcrypt from 'bcryptjs';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'PatientInsurance',
    tableName: 'patient_insurances',
    paranoid: true,
    freezeTableName: true
})
export class User extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUIDV4,
        defaultValue: UUIDV4,
        allowNull: false
    })
    id: string;

    @IsUUID(4)
    @Column({
        type:  DataType.UUIDV4,
        allowNull: false,
    })
    PatientUserId: string;

    @Column({
        type: DataType.STRING(64),
        allowNull: true,
    })
    InsuranceProvider: string;

    @Column({
        type: DataType.STRING(64),
        allowNull: true,
    })
    InsurancePolicyCode: string;

    @Column
    @CreatedAt
    CreateAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

};
