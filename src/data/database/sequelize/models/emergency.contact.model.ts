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
    Length,
    IsInt} from 'sequelize-typescript';

import { uuid } from 'uuidv4';
import Address from './address.model';
import Organization from './organization.model';
import Person from './person.model';
import Role from './role.model';
import User from './user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'EmergencyContact',
    tableName: 'emergency_contacts',
    paranoid: true,
    freezeTableName: true
})
export default class EmergencyContact extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: () => { return uuid(); },
        allowNull: false
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => Person)
    @Column({
        type:  DataType.UUID,
        allowNull: false,
    })
    PersonId: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type:  DataType.UUID,
        allowNull: false,
    })
    PatientUserId: string;

    @IsUUID(4)
    @ForeignKey(() => Address)
    @Column({
        type:  DataType.UUID,
        allowNull: true,
    })
    AddressId: string;

    @IsUUID(4)
    @ForeignKey(() => Organization)
    @Column({
        type:  DataType.UUID,
        allowNull: true,
    })
    OrganizationId: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    IsAvailableForEmergency: boolean;

    @IsInt
    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    RoleId: string;
    
    @Length({ max: 32 })
    @Column({
        type: DataType.STRING(32),
        allowNull: true,
    })
    Relation: string;

    @Length({ max: 256 })
    @Column({
        type: DataType.STRING(256),
        allowNull: true,
    })
    TimeOfAvailability: string;

    @Length({ max: 256 })
    @Column({
        type: DataType.STRING(256),
        allowNull: true,
    })
    Description: string;

    @Length({ max: 64 })
    @Column({
        type: DataType.STRING(64),
        allowNull: true,
    })
    AdditionalPhoneNumbers: string;

    @Column
    @CreatedAt
    CreateAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

};
