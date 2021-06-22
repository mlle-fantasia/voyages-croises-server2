import { Entity, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn, Column, OneToMany } from "typeorm";
import { Texts } from "./Texts";

@Entity({ name: "pages" })
export class Pages {
	@PrimaryGeneratedColumn({ name: "pa_id" })
	id: number;

	@Column({ name: "pa_name", default:"" })
    name: string;

    @Column({ name: "pa_key", default:"" })
    key: string;
    
    @Column({ name: "pa_inmenufooter", default:false })
    in_menufooter: boolean;
    
    @Column({ name: "pa_inmenuprincipal", default:false })
	in_menuprincipal: boolean;
    
	@CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updateddAt: Date;

	@OneToMany((type) => Texts, (Texts) => Texts.pages)
	texts: Texts[];
}
