import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Budget } from "./Budget";
import { Project } from "./Project";
import { Penalty } from "./Penalty";

@Entity('members')
export class Member {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    role: string; // 'admin', 'member', 'intern'

    @Column({ default: false })
    isActive: boolean;

    @OneToMany(() => Budget, (budget) => budget.createdBy)
    budgets: Budget[];

    @OneToMany(() => Project, (project) => project.leader)
    ledProjects: Project[];

    @OneToMany(() => Penalty, (penalty) => penalty.member)
    penalties: Penalty[];
}