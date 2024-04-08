import { Entity, PrimaryGeneratedColumn, Column, Index, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @Index({ unique: true })
  email: string;

  @Column()
  name: string;
}
