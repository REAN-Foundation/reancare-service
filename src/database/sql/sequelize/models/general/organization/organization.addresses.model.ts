import {
    BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import Address from '../address.model';
import Organization from './organization.model';

///////////////////////////////////////////////////////////////////////
//This is a junction table model representing many-to-many association
//between organization and address.
///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'OrganizationAddresses',
    tableName       : 'organization_addresses',
    paranoid        : true,
    freezeTableName : true,
})
export default class OrganizationAddress extends Model {

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
    @ForeignKey(() => Organization)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    OrganizationId: string;

    @BelongsTo(() => Organization)
    Organization: Organization;

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
