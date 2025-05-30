import express from 'express';
import { type Router } from 'express';

import {
  createShipTypeController,
  getAllShipTypesController,
  getShipTypeByIdController,
  updateShipTypeController,
  deleteShipTypeController,
} from '../../../controllers/ships/type.controller';

const router: Router = express.Router();

router.post('/', createShipTypeController);
router.get('/', getAllShipTypesController);
router.get('/:id', getShipTypeByIdController);
router.put('/:id', updateShipTypeController);
router.delete('/:id', deleteShipTypeController);

export default router;
