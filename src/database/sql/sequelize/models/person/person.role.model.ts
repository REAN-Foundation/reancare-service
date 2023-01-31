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
    ForeignKey,
    Length
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import Person from './person.model';
import Role from '../role/role.model';

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

    @Length({ min: 1, max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : true
    })
    RoleName: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
