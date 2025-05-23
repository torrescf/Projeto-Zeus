// Entidade que representa um projeto no banco de dados.
// Relaciona-se com membros e clientes.

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Client } from "./Client";

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => Client, { nullable: false })
    @JoinColumn({ name: "client_id" }) // Garante que a coluna será client_id no banco
    client: Client;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;

    @Column({ default: 'em analise' })
    status: string;

    @Column({ type: "numeric", nullable: true })
    amount: number;
}