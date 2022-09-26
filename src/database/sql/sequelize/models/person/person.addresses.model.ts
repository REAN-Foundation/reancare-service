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
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import Address from '../general/address.model';
import Person from './person.model';

///////////////////////////////////////////////////////////////////////
//This is a junction table model representing many-to-many association
//between person and address.
///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'PersonAddresses',
    tableName       : 'person_addresses',
    paranoid        : true,
    freezeTableName : true,
})
export default class PersonAddresses extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => {
            return v4();
        },
        allowNull : false,
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => Person)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PersonId: string;

    @BelongsTo(() => Person)
    Person: Person;

    @IsUUID(4)
    @ForeignKey(() => Address)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    AddressId: string;

    @BelongsTo(() => Address)
    Address: Address;

    @Column({
        type      : DataType.STRING(32),
        allowNull : true
    })
    AddressType: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
