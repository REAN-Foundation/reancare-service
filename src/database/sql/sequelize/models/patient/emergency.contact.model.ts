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
    Length } from 'sequelize-typescript';

import { EmergencyContactRoleList, EmergencyContactRoles } from '../../../../../domain.types/patient/emergency.contact/emergency.contact.types';

import { v4 } from 'uuid';
import Address from '../address.model';
import Organization from '../organization.model';
import Person from '../person.model';
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
    
    @IsUUID(4)
    @ForeignKey(() => Person)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    ContactPersonId: string;

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

    @IsUUID(4)
    @ForeignKey(() => Organization)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    OrganizationId: string;

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
