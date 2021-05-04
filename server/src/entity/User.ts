import { Field, Int, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  email: string;

  // Dont have to show all fields
  @Column()
  password: string;

  @Field()
  @Column("int", { default: 0 })
  tokenVersion: number;
}
