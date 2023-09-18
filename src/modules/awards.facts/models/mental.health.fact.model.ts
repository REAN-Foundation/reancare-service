import "reflect-metadata";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'mental_health_facts' })
export class MentalHealthFact {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'uuid', nullable: false })
    ContextReferenceId : string;

    @Column({ type: 'uuid', nullable: true })
    RecordId : string;

    @Column({ type: 'varchar', length: 256, nullable: true })
    Name : string;

    @Column({ nullable: true })
    Duration: number;

    @Column({ type: 'varchar', length: 128, nullable: true })
    Unit : string;

    @Column({ nullable: true })
    RecordDate : Date;

    @Column({ nullable: true })
    RecordDateStr : string;

    @Column({
        type     : 'varchar',
        length   : 16,
        nullable : false,
        default  : '+05:30',
    })
    RecordTimeZone: string;

}
