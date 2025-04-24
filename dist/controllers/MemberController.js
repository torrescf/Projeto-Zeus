"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberController = void 0;
const data_source_1 = require("../config/data-source");
const Member_1 = require("../entities/Member");
class MemberController {
    memberRepository = data_source_1.AppDataSource.getRepository(Member_1.Member);
    async create(req, res) {
        try {
            const member = this.memberRepository.create(req.body);
            await this.memberRepository.save(member);
            res.status(201).json(member);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Erro desconhecido" });
            }
        }
    }
    async getAll(req, res) {
        const members = await this.memberRepository.find();
        res.json(members);
    }
    async getById(req, res) {
        try {
            const member = await this.memberRepository.findOneBy({
                id: parseInt(req.params.id)
            });
            member ? res.json(member) : res.status(404).json({ message: "Membro não encontrado" });
        }
        catch (error) {
            this.handleError(res, error);
        }
    }
    async update(req, res) {
        try {
            await this.memberRepository.update(req.params.id, req.body);
            res.status(204).send();
        }
        catch (error) {
            this.handleError(res, error);
        }
    }
    async delete(req, res) {
        try {
            await this.memberRepository.delete(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            this.handleError(res, error);
        }
    }
    handleError(res, error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Erro interno" });
        }
    }
}
exports.MemberController = MemberController;
//# sourceMappingURL=MemberController.js.map