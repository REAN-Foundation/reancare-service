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
} from 'sequelize-typescript';
import { HealthPriorityTypeList } from '../../../../../../domain.types/users/patient/health.priority.type/health.priority.types';

import { v4 } from 'uuid';
import User from '../../users/user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'HealthPriority',
    tableName       : 'health_priorities',
    paranoid        : true,
    freezeTableName : true,
})
export default class HealthPriority extends Model {

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
    PatientUserId: string;

    @Column({
        type      : DataType.STRING(32),
        allowNull : false,
    })
    Source: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : false,
    })
    Provider: string;

    @Column({
        type      : DataType.STRING(32),
        allowNull : false,
    })
    ProviderEnrollmentId: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : false,
    })
    ProviderCareplanCode: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : false,
    })
    ProviderCareplanName: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
        values    : HealthPriorityTypeList,
    })
    HealthPriorityType: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    StartedAt: Date;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    CompletedAt: Date;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Status: string;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    ScheduledEndDate: Date;

    @Column({
        type      : DataType.BOOLEAN,
        allowNull : true,
    })
    IsPrimary: boolean; // for making priority primary or secondary

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
