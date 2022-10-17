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
import Organization from './organization.model';
import Person from '../../person/person.model';

///////////////////////////////////////////////////////////////////////
//This is a junction table model representing many-to-many association
//between person and organizations
///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'OrganizationPersons',
    tableName       : 'organization_persons',
    paranoid        : true,
    freezeTableName : true,
})
export default class OrganizationPersons extends Model {

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
    @ForeignKey(() => Organization)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    OrganizationId: string;

    @BelongsTo(() => Organization)
    Organization: Organization;

    @Column({
        type      : DataType.STRING(32),
        allowNull : true
    })
    AssociationAs: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
