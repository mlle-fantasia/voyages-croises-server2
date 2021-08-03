import { Entity, PrimaryGeneratedColumn,CreateDateColumn, Column, ManyToOne , OneToMany} from "typeorm";
import { Articles } from "./Articles";
import { CommentsResponses } from "./CommentsResponses";

@Entity({ name: "comments" })
export class Comments {
	@PrimaryGeneratedColumn({ name: "com_id" })
	id: number;

	@Column({ name: "com_title" })
	title: string;

	@Column({ name: "com_contenu", type: "text" })
	contenu: string;

	@Column({ name: "com_visible" , default:false})
	visible: boolean;

	@Column({ name: "com_name" , default:"" })
    name: string;
    
    @Column({ name: "com_email" , default:"" })
	email: string;

	@Column({ name: "com_image" , default:1 })
	image: string;
	
	@Column({ name: "com_image_alt" , default:"" })
	image_alt: string;

	@Column({ name: "com_siteweb" , default:"" })
	siteweb: string;
    
	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne((type) => Articles, (Articles) => Articles.comments)
	articles: Articles;

	@OneToMany((type) => CommentsResponses, (Responses) => Responses.comment, { nullable: true })
	responses: CommentsResponses[];
}
