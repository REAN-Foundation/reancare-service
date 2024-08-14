import { Column, CreatedAt, DataType, DeletedAt, IsUUID, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { v4 } from "uuid";

@Table({
    timestamps      : true,
    modelName       : 'FollowUpCancellation',
    tableName       : 'followup_cancellations',
    paranoid        : true,
    freezeTableName : true
})
export default class FollowUpCancellation extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => {
            return v4();
        },
        allowNull : false
    })
    id: string;

    @IsUUID(4)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    TenantId: string;

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    TenantName: string;

    @Column({
        type      : DataType.DATE,
        allowNull : false,
    })
    CancelDate: Date;
    
    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}
