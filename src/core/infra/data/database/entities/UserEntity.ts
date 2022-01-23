import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { MessageEntity } from "./MessageEntity";


@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  uid!: string;

  @Column()
  name!: string;

  @Column()
  pass!: string;

  @Column({ name: "created_at" })
  createdAt!: Date;

  @Column({ name: "updated_at" })
  updatedAt!: Date;

  @OneToMany((_) => MessageEntity, message => message.user)
  messages?: MessageEntity[];

 

  /* @OneToMany((_) => ProfileDataEntity)
  @JoinColumn({ name: "uid_profile_data", referencedColumnName: "uid" })
  profile!: ProfileDataEntity;
 */
  @BeforeInsert()
  private beforeInsert(): void {
    this.uid = uuid();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  private beforeUpdate() {
    this.updatedAt = new Date();
  }
}
