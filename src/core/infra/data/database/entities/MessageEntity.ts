import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserEntity } from "./UserEntity";
import { v4 as uuid } from "uuid";

@Entity({ name: "messages" })
export class MessageEntity extends BaseEntity {
	@PrimaryColumn()
	uid: string;

	@Column()
	title!: string;

	@Column()
  	description!: string;

	@Column({ name: "user_uid" })
	userUID!: string;

	@Column({ name: "created_at" })
	createdAt?: Date;

	@Column({ name: "updated_at" })
	updatedAt?: Date;

	@ManyToOne(() => UserEntity, (user) => user.messages)
	@JoinColumn({ name: "user_uid" })
	user: UserEntity;


  constructor(
		title: string,
		description: string,
		user: UserEntity,
		uid: string,
		createdAt?: Date,
		updatedAt?: Date
	) {
		super();
		this.title = title;
		this.description = description;
		this.user = user;
		this.uid = uid;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

    @BeforeInsert()
    private beforeInsert() {
      this.uid = uuid();
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  
    @BeforeUpdate()
    private beforeUpdate() {
      this.updatedAt = new Date();
    }
  }

