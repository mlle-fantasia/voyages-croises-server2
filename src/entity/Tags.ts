import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Articles } from "./Articles";


@Entity({ name: "tags" })
export class Tags {
	@PrimaryGeneratedColumn({ name: "tag_id" })
	id: number;

	@Column({ name: "tag_value", default:"" })
    value: string;

    @Column({ name: "tag_text", default:"" })
	text: string;

	@ManyToMany((type) => Articles, (Articles) => Articles.tags)
	@JoinTable()
	articles: Articles[];

}
