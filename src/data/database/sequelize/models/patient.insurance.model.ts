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

import { uuid } from 'uuidv4';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'PatientInsurance',
    tableName: 'patient_insurances',
    paranoid: true,
    freezeTableName: true
})
export default class User extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: () => { return uuid(); },
        allowNull: false
    })
    id: string;

    @IsUUID(4)
    @Column({
        type:  DataType.UUID,
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
