import {
    BelongsTo,
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsUUID,
    Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from '../user/user.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'HealthReportSetting',
    tableName       : 'patient_report_settings',
    paranoid        : true,
    freezeTableName : true,
})
export default class HealthReportSetting extends Model {

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
        unique    : true
    })
    PatientUserId: string;

    @BelongsTo(() => User)
    User: User;

    @Column({
        type      : DataType.TEXT,
        allowNull : true,
    })
    Preference: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
