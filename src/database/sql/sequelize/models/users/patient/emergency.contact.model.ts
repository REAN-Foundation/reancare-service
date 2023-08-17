import {
    BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey,IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import { EmergencyContactRoleList, EmergencyContactRoles } from '../../../../../../domain.types/users/patient/emergency.contact/emergency.contact.types';
import Address from '../../general/address.model';
import Organization from '../../general/organization/organization.model';
import Person from '../../person/person.model';
import User from '../user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'EmergencyContact',
    tableName       : 'patient_emergency_contacts',
    paranoid        : true,
    freezeTableName : true
})
export default class EmergencyContact extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => { return v4(); },
        allowNull    : false
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @BelongsTo(() => User)
    PatientUser: User;

    @IsUUID(4)
    @ForeignKey(() => Person)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    ContactPersonId: string;

    @BelongsTo(() => Person)
    ContactPerson: Person;

    @Column({
        type         : DataType.STRING(64),
        allowNull    : false,
        values       : EmergencyContactRoleList,
        defaultValue : EmergencyContactRoles.Doctor
    })
    ContactRelation: string;

    @IsUUID(4)
    @ForeignKey(() => Address)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    AddressId: string;

    @BelongsTo(() => Address)
    Address: Address;

    @IsUUID(4)
    @ForeignKey(() => Organization)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    OrganizationId: string;

    @BelongsTo(() => Organization)
    Organization: Organization;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    IsAvailableForEmergency: boolean;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    TimeOfAvailability: string;

    @Length({ max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Description: string;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    AdditionalPhoneNumbers: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
