import {
    Column,
    CreatedAt,
    DataType,
    IsUrl,
    IsUUID,
    Length,
    Model,
    PrimaryKey,
    Table } from 'sequelize-typescript';
import { ProgressStatus } from '../../../domain.types/miscellaneous/system.types';
import { ProgressStatusList } from '../../../domain.types/miscellaneous/system.types';
import { UserTaskCategory } from '../../../domain.types/users/user.task/user.task.types';
import { UserTaskCategoryList } from '../../../domain.types/users/user.task/user.task.types';

import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'EHRCareplanActivityData',
    tableName       : 'ehr_careplan_activities_data',
    paranoid        : true,
    freezeTableName : true,
})
export default class EHRCareplanActivityData extends Model {

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
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PatientUserId: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    AppName: string;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    RecordId: string;

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
        allowNull : true,
    })
    PlanName: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
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
    ScheduledDay: number;

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

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    AdditionalInfo: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    HealthSystem : string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    AssociatedHospital : string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    RecordDate : Date;

    @Column
    @CreatedAt
    TimeStamp: Date;

}
