import express from 'express';
import { type Router } from 'express';

import {
  createFuelController,
  getAllFuelsController,
  getFuelByIdController,
  updateFuelController,
  deleteFuelController,
} from '../../../controllers/ships/fuel.controller';

const router: Router = express.Router();

router.post('/', createFuelController);
router.get('/', getAllFuelsController);
router.get('/:id', getFuelByIdController);
router.put('/:id', updateFuelController);
router.delete('/:id', deleteFuelController);

export default router;
