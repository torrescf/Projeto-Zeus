// Entidade que representa um projeto no banco de dados.
// Relaciona-se com membros e clientes.

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
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
    // Corrija o nome da coluna para coincidir com o banco de dados
    // Isso garante que o TypeORM use a coluna client_id
    client: Client;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}