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
    BelongsTo,
} from 'sequelize-typescript';

import { v4 } from 'uuid';
import Course from './course.model';
import LearningPath from './learning.path.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'LearningCourses',
    tableName       : 'educational_learning_path_courses',
    paranoid        : true,
    freezeTableName : true,
})
export default class LearningPathCourses extends Model {

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

  @BelongsTo(() => Course)
  Course: Course;
  
  @IsUUID(4)
  @ForeignKey(() => LearningPath)
  @Column({
      type      : DataType.UUID,
      allowNull : true,
  })
  LearningPathId: string;

  @BelongsTo(() => LearningPath)
  LearningPath: LearningPath;

  @Column
  @CreatedAt
  CreatedAt: Date;

  @UpdatedAt
  UpdatedAt: Date;

  @DeletedAt
  DeletedAt: Date;

}
