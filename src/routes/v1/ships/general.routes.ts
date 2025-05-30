import express from 'express';
import {
  createShipGeneralController,
  getAllShipGeneralsController,
  getShipGeneralByIdController,
  updateShipGeneralController,
  deleteShipGeneralController,
} from '../../../controllers/ships/general.controller';

import { type Router } from 'express';

const router: Router = express.Router();

router.post('/', createShipGeneralController);
router.get('/', getAllShipGeneralsController);
router.get('/:id', getShipGeneralByIdController);
router.put('/:id', updateShipGeneralController);
router.delete('/:id', deleteShipGeneralController);

export default router;
