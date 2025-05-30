import express from 'express';
import { type Router } from 'express';

import {
  createMainEngineController,
  getAllMainEnginesController,
  getMainEngineByIdController,
  updateMainEngineController,
  deleteMainEngineController,
} from '../../../controllers/ships/mainengine.controller';

const router: Router = express.Router();

router.post('/', createMainEngineController);
router.get('/', getAllMainEnginesController);
router.get('/:id', getMainEngineByIdController);
router.put('/:id', updateMainEngineController);
router.delete('/:id', deleteMainEngineController);

export default router;
