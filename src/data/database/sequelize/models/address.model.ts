import { Organizations } from 'aws-sdk';
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
    Length, 
    ForeignKey,
    HasOne,
    BelongsTo} from 'sequelize-typescript';

import { v4 } from 'uuid';
import Organization from './organization.model';
import Person from './person.model';

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

    @IsUUID(4)
    @ForeignKey(() => Person)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    PersonId: string;

    @BelongsTo(() => Person)
    Person: Person;

    @IsUUID(4)
    @ForeignKey(() => Organization)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    OrganizationId: string;

    @BelongsTo(() => Organization)
    Organization: Organization;

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
        allowNull : true,
    })
    AddressLine: string;

    @Length({ min: 2, max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : true
    })
    City: string;

    @Length({ min: 2, max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : true
    })
    District: string;

    @Length({ min: 2, max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : true
    })
    State: string;

    @Length({ min: 2, max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : true
    })
    Country: string;

    @Length({ min: 2, max: 16 })
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
