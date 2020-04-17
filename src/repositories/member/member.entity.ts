import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, JoinTable, ManyToMany, BeforeInsert } from 'typeorm';
// import { Status } from '../status/status.entity';
import { Secret } from '../secret/secret.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: "longtext" })
  publicKey: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  active: boolean;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  //   @ManyToOne(type => Status)
  //   @JoinColumn()
  //   status: Status;

  @OneToMany(type => Secret, secret => secret.creator)
  @JoinColumn()
  sentSecrets: Secret[];

  @OneToMany(type => Secret, secret => secret.receiver)
  @JoinColumn()
  receivedSecrets: Secret[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  modifiedAt: Date;

  @Column({ default: 'admin' })
  createdBy: string;

  @Column({ nullable: true })
  modifiedBy: string;

}
