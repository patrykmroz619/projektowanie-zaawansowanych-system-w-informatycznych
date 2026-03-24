import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToMany,
    ManyToOne,
    JoinTable,
} from "typeorm";
import { Comment } from "./Comment";
import { Tag } from "./Tag";
import { User } from "./User";

@Entity("articles")
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: "text" })
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.articles, { onDelete: "CASCADE" })
    author: User;

    @OneToMany(() => Comment, (comment) => comment.article)
    comments: Comment[];

    @ManyToMany(() => Tag, (tag) => tag.articles)
    @JoinTable({
        name: "article_tags",
        joinColumn: { name: "articleId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "tagId", referencedColumnName: "id" },
    })
    tags: Tag[];
}
