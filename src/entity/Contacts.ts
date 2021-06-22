import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, } from "typeorm";


@Entity({ name: "contacts" })
export class Contacts {
	@PrimaryGeneratedColumn({ name: "co_id" })
	id: number;

	@Column({ name: "co_email" , default:""})
	email: string;

	@Column({ name: "co_name" , default:""})
	name: string;

	@Column({ name: "co_firstname" , default:""})
	firstname: string;

	@CreateDateColumn()
	createdAt: Date;

}
