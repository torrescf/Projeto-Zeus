// Entidade que representa um membro no banco de dados.
// Inclui informações pessoais, permissões e relacionamentos.

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { IsEmail, Matches } from "class-validator";
import { Penalty } from "./Penalty";
import { Project } from "./Project";

@Entity('members')
export class Member {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'nomeCompleto', default: () => `'Guest_' || substring(md5(random()::text), 1, 8)` })
    nomeCompleto: string;

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

    @Column("text", { array: true, nullable: true })
    skills: string[];

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    photo: string;

    @Column({ name: 'resetPasswordToken', nullable: true })
    resetPasswordToken: string;

    @Column({ type: "timestamp", name: 'resetPasswordExpires', nullable: true })
    resetPasswordExpires: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => Penalty, (penalty) => penalty.member)
    penalties: Penalty[];

    @OneToMany(() => Project, (project) => project.client)
    projects: Project[];

    @Column({ type: 'date', nullable: true })
    data_nascimento: Date;
}