import {
    Table,
    Column,
    Model,
    DataType,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    IsUUID,
    PrimaryKey,
    Length,
    BeforeCreate,
    BeforeUpdate,
    BeforeSave,
    IsDate,
    ForeignKey,
} from 'sequelize-typescript';

import { uuid } from 'uuidv4';
import * as bcrypt from 'bcryptjs';
import Person from './person.model';
import Role from './role.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps: true,
    modelName: 'User',
    tableName: 'users',
    paranoid: true,
    freezeTableName: true,
})
export default class User extends Model {
    @IsUUID(4)
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: () => {
            return uuid();
        },
        allowNull: false,
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => Person)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    PersonId: string;
    
    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    RoleId: number;

    @Length({ min: 1, max: 10 })
    @Column({
        type: DataType.STRING(10),
        allowNull: true,
    })
    UserName: string;

    @Length({ min: 6, max: 256 })
    @Column({
        type: DataType.STRING(256),
        allowNull: true,
    })
    Password: string;

    @IsDate
    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    LastLogin: Date;

    @Length({ min: 4, max: 16 })
    @Column({
        type: DataType.STRING(16),
        allowNull: false,
        defaultValue: '+05:30',
    })
    DefaultTimeZone: string;

    @Length({ min: 4, max: 16 })
    @Column({
        type: DataType.STRING(16),
        allowNull: false,
        defaultValue: '+05:30',
    })
    CurrentTimeZone: string;

    @BelongsTo(() => Person)
    Person: Person;

    @Column
    @CreatedAt
    CreateAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

    @BeforeCreate
    @BeforeSave
    @BeforeUpdate
    static encryptPassword(user) {
        if (user.Password != null) {
            user.Password = bcrypt.hashSync(user.Password, bcrypt.genSaltSync(8));
        }
    }


}
