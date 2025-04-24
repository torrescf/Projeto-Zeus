import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Member } from "./Member";
import { Client } from "./Client";
import { BudgetHistory } from "./BudgetHistory";

@Entity('budgets')
export class Budget {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ default: 'pending' })
    status: 'pending' | 'approved' | 'rejected';

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(() => Member, (member) => member.budgets)
    createdBy: Member;

    @ManyToOne(() => Client, (client) => client.budgets)
    client: Client;

    @OneToMany(() => BudgetHistory, (history) => history.budget)
    history: BudgetHistory[];
}