import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Member } from "./Member";

// Entidade que representa equipamentos no sistema.
// Inclui informações como nome, descrição e datas de criação/atualização.

@Entity()
export class Equipment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @ManyToOne(() => Member, { nullable: true })
    checkedOutBy: Member | null;
}