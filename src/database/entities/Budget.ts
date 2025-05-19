// Entidade que representa um orçamento no banco de dados.
// Relaciona-se com membros, clientes e histórico de alterações.

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Project } from "./Project";

@Entity('budgets') // Corrigido para o nome correto da tabela
export class Budget {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project, { nullable: false })
    project: Project;

    @Column("decimal", { precision: 15, scale: 2 })
    amount: number;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updated_at: Date;
}
