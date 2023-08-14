import { float } from "aws-sdk/clients/cloudfront";
import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'vital_facts' })
export class VitalFact {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: false })
    ContextReferenceId: string;

    @Column({ type: 'uuid', nullable: true })
    RecordId: string;

    @Column({ type: 'varchar', length: 256, nullable: true })
    VitalName: string;

    @Column({ nullable: true, default: null })
    VitalPrimaryValue: float;

    @Column({ nullable: true, default: null })
    VitalSecondaryValue: float;

    @Column({ type: 'varchar', length: 16, nullable: true })
    Unit: string;

    @Column({ nullable: true })
    RecordDate: Date;

    @Column({ nullable: true })
    RecordDateStr: string;

    @Column({
        type     : 'varchar',
        length   : 16,
        nullable : false,
        default  : '+05:30',
    })
    RecordTimeZone: string;

}
