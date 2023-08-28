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
    BelongsTo
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import UserGroup from './user.group.model';
import User from '../../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'UserGroupMember',
    tableName       : 'user_group_members',
    paranoid        : true,
    freezeTableName : true
})
export default class UserGroupMember extends Model {

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
    UserId: string;

    @BelongsTo(() =>  User)
    User:  User;

    @IsUUID(4)
    @ForeignKey(() => UserGroup)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    GroupId: string;

    @BelongsTo(() =>  UserGroup)
    Group:  UserGroup;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    IsAdmin: boolean;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
