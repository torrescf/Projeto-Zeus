import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Member } from "./Member";

@Entity()
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
