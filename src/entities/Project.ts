// Entidade que representa um projeto no banco de dados.
// Relaciona-se com membros e clientes.

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Member } from "./Member";
import { Client } from "./Client"; // Corrigido o caminho relativo

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    status: string; // 'planning', 'in_progress', 'completed'

    @Column()
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date;

    @ManyToOne(() => Member, member => member.ledProjects)
    leader: Member;

    @ManyToMany(() => Member)
    @JoinTable()
    team: Member[];

    @ManyToOne(() => Client, (client: Client) => client.projects) // Adicionado tipo explícito
    client: Client;
}