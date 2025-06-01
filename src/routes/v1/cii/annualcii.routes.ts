import express from 'express';
import { Router } from 'express';

import {
  createAnnualCiiController,
  getAllAnnualCiiController,
  getAnnualCiiByMmsiController,
  getAnnualCiiByMmsiAndYearController,
  updateAnnualCiiController,
  deleteAnnualCiiController,
} from '../../../controllers/cii/annualcii.controller';

const router: Router = express.Router();

router.post('/', createAnnualCiiController);
router.get('/', getAllAnnualCiiController);
router.get('/:mmsi', getAnnualCiiByMmsiController);
router.get('/:mmsi/:year', getAnnualCiiByMmsiAndYearController);
router.put('/:mmsi/:year', updateAnnualCiiController);
router.delete('/:mmsi', deleteAnnualCiiController);

export default router;
