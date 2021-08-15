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

import { v4 } from 'uuid';
import Person from './person.model';
import Role from './role.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'PersonRole',
    tableName       : 'person_roles',
    paranoid        : true,
    freezeTableName : true
})
export default class PersonRole extends Model {

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
        allowNull : false,
    })
    PersonId: string;

    @IsInt
    @ForeignKey(() => Role)
    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    RoleId: number;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
