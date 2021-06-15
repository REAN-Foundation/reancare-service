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
    modelName: 'Address',
    tableName: 'addresses',
    paranoid: true,
    freezeTableName: true
})
export class Address extends Model {

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
        allowNull: true,
    })
    UserId: string;

    @IsUUID(4)
    @Column({
        type:  DataType.UUIDV4,
        allowNull: true,
    })
    OrganizationId: string;

    @Length({ min: 2, max: 16})
    @Column({
        type: DataType.STRING(16),
        allowNull: false,
        defaultValue: 'Work'
    })
    Type: string;

    @Length({ max: 64})
    @Column({
        type:  DataType.STRING(64),
        allowNull: true,
    })
    AddressLine: string;

    @Length({ min: 2, max: 32})
    @Column({
        type: DataType.STRING(32),
        allowNull: true
    })
    City: string;

    @Length({ min: 2, max: 32})
    @Column({
        type: DataType.STRING(32),
        allowNull: true
    })
    District: string;

    @Length({ min: 2, max: 32})
    @Column({
        type: DataType.STRING(32),
        allowNull: true
    })
    State: string;

    @Length({ min: 2, max: 32})
    @Column({
        type: DataType.STRING(32),
        allowNull: true
    })
    Country: string;

    @Length({ min: 2, max: 16})
    @Column({
        type: DataType.STRING(16),
        allowNull: true
    })
    PostalCode: string;

    @Column({
        type: DataType.STRING(128),
        allowNull: true,
    })
    LocationCoordsLongitude: string;

    @Column({
        type: DataType.STRING(128),
        allowNull: true,
    })
    LocationCoordsLattitude: string;

    @Column
    @CreatedAt
    CreateAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

};
