import {
    Column, CreatedAt, DataType, DeletedAt, IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'CareplanArtifact',
    tableName       : 'careplan_artifacts',
    paranoid        : true,
    freezeTableName : true,
})
export default class CareplanArtifact extends Model {

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
    UserId: string;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    EnrollmentId: number;

    @Column({
        type         : DataType.STRING(64),
        allowNull    : false,
        defaultValue : "AHA"
    })
    CareplanProvider: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : false,
    })
    CareplanName: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    Type: string;

    @Column({
        type      : DataType.STRING(64),
        allowNull : false,
    })
    ProviderActionId: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    Title: string;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    ScheduledAt: Date;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    CompletedAt: Date;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    Sequence: number;

    @Column({
        type      : DataType.INTEGER,
        allowNull : false,
    })
    Frequency: number;

    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    Status: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
