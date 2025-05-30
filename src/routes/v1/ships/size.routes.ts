import express from 'express';
import {
  createShipSizeController,
  getAllShipSizesController,
  getShipSizeByIdController,
  updateShipSizeController,
  deleteShipSizeController,
} from '../../../controllers/ships/size.controller';

import { Router } from 'express';

const router: Router = express.Router();

// Routes for ShipSize
router.post('/', createShipSizeController);
router.get('/', getAllShipSizesController);
router.get('/:id', getShipSizeByIdController);
router.put('/:id', updateShipSizeController);
router.delete('/:id', deleteShipSizeController);

export default router;
