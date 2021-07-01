import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Categories } from "./Categories";
import { Articles } from "./Articles";


@Entity({ name: "subcategories" })
export class SubCategories {
	@PrimaryGeneratedColumn({ name: "sca_id" })
	id: number;

	@Column({ name: "sca_value", default:"" })
    value: string;

    @Column({ name: "sca_text", default:"" })
	text: string;
	
	@ManyToOne((type) => Categories, (Categories) => Categories.subcategories)
	categories: Categories;

	@OneToMany((type) => Articles, (Articles) => Articles.subcategory)
	articles: Articles[];
    
}
