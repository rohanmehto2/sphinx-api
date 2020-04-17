import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  value: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
