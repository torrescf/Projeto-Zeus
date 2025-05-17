// Entidade que representa um projeto no banco de dados.
// Relaciona-se com membros e clientes.

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Member } from "./Member";
import { Client } from "./Client"; // Corrigido o caminho relativo

@Entity('project')
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    status: string; // 'planning', 'in_progress', 'completed'

    @Column({ type: "timestamp", nullable: true })
    startDate: Date;

    @Column({ type: "timestamp", nullable: true })
    endDate: Date;

    @ManyToOne(() => Member, member => member.ledProjects, { nullable: true })
    membroResponsavel: Member;

    @ManyToMany(() => Member, { nullable: true })
    @JoinTable()
    membrosEquipe: Member[];

    @ManyToOne(() => Client, (client: Client) => client.projects, { nullable: true })
    client: Client;
}