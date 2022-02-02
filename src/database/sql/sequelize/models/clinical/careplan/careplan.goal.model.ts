import {
    Column, CreatedAt, DataType, DeletedAt, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'CareplanGoal',
    tableName       : 'careplan_goals',
    paranoid        : true,
    freezeTableName : true,
})
export default class CareplanGoal extends Model {

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
        type      : DataType.STRING(64),
        allowNull : false,
    })
    PatientUserId: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    EnrollmentId: string;

    @Column({
        type         : DataType.STRING(64),
        allowNull    : false,
        defaultValue : "AHA"
    })
    Provider: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    PlanName: string;
    
    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    PlanCode: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : false,
    })
    ProviderActionId: string; // activity code

    @Column({
        type      : DataType.INTEGER,
        allowNull : true,
    })
    GoalId: number;

    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    Name: string;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    Sequence: number;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    Categories: string;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    ScheduledAt: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
