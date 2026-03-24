import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from "typeorm";
import { Comment } from "./Comment";
import { Article } from "./Article";

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    username: string;

    @Column({ select: false })
    password: string;

    @Column({ type: "varchar", default: UserRole.USER })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => Article, (article) => article.author)
    articles: Article[];
}
