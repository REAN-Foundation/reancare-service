import {
    Column, DataType, IsDate, IsUUID,
    Model, PrimaryKey, Table } from 'sequelize-typescript';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : false,
    modelName       : 'PatientActivityTracker',
    tableName       : 'activity_trackers',
    paranoid        : true,
    freezeTableName : true,
})
export default class PatientActivityTracker extends Model {

    // id represent patient user id
    @IsUUID(4)
    @PrimaryKey
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    id: string;

    @IsDate
    @Column({
        type      : DataType.DATE,
        allowNull : true
    })
    RecentActivityDate: Date;

}
