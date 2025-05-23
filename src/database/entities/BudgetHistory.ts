// Entidade que registra o histórico de alterações em orçamentos.
// Inclui informações sobre ações realizadas e dados anteriores.

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Member } from "./Member";
@Entity('budget_history')
export class BudgetHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    action: string; // 'CREATE', 'UPDATE', 'STATUS_CHANGE'

    @Column('jsonb', { nullable: true })
    previousData: Record<string, any>;

    @Column('jsonb')
    newData: Record<string, any>;

    @ManyToOne(() => Member)
    changedBy: Member;

    @CreateDateColumn()
    createdAt: Date;
}
