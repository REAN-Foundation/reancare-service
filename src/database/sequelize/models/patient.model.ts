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

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'Patient',
    tableName: 'patients',
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
    UserId: string;

    @Length({ min: 4, max: 16})
    @Column({
        type: DataType.STRING(16),
        allowNull: false,
    })
    DisplayId: string;

    // @Length({ min: 4, max: 16})
    @Column({
        type: DataType.STRING(32),
        allowNull: true,
    })
    NationalHealthId: string;

    @IsUUID(4)
    @Column({
        type:  DataType.UUIDV4,
        allowNull: true,
    })
    AddressId: string;

    @Length({ min: 4, max: 16})
    @Column({
        type: DataType.STRING(16),
        allowNull: false,
        defaultValue: '+05:30'
    })
    TimeZone: string;

    @Column
    @CreatedAt
    CreateAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

};
