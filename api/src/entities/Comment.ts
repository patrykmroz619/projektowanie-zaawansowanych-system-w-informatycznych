import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Article } from "./Article";

@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text" })
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
    user: User;

    @ManyToOne(() => Article, (article) => article.comments, { onDelete: "CASCADE" })
    article: Article;
}
