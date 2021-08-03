import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Comments } from "./Comments";

@Entity({ name: "comments_responses" })
export class CommentsResponses {
	@PrimaryGeneratedColumn({ name: "comres_id" })
	id: number;

	@Column({ name: "comres_contenu", type: "text" })
	contenu: string;

	@Column({ name: "comres_visible" , default:false})
	visible: boolean;

	@Column({ name: "comres_name" , default:"" })
    name: string;
    
    @Column({ name: "comres_email" , default:"" })
	email: string;

	@Column({ name: "comres_image" , default:1 })
	image: string;
	
	@Column({ name: "comres_image_alt" , default:"" })
	image_alt: string;
    
	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne((type) => Comments, (Comments) => Comments.responses)
	comment: Comments;
}
