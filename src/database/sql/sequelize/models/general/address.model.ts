import {
    Column, CreatedAt, DataType, DeletedAt,
    IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Address',
    tableName       : 'addresses',
    paranoid        : true,
    freezeTableName : true
})
export default class Address extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    id: string;

    @Length({ min: 2, max: 16 })
    @Column({
        type         : DataType.STRING(16),
        allowNull    : false,
        defaultValue : 'Work'
    })
    Type: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : false,
    })
    AddressLine: string;

    @Length({ max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : true
    })
    City: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true
    })
    Location: string;

    @Length({ max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : true
    })
    District: string;

    @Length({ max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : true
    })
    State: string;

    @Length({ max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true
    })
    Country: string;

    @Length({ max: 16 })
    @Column({
        type      : DataType.STRING(16),
        allowNull : true
    })
    PostalCode: string;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    Longitude: number;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    Lattitude: number;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
