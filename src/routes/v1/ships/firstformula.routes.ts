import express from 'express';
import { type Router } from 'express';

import {
  createFirstFuelFormulaController,
  getAllFirstFuelFormulasController,
  getFirstFuelFormulaByIdController,
  updateFirstFuelFormulaController,
  deleteFirstFuelFormulaController,
} from '../../../controllers/ships/firstformula.controller';

const router: Router = express.Router();

router.post('/', createFirstFuelFormulaController);
router.get('/', getAllFirstFuelFormulasController);
router.get('/:id', getFirstFuelFormulaByIdController);
router.put('/:id', updateFirstFuelFormulaController);
router.delete('/:id', deleteFirstFuelFormulaController);

export default router;
