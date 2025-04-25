// Entidade que registra o histórico de alterações em orçamentos.
// Inclui informações sobre ações realizadas e dados anteriores.

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Budget } from "./Budget";
import { Member } from "./Member";

@Entity()
export class BudgetHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    action: string; // 'CREATE', 'UPDATE', 'STATUS_CHANGE'

    @Column('jsonb', { nullable: true })
    previousData: Record<string, any>;

    @Column('jsonb')
    newData: Record<string, any>;

    @ManyToOne(() => Budget, (budget) => budget.history)
    budget: Budget;

    @ManyToOne(() => Member)
    changedBy: Member;

    @CreateDateColumn()
    createdAt: Date;
}
