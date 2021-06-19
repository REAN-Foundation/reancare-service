import { 
    Table, 
    Column, 
    Model,
    DataType,
    HasMany,
    HasOne,
    BelongsTo,
    BelongsToMany,
    CreatedAt, 
    UpdatedAt, 
    DeletedAt, 
    IsUUID,
    PrimaryKey,
    Length,
    BeforeCreate,
    IsEmail,
    IsDate,
    IsInt,
    ForeignKey
    } from 'sequelize-typescript';

import { uuid } from 'uuidv4';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'Patient',
    tableName: 'patients',
    paranoid: true,
    freezeTableName: true
})
export default class Patient extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: () => { return uuid(); },
        allowNull: false
    })
    id: string;

    @IsUUID(4)
    @Column({
        type:  DataType.UUID,
        allowNull: false,
    })
    UserId: string;

    @Length({ min: 4, max: 16})
    @Column({
        type: DataType.STRING(16),
        allowNull: false,
    })
    DisplayId: string;

    // @Length({ min: 4, max: 16})
    @Column({
        type: DataType.STRING(32),
        allowNull: true,
    })
    NationalHealthId: string;

    @IsUUID(4)
    @Column({
        type:  DataType.UUID,
        allowNull: true,
    })
    MedicalProfileId: string;

    @Column
    @CreatedAt
    CreateAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

};
