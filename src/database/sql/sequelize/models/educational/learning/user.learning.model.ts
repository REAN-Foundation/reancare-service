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
    Length,
    BelongsTo,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import {
    ProgressStatus, ProgressStatusList
} from '../../../../../../domain.types/miscellaneous/system.types';
import Course from './course.model';
import User from '../../users/user/user.model';
import CourseModule from './course.module.model';
import CourseContent from './course.content.model';
import LearningPath from './learning.path.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'UserLearning',
    tableName       : 'educational_user_learnings',
    paranoid        : true,
    freezeTableName : true,
})
export default class UserLearning extends Model {

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
    @ForeignKey(() => LearningPath)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    LearningPathId: string;

    @IsUUID(4)
    @ForeignKey(() => Course)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    CourseId: string;

    @IsUUID(4)
    @ForeignKey(() => CourseModule)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ModuleId: string;

    @IsUUID(4)
    @ForeignKey(() => CourseContent)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    ContentId: string;

    @BelongsTo(() => CourseContent)
    Content: CourseContent;

    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ActionId: string;

    @Length({ max: 32 })
    @Column({
        type         : DataType.STRING(32),
        allowNull    : false,
        values       : ProgressStatusList,
        defaultValue : ProgressStatus.Pending
    })
    ProgressStatus: string;

    @Column({
        type         : DataType.FLOAT,
        allowNull    : false,
        defaultValue : 0,
    })
    PercentageCompletion: number;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
