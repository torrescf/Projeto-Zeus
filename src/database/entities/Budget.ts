// Entidade que representa um orçamento no banco de dados.
// Relaciona-se com membros, clientes e histórico de alterações.

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Member } from "./Member";
import { Client } from "./Client";
import { BudgetHistory } from "./BudgetHistory";

@Entity()
export class Budget {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    numeroOrcamento: string;

    @Column()
    descricaoProjeto: string;

    @Column()
    cliente: string;

    @Column()
    membroResponsavelId: number;

    @Column("decimal", { precision: 10, scale: 2 })
    valorEstimado: number;

    @Column("decimal", { precision: 10, scale: 2 })
    custosPrevistos: number;

    @Column()
    dataCriacao: Date;

    @Column()
    status: string;

    @OneToMany(() => BudgetHistory, (history) => history.budget, { cascade: true })
    historicoAlteracoes: BudgetHistory[];
}
