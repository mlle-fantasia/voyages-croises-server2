import { Entity, PrimaryGeneratedColumn,CreateDateColumn, Column, OneToMany } from "typeorm";
import { Articles } from "./Articles";

@Entity({ name: "files" })
export class Files {
	@PrimaryGeneratedColumn({ name: "fi_id" })
	id: number;

	@Column({ name: "fi_type", default:"" })
	type: string;

	@Column({ name: "fi_name", default:"" })
    name: string;

    @Column({ name: "fi_alt", default:"" })
	alt: string;
	
	@Column({ name: "fi_description", default:"" })
    description: string;
    
    @Column({ name: "fi_ext", default:"" })
    ext: string;
    
    @Column({ name: "fi_size", default:"" })
	size: string;
    
	@CreateDateColumn()
	createdAt: Date;

	@OneToMany((type) => Articles, (Articles) => Articles.files)
	articles: Articles[];
}
