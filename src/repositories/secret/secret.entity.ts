import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
// import { Status } from '../status/status.entity';
import { Member } from '../member/member.entity';

@Entity()
export class Secret {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  secretName: string;

  @Column()
  secret: string;

  @Column({ default: '' })
  description: string;

  @Column()
  ttl: number;

  @Column({ type: 'timestamp', nullable: true })
  read: Date;

  @ManyToOne(type => Member, member => member.sentSecrets)
  @JoinColumn()
  sender: Member;

  @ManyToOne(type => Member, member => member.receivedSecrets)
  @JoinColumn()
  receiver: Member;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  modifiedAt: Date;

  @Column()
  createdBy: string;

  @Column({ nullable: true })
  modifiedBy: string;

}
