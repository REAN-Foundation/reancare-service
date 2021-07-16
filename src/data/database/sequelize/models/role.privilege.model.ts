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
    IsInt,
    ForeignKey
    } from 'sequelize-typescript';

import { uuid } from 'uuidv4';
import Person from './person.model';
import Role from './role.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'RolePrivilege',
    tableName: 'role_privileges',
    paranoid: true,
    freezeTableName: true
})
export default class RolePrivilege extends Model {

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
        type: DataType.UUID,
        allowNull: false,
    })
    Privilege: string;

    @IsInt
    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    RoleId: number;

    @Column
    @CreatedAt
    CreateAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

};
