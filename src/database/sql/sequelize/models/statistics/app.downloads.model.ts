import { Column, CreatedAt, DataType, DeletedAt, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'AppDownloads',
    tableName       : 'statistics_app_downloads',
    paranoid        : true,
    freezeTableName : true,
})
export default class StatisticsAppDownloads extends Model {

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

  @Column({
      type      : DataType.STRING(24),
      allowNull : true,
  })
  AppName : string;

  @Column({
      type      : DataType.INTEGER,
      allowNull : true,
  })
  TotalDownloads  : number;

  @Column({
      type      : DataType.INTEGER,
      allowNull : true,
  })
  IOSDownloads  : number;

  @Column({
      type      : DataType.INTEGER,
      allowNull : false,
  })
  AndroidDownloads  : number;

  @Column
  @CreatedAt
  CreatedAt: Date;

  @UpdatedAt
  UpdatedAt: Date;

  @DeletedAt
  DeletedAt: Date;

}
