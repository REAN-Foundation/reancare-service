import { BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey,
    IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from '../../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Conversation',
    tableName       : 'chat_conversations',
    paranoid        : true,
    freezeTableName : true,
})
export default class Conversation extends Model {

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

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Topic: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    IsGroupConversation : boolean;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    Marked : boolean;

    @ForeignKey(() => User)
    @Column({
        type : DataType.UUID,

        allowNull : false,
    })
    InitiatingUserId: string;

    @BelongsTo(() => User, 'InitiatingUserId')
    InitiatingUser: User;

    @ForeignKey(() => User)
    @Column({
        type : DataType.UUID,

        allowNull : false,
    })
    OtherUserId: string;

    @BelongsTo(() => User, 'OtherUserId')
    OtherUser: User;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    LastMessageTimestamp: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
