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

} from 'sequelize-typescript';

import { v4 } from 'uuid';
import {
    ProgressStatus, ProgressStatusList
} from '../../../../../../domain.types/miscellaneous/system.types';
import LearningPath from './learning.path.model';
import User from '../../user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'UserCourse',
    tableName       : 'educational_user_learning_paths',
    paranoid        : true,
    freezeTableName : true,
})
export default class UserCourseEnrollment extends Model {

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
    @ForeignKey(() => LearningPath)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    LearningPathId: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    UserId: string;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    EnrollmentDate: Date;

    @Length({ max: 32 })
    @Column({
        type         : DataType.STRING(32),
        allowNull    : false,
        values       : ProgressStatusList,
        defaultValue : ProgressStatus.Pending
    })
    ProgressStatus: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
