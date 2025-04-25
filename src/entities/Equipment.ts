// Entidade que representa equipamentos no sistema.
// Inclui informações como nome, descrição e datas de criação/atualização.

export class Equipment {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, name: string, description: string, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}