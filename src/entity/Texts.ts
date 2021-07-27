import { Entity, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn, Column, ManyToOne } from "typeorm";
import { Pages } from "./Pages";

@Entity({ name: "texts" })
export class Texts {
	@PrimaryGeneratedColumn({ name: "te_id" })
	id: number;

	@Column({ name: "te_key", default:"" })
    key: string;

    @Column({type: "text",  name: "te_text", default:"" })
    text: string;
    
	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
    updateddAt: Date;

	@ManyToOne((type) => Pages, (Pages) => Pages.texts, { nullable: true })
	pages: Pages;
}
