// Entidade que representa um cliente no banco de dados.
// Relaciona-se com projetos e orçamentos.

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Project } from "./Project";
import { Budget } from "./Budget";

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

    @OneToMany(() => Project, (project) => project.client)
    projects: Project[];

    @OneToMany(() => Budget, (budget) => budget.cliente)
    budgets: Budget[];
}