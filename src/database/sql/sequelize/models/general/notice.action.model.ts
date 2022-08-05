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
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import User from '../user/user.model';
import Notice from './notice.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'NoticeAction',
    tableName       : 'notice_actions',
    paranoid        : true,
    freezeTableName : true,
})
export default class NoticeAction extends Model {

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
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    UserId: string;

    @IsUUID(4)
    @ForeignKey(() => Notice)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    NoticeId: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Action: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    ActionTakenAt: Date;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    ActionContent: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
