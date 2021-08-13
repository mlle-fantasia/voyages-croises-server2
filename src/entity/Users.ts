import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Articles } from "./Articles";

@Entity({ name: "users" })
export class Users {
	@PrimaryGeneratedColumn({ name: "us_id" })
	id: number;

	@Column({ name: "us_type" , default:""})
	type: string;

	@Column({ name: "us_email" , default:""})
	email: string;

	@Column({ name: "us_password", type: "text", default:""})
	password: string;

	@Column({ name: "us_firstname" , default:""})
	firstname: string;

	@Column({ name: "us_birthday", type: 'date' })
	birthday: Date;

	@CreateDateColumn()
	createdAt: Date;
	
	@UpdateDateColumn()
	updateddAt: Date;
	
	@OneToMany((type) => Articles, (Articles) => Articles.user, { nullable: true })
	articles: Articles[];
}
