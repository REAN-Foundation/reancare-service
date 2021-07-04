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
    Length    } from 'sequelize-typescript';

import { uuid } from 'uuidv4';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'Address',
    tableName: 'addresses',
    paranoid: true,
    freezeTableName: true
})
export default class Address extends Model {

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
        allowNull: true,
    })
    UserId: string;

    @IsUUID(4)
    @Column({
        type:  DataType.UUID,
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
        type: DataType.FLOAT,
        allowNull: true,
    })
    LocationCoordsLongitude: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    LocationCoordsLattitude: number;

    @Column
    @CreatedAt
    CreateAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

};
