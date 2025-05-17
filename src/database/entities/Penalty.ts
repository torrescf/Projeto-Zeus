// Entidade que representa penalidades aplicadas a membros.
// Inclui informações como tipo, motivo e data.

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Member } from "./Member";

@Entity('penalty')
export class Penalty {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string; // e.g., 'warning', 'suspension'

    @Column()
    reason: string;

    @Column({ type: "date" })
    date: Date;

    @ManyToOne(() => Member, (member) => member.penalties)
    member: Member;
}
