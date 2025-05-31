import express from 'express';
import { type Router } from 'express';
import {
  createShipController,
  getAllShipsController,
  getShipByIdController,
  getShipByMMSIController,
  updateShipController,
  deleteShipController,
} from '../../../controllers/ships/ships.controller';

const router: Router = express.Router();

router.post('/', createShipController);
router.get('/', getAllShipsController);
router.get('/:id', getShipByIdController);
router.get('/mmsi/:mmsi', getShipByMMSIController);
router.put('/:id', updateShipController);
router.delete('/:id', deleteShipController);

export default router;
