import {
    BelongsTo,
    Column, CreatedAt, DataType, DeletedAt,
    ForeignKey,
    IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from '../../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'ThirdpartyApiCredentails',
    tableName       : 'thirdparty_api_credentials',
    paranoid        : true,
    freezeTableName : true
})
export default class ThirdpartyApiCredentailsx extends Model {

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
        allowNull : true,
    })
    UserId: string;

    @BelongsTo(() => User)
    User: User;

    @Length({ max: 64 })
    @Column({
        type      : DataType.STRING(64),
        allowNull : false,
    })
    Provider: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : true,
    })
    BaseUrl: string;

    @Length({ max: 512 })
    @Column({
        type      : DataType.STRING(512),
        allowNull : true,
    })
    SecondaryUrl: string;

    @Length({ max: 2048 })
    @Column({
        type      : DataType.STRING(2048),
        allowNull : true
    })
    Token: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    ValidTill: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
