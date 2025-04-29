import { Router } from 'express';
import { ClientController } from '../controllers/ClientController';

const router = Router();
const clientController = new ClientController();

router.post('/', clientController.create); // Route for creating a client
router.get('/:id', clientController.getById); // Route for fetching a client by ID

export default router;
