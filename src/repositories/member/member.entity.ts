import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
// import { Status } from '../status/status.entity';
import { Secret } from '../secret/secret.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  publicKey: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({default: false})
  active: boolean;

//   @ManyToOne(type => Status)
//   @JoinColumn()
//   status: Status;

  @OneToMany(type => Secret, secret => secret.sender)
  @JoinColumn()
  sentSecrets: Secret[];

  @OneToMany(type => Secret, secret => secret.receiver)
  @JoinColumn()
  receivedSecrets: Secret[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  modifiedAt: Date;

  @Column({default: 'admin'})
  createdBy: string;

  @Column({ nullable: true })
  modifiedBy: string;

}
