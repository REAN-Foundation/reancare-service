import {
    BelongsTo,
    Column, CreatedAt, DataType, DeletedAt, ForeignKey, IsDate, IsUUID,
    Length, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from '../../users/user/user.model';
import LabRecordType from './lab.record.type.model';
import { LabRecordTypeList } from '../../../../../../domain.types/clinical/lab.record/lab.record/lab.record.types';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'LabRecord',
    tableName       : 'lab_records',
    paranoid        : true,
    freezeTableName : true,
})
export default class LabRecord extends Model {

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

    @BelongsTo(() => User)
    User: User;

    @Length({ min: 2, max: 128 })
    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    EhrId: string;

    @IsUUID(4)
    @ForeignKey(() => LabRecordType)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    TypeId: string;

    @BelongsTo(() => LabRecordType)
    LabRecordType: LabRecordType;

    @Column({
        type      : DataType.STRING(128),
        allowNull : false,
    })
    TypeName: string;

    @Column({
        type      : DataType.ENUM,
        allowNull : true,
        values    : LabRecordTypeList,
    })
    DisplayName: string;

    @Length({ min: 0, max: 6 })
    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    PrimaryValue: number;

    @Column({
        type      : DataType.FLOAT,
        allowNull : true,
    })
    SecondaryValue: number;

    @Length({ max: 16 })
    @Column({
        type      : DataType.STRING(16),
        allowNull : true,
    })
    Unit: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    ReportId: string;

    @Column({
        type      : DataType.STRING(128),
        allowNull : true,
    })
    OrderId: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true
    })
    RecordedAt: Date;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
