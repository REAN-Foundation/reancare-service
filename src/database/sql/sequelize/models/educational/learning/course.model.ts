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
    HasMany,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import CourseModule from './course.module.model';
import LearningPathCourses from './learning.path.course.model';
import Tenant from '../../tenant/tenant.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Course',
    tableName       : 'educational_courses',
    paranoid        : true,
    freezeTableName : true,
})
export default class Course extends Model {

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
    @ForeignKey(() => Tenant)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    TenantId: string;

    @BelongsTo(() =>  Tenant)
    Tenant:  Tenant;
    
    @Column({
        type      : DataType.STRING(256),
        allowNull : false,
    })
    Name: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Description: string;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    ImageUrl: string;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    DurationInDays: number;

    @HasMany(() => LearningPathCourses)
    LearningPathCourses: LearningPathCourses[];

    @HasMany(() => CourseModule)
    CourseModules: CourseModule[];

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
