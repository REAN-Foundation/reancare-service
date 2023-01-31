import {
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUrl, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { ProgressStatus, ProgressStatusList } from '../../../../../../domain.types/miscellaneous/system.types';
import { UserTaskCategory, UserTaskCategoryList } from '../../../../../../domain.types/users/user.task/user.task.types';
import { v4 } from 'uuid';
import UserTask from '../../users/user/user.task.model';
import User from '../../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'CareplanActivity',
    tableName       : 'careplan_activities',
    paranoid        : true,
    freezeTableName : true,
})
export default class CareplanActivity extends Model {

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
        type      : DataType.STRING(64),
        allowNull : false,
    })
    PatientUserId: string;

    @IsUUID(4)
    @ForeignKey(() => UserTask)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    UserTaskId: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : false,
    })
    ProviderActionId: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    EnrollmentId: string;

    @Column({
        type         : DataType.STRING(64),
        allowNull    : false,
        defaultValue : "AHA"
    })
    Provider: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    PlanName: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    PlanCode: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    Type: string;

    @Column({
        type         : DataType.ENUM,
        values       : UserTaskCategoryList,
        defaultValue : UserTaskCategory.Custom,
        allowNull    : false,
    })
    Category: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    Title: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Description: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Transcription: string;

    @IsUrl
    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Url: string;

    @Column({
        type         : DataType.STRING(16),
        allowNull    : false,
        defaultValue : 'English'
    })
    Language: string;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    ScheduledAt: Date;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    StartedAt: Date;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    CompletedAt: Date;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    Sequence: number;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    Frequency: number;

    @Column({
        type         : DataType.ENUM,
        values       : ProgressStatusList,
        defaultValue : ProgressStatus.Pending,
        allowNull    : false,
    })
    Status: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    UserResponse: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    RawContent: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
