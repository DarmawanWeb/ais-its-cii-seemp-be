import express from 'express';
import { type Router } from 'express';

import {
  createZValueController,
  getAllZValuesController,
  getZValueByIdController,
  getZValueByYearController,
  updateZValueController,
  deleteZValueController,
} from '../../../controllers/cii/zvalue.controller';

const router: Router = express.Router();

router.post('/', createZValueController);
router.get('/', getAllZValuesController);
router.get('/:id', getZValueByIdController);
router.get('/year/:year', getZValueByYearController);
router.put('/:id', updateZValueController);
router.delete('/:id', deleteZValueController);

export default router;
