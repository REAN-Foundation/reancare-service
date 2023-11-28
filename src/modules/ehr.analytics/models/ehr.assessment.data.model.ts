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
    modelName       : 'EHRAssessmentData',
    tableName       : 'ehr_assessments_data',
    paranoid        : true,
    freezeTableName : true,
})
export default class EHRAssessmentData extends Model {

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
    AssessmentId: string;

    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    TemplateId: string;

    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    NodeId: string;

    @Column({
        type         : DataType.TEXT,
        allowNull    : true,
    })
    Title: string;

    @Column({
        type         : DataType.TEXT,
        allowNull    : true,
    })
    Question: string;

    @Column({
        type         : DataType.TEXT,
        allowNull    : true,
    })
    SubQuestion: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    QuestionType: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    AnswerOptions: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    AnswerValue: string;

    @Column({
        type         : DataType.TEXT,
        allowNull    : true,
    })
    AnswerReceived: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    AnsweredOn: Date;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Status: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Score: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    AdditionalInfo: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    StartedAt: Date;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    FinishedAt: Date;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    RecordDate: Date;

    @Column
    @CreatedAt
    TimeStamp: Date;

}
