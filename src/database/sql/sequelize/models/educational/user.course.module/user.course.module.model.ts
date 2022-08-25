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
import Course from '../course/course.model';
import User from '../../user/user.model';
import UserCourseEnrollment from '../user.course.enrollment/user.course.enrollment.model';
import CourseModule from '../course.module/course.module.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'UserCourseModule',
    tableName       : 'user_course_modules',
    paranoid        : true,
    freezeTableName : true,
})
export default class UserCourseModule extends Model {

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
    @ForeignKey(() => Course)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    CourseId: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    UserId: string;

    @IsUUID(4)
    @ForeignKey(() => UserCourseEnrollment)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    CourseEnrollmentId: string;

    @IsUUID(4)
    @ForeignKey(() => CourseModule)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    ModuleId: string;

    @Column({
        type         : DataType.UUID,
        defaultValue : () => {
            return v4();
        },
        allowNull : true,
    })
    ParentNodeId: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    StartDate: Date;
   
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    EndDate: Date;

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
