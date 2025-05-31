import express from 'express';
import { type Router } from 'express';

import {
  createPortController,
  getAllPortsController,
  getPortByIdController,
  updatePortController,
  deletePortController,
} from '../../controllers/port.controller';

const router: Router = express.Router();

router.post('/', createPortController);
router.get('/', getAllPortsController);
router.get('/:id', getPortByIdController);
router.put('/:id', updatePortController);
router.delete('/:id', deletePortController);

export default router;
