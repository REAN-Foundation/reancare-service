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
import Goal from './goal.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'ActionPlan',
    tableName       : 'actions_plans',
    paranoid        : true,
    freezeTableName : true,
})
export default class ActionPlan extends Model {

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
        allowNull : false,
    })
    Provider: string;

    @Column({
        type      : DataType.STRING(64),
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

    @IsUUID(4)
    @ForeignKey(() => Goal)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    GoalId: string; // id of goal table

    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    Title: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Status: string;

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
