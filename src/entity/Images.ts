import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Articles } from "./Articles";
import { Pages } from "./Pages";
import { Texts } from "./Texts";


@Entity({ name: "images" })
export class Images {
	@PrimaryGeneratedColumn({ name: "im_id" })
	id: number;

	@Column({ name: "im_name", default:"" })
    name: string;

    @Column({ name: "im_alt", default:"" })
	alt: string;

	@Column({ name: "im_ext", default:"" })
	ext: string;

	@Column({ name: "im_type", default:"" })
	type: string;

	@Column({ name: "im_size", default:"" })
	size: string;

	/* @OneToOne((type) => Articles, (Article) => Article.image)
	article: Articles;

	@OneToOne((type) => Pages, (page) => page.image)
	page: Pages;

	@OneToOne((type) => Texts, (Text) => Text.image)
	text: Texts; */

}
