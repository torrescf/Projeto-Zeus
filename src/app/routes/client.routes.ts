import { Router } from "express";
import { ClientController } from "../../controllers/ClientController";
import { AppDataSource } from "../../database/data-source";
import { Client } from "../../database/entities/Client";
import { uploadPhoto } from "../../middlewares/uploadMiddleware";

const router = Router();
const controller = new ClientController();

router.post("/register", controller.create); // Rota pública para registro de clientes
router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

// Rota pública para deletar cliente por ID
router.delete('/delete/clients/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido. Use apenas números, exemplo: /delete/clients/1' });
    }
    try {
        const clientRepository = AppDataSource.getRepository(Client);
        const result = await clientRepository.delete(id);
        if (result.affected && result.affected > 0) {
            return res.status(204).send();
        } else {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar cliente', error: error instanceof Error ? error.message : error });
    }
});

// Upload de foto de perfil do client para o Cloudinary
router.post('/upload-photo/:id', uploadPhoto, (req, res) => controller.uploadProfilePhoto(req, res));

export default router;
