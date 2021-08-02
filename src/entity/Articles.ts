import { Entity, PrimaryGeneratedColumn, CreateDateColumn,UpdateDateColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Comments } from "./Comments";
import { Files } from "./Files";
import { Users } from "./Users";
import { Categories } from "./Categories";
import { Tags } from "./Tags";

@Entity({ name: "articles" })
export class Articles {
	@PrimaryGeneratedColumn({ name: "ar_id"})
	id: number;

	@Column({ name: "ar_order" , default:1000})
	order: number;

	@Column({ name: "ar_title", default:""})
	title: string;

	@Column({ name: "ar_resume" , default:""})
	resume: string;

	@Column({ name: "ar_date", type: 'date', })
	date: Date;

	@Column({ name: "ar_contenu", type: "text", default:"" })
	contenu: string;

	@Column({ name: "ar_miniature" , nullable: true, default:""})
	miniature: string;

	@Column({ name: "ar_image" , nullable: true, default:""})
	image: string;

	@Column({ name: "ar_image_alt" , default:"" })
	image_alt: string;

	@Column({ name: "ar_visible" , default:false})
	visible: boolean;

	@CreateDateColumn()
	createdAt: Date;
	
	@UpdateDateColumn()
    updatedAt: Date;

	@OneToMany((type) => Comments, (Comments) => Comments.articles, { nullable: true })
	comments: Comments[];

	@OneToMany((type) => Files, (Files) => Files.articles, { nullable: true })
	files: Files[];

	@ManyToOne((type) => Users, (Users) => Users.articles)
	user: Users;

	@ManyToOne((type) => Categories, (Categories) => Categories.articles, { nullable: true })
	category: Categories;

	@ManyToMany((type) => Tags, (Tags) => Tags.articles, { nullable: true })
	@JoinTable()
	tags: Tags[];
}

/* export async function CreateArticleEmpty() {
	return {
	order: 1000,
	title: "",
	resume:  "",
	date: new Date(),
	contenu:  "",
	miniature:  "",
	image:  "",
	visible:  false,
	comments: [],
	files: [],
	}
} */


