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
    // BelongsToMany,
    // BelongsTo,
    HasMany,
    BelongsTo,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import LearningCourses from './learning.courses.model';
import Course from './course.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'LearningPath',
    tableName       : 'educational_learning_paths',
    paranoid        : true,
    freezeTableName : true,
})
export default class LearningPath extends Model {

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

    // @IsUUID(4)
    // @ForeignKey(() => Course)
    // @Column({
    //     type      : DataType.UUID,
    //     allowNull : true,
    // })
    // CourseId: string;

    @HasMany(() => LearningCourses)
    LearningCourses:  LearningCourses[];

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

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    PreferenceWeight: number;

    @Column({
        type      : DataType.BOOLEAN,
        allowNull : true,
    })
    Enabled: boolean;

    // @BelongsToMany(() => Course, () =>LearningCourses )
    // Courses: Course[];

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
