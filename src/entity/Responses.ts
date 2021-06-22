import { Entity, PrimaryGeneratedColumn,CreateDateColumn, Column, ManyToOne } from "typeorm";
import { Comments } from "./Comments";

@Entity({ name: "responses" })
export class Responses {
	@PrimaryGeneratedColumn({ name: "res_id" })
	id: number;

	@Column({ name: "res_title" })
	title: string;

	@Column({ name: "res_contenu", type: "text" })
	contenu: string;

	@Column({ name: "res_visible" , default:false})
	visible: boolean;

	@Column({ name: "res_name" , default:"" })
    name: string;
    
    @Column({ name: "res_email" , default:"" })
    email: string;
    
	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne((type) => Comments, (Comments) => Comments.responses)
	comments: Comments;

	
}
