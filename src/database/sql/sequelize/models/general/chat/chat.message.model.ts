import {
    BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey,
    IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from '../../users/user/user.model';
import Conversation from './conversation.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'ChatMessage',
    tableName       : 'chat_messages',
    paranoid        : true,
    freezeTableName : true,
})
export default class ChatMessage extends Model {

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
    @ForeignKey(() => Conversation)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ConversationId : string;

    @BelongsTo(() =>  Conversation)
    Conversation:  Conversation;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    SenderId: string;

    @BelongsTo(() =>  User)
    Sender:  User;

    @Column({
        type      : DataType.TEXT,
        allowNull : false,
    })
    Message: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
