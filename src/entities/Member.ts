import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
//import { Penalty } from "./Penalty";
import { Project } from "../../src/entities/Project";
@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    role: string; // 'admin', 'member', 'intern'

    @Column({ default: false })
    isActive: boolean;

    /*@OneToMany(() => Penalty, penalty => penalty.member)
    penalties: Penalty[];
*/
    @OneToMany(() => Project, project => project.leader)
    ledProjects: Project[];
}