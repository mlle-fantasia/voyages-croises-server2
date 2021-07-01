import { Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn, Column, OneToMany } from "typeorm";
import { Pages } from "./Pages";

@Entity({ name: "texts" })
export class Texts {
	@PrimaryGeneratedColumn({ name: "te_id" })
	id: number;

	@Column({ name: "te_key", default:"" })
    key: string;

    @Column({ name: "te_text", default:"" })
    text: string;
    
	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
    updateddAt: Date;

	@OneToMany((type) => Pages, (Pages) => Pages.texts, { nullable: true })
	pages: Pages;
}
