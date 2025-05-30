import express from 'express';
import { type Router } from 'express';
import {
  createShipController,
  getAllShipsController,
  getShipByIdController,
  updateShipController,
  deleteShipController,
} from '../../../controllers/ships/ships.controller';

import generalRoutes from './general.routes';
import sizeRoutes from './size.routes';
import fuelRoutes from './fuel.routes';
import typeRoutes from './type.routes';
import auxEngineRoutes from './auxengine.routes';
import mainEngineRoutes from './mainengine.routes';
import firstFormulaRoutes from './firstformula.routes';

const router: Router = express.Router();

router.post('/', createShipController);
router.get('/', getAllShipsController);
router.get('/:id', getShipByIdController);
router.put('/:id', updateShipController);
router.delete('/:id', deleteShipController);

router.use('/general', generalRoutes);
router.use('/size', sizeRoutes);
router.use('/fuel', fuelRoutes);
router.use('/type', typeRoutes);
router.use('/auxengine', auxEngineRoutes);
router.use('/mainengine', mainEngineRoutes);
router.use('/firstformula', firstFormulaRoutes);

export default router;
