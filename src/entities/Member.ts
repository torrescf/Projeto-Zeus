// Entidade que representa um membro no banco de dados.
// Inclui informações pessoais, permissões e relacionamentos.

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IsEmail, Matches } from "class-validator";
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
    @IsEmail()
    @Matches(/^[\w-.]+@compjunior\.com\.br$/, {
        message: 'O e-mail deve pertencer ao domínio @compjunior.com.br',
    })
    email: string;

    @Column()
    password: string;

    @Column()
    role: string; // 'admin', 'member', 'intern'

    @Column({ default: false })
    isActive: boolean;

    @Column({ nullable: true })
    resetPasswordToken: string;

    @Column({ type: "timestamp", nullable: true })
    resetPasswordExpires: Date;

    @Column("simple-array", { nullable: true })
    skills: string[];

    @Column({ nullable: true })
    gender: "male" | "female" | "other";

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    photo: string;

    @OneToMany(() => Budget, (budget) => budget.createdBy)
    budgets: Budget[];

    @OneToMany(() => Project, (project) => project.leader)
    ledProjects: Project[];

    @OneToMany(() => Penalty, (penalty) => penalty.member)
    penalties: Penalty[];
}