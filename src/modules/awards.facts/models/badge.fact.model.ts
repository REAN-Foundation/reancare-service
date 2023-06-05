import "reflect-metadata";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

////////////////////////////////////////////////////////////////////////

@Entity({ name: 'badge_facts' })
export class BadgeFact {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column({ type: 'uuid', nullable: false })
    ContextReferenceId : string;

    @Column({ type: 'uuid', nullable: true })
    BadgeId : string;

    @Column({ type: 'uuid', nullable: true })
    BadgeTypeId : string;

    @Column({ type: 'simple-json', nullable: true })
    Metadata : string;

    @CreateDateColumn()
    CreatedAt : Date;

    @UpdateDateColumn()
    UpdatedAt : Date;

    @DeleteDateColumn()
    DeletedAt : Date;

}
