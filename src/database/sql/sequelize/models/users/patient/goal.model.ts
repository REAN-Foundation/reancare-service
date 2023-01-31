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

import { v4 } from 'uuid';
import User from '../../users/user/user.model';
import HealthPriority from './health.priority.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'Goal',
    tableName       : 'patient_goals',
    paranoid        : true,
    freezeTableName : true,
})
export default class Goal extends Model {

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
        type      : DataType.STRING(64),
        allowNull : true,
    })
    ProviderEnrollmentId: string;

    @Column({
        type      : DataType.STRING,
        allowNull : true,
    })
    Provider: string;

    @Column({
        type      : DataType.STRING(32),
        allowNull : true,
    })
    ProviderCareplanName: string;

    @Column({
        type      : DataType.STRING(32),
        allowNull : true,
    })
    ProviderCareplanCode: string;

    @IsUUID(4)
    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    ProviderGoalCode: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : false,
    })
    Title: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : true,
    })
    Sequence: string;

    @IsUUID(4)
    @ForeignKey(() => HealthPriority)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    HealthPriorityId: string;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : true,
        defaultValue : false ,
    })
    GoalAchieved: boolean;

    @Column({
        type         : DataType.BOOLEAN,
        allowNull    : true,
        defaultValue : false ,
    })
    GoalAbandoned: boolean;

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
        type      : DataType.DATE,
        allowNull : true,
    })
    ScheduledEndDate: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
