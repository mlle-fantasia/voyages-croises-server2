import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Articles } from "./Articles";

@Entity({ name: "users" })
export class Users {
	@PrimaryGeneratedColumn({ name: "us_id" })
	id: number;

	@Column({ name: "us_email" , default:""})
	email: string;

	@Column({ name: "us_password", type: "text" })
	password: string;

	@Column({ name: "us_firstname" , default:""})
	firstname: string;

	@CreateDateColumn()
	createdAt: Date;
	
	@UpdateDateColumn()
	updateddAt: Date;
	
	@OneToMany((type) => Articles, (Articles) => Articles.user)
	articles: Articles[];
}
