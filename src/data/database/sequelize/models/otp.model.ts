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
    modelName: 'Otp',
    tableName: 'otp',
    paranoid: true,
    freezeTableName: true
})
export default class Otp extends Model {

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
        type: DataType.UUID,
        allowNull: false,
    })
    UserId: string;

    @Length({ min: 1, max: 64})
    @Column({
        type: DataType.STRING(64),
        allowNull: true,
    })
    Purpose: string;

    @Length({ min: 6, max: 6})
    @Column({
        type: DataType.STRING(8),
        allowNull: true,
    })
    Otp: string;

    @IsDate
    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    ValidFrom: Date;

    @IsDate
    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    ValidTill: Date;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    Utilized: boolean;

    @Column
    @CreatedAt
    CreateAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

};
