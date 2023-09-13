import { BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from '../users/user/user.model';
import Tenant from '../tenant/tenant.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'customQueries',
    tableName       : 'statistics_custom_queries',
    paranoid        : true,
    freezeTableName : true,
})
export default class StatisticsCustomQueries extends Model {

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
      allowNull : true,
  })
  UserId: string;

  @BelongsTo(() => User)
  User: User;

  @IsUUID(4)
  @ForeignKey(() => Tenant)
  @Column({
      type      : DataType.UUID,
      allowNull : true,
  })
  TenantId: string;

  @BelongsTo(() => Tenant)
  Tenant: Tenant;

  @Column({
      type      : DataType.STRING(128),
      allowNull : true,
  })
  Name : string;

  @Length({ max: 1024 })
  @Column({
      type      : DataType.STRING(1024),
      allowNull : true,
  })
  Query : string;

  @Length({ max: 1024 })
  @Column({
      type      : DataType.STRING(1024),
      allowNull : true,
  })
  Description : string;

  @Column({
      type      : DataType.TEXT,
      allowNull : true,
  })
  Tags: string;

  @Column
  @CreatedAt
  CreatedAt: Date;

  @UpdatedAt
  UpdatedAt: Date;

  @DeletedAt
  DeletedAt: Date;

}
