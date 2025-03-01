import {
    BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey,
    HasOne,
    IsDate, IsUUID, Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import Person from '../../person/person.model';
import Role from '../../role/role.model';
import Tenant from '../../tenant/tenant.model';
import HealthReportSetting from '../patient/health.report.setting.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'User',
    tableName       : 'users',
    paranoid        : true,
    freezeTableName : true,
})
export default class User extends Model {

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
    @ForeignKey(() => Person)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    PersonId: string;

    @BelongsTo(() => Person)
    Person: Person;

    @ForeignKey(() => Role)
    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    RoleId: number;

    @BelongsTo(() => Role)
    Role: Role;

    @IsUUID(4)
    @ForeignKey(() => Tenant)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    TenantId: string;

    @BelongsTo(() =>  Tenant)
    Tenant:  Tenant;

    @Length({ min: 1, max: 32 })
    @Column({
        type      : DataType.STRING(32),
        allowNull : true,
        unique    : true
    })
    UserName: string;

    @Length({ min: 6, max: 256 })
    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    Password: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    LastLogin: Date;

    @Length({ min: 4, max: 16 })
    @Column({
        type         : DataType.STRING(16),
        allowNull    : false,
        defaultValue : '+05:30',
    })
    DefaultTimeZone: string;

    @Length({ min: 4, max: 16 })
    @Column({
        type         : DataType.STRING(16),
        allowNull    : false,
        defaultValue : '+05:30',
    })
    CurrentTimeZone: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : false,
        defaultValue : false,
    })
    IsTestUser: boolean;

    @Length({ max: 8 })
    @Column({
        type         : DataType.STRING(8),
        allowNull    : false,
        defaultValue : 'en-US'
    })
    PreferredLanguage: string;
    
    @HasOne(() => HealthReportSetting)
    HealthReportSetting: HealthReportSetting;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
