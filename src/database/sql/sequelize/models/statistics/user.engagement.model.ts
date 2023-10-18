import {
    BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from '../users/user/user.model';
import {
    UserEngagementCategoryList,
    UserEngagementCategories
} from '../../../../../domain.types/statistics/user.engagement.types';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'UserEngagement',
    tableName       : 'user_engagements',
    paranoid        : true,
    freezeTableName : true,
})
export default class UserEngagement extends Model {

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
    PatientUserId: string;

    @BelongsTo(() => User)
    User: User;

    @Column({
        type         : DataType.ENUM,
        values       : UserEngagementCategoryList,
        defaultValue : UserEngagementCategories.Overall,
        allowNull    : false,
    })
    Category: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    RecordName: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    AdditionalInfo: string;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    RecordId: string;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    RecordTimestamp: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
