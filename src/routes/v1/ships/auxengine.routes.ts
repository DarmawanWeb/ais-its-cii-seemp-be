import express from 'express';
import { type Router } from 'express';

import {
  createAuxiliaryEngineController,
  getAllAuxiliaryEnginesController,
  getAuxiliaryEngineByIdController,
  updateAuxiliaryEngineController,
  deleteAuxiliaryEngineController,
} from '../../../controllers/ships/auxengine.controller';

const router: Router = express.Router();

router.post('/', createAuxiliaryEngineController);
router.get('/', getAllAuxiliaryEnginesController);
router.get('/:id', getAuxiliaryEngineByIdController);
router.put('/:id', updateAuxiliaryEngineController);
router.delete('/:id', deleteAuxiliaryEngineController);

export default router;
