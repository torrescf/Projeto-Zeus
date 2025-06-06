// Entidade que representa um cliente no banco de dados.
// Relaciona-se com projetos e orçamentos.

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Project } from "./Project";

@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column()
    password: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ name: 'resetpasswordtoken', nullable: true })
    resetPasswordToken: string;

    @Column({ name: 'resetpasswordexpires', type: "timestamp", nullable: true })
    resetPasswordExpires: Date;

    @Column({ nullable: true })
    photoUrl: string;

    @Column({ type: 'date', nullable: true })
    data_nascimento: Date;

    @OneToMany(() => Project, (project) => project.client)
    projects: Project[];
}