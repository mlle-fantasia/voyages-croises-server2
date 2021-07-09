import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Articles } from "./Articles";


@Entity({ name: "categories" })
export class Categories {
	@PrimaryGeneratedColumn({ name: "ca_id" })
	id: number;

	@Column({ name: "ca_value", default:"" })
    value: string;

    @Column({ name: "ca_text", default:"" })
	text: string;

	@OneToMany((type) => Articles, (Articles) => Articles.category)
	articles: Articles[];

}
