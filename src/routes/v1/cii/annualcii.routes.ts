import express from 'express';
import { Router } from 'express';

import {
  createAnnualCiiController,
  getAllAnnualCiiController,
  getAnnualCiiByMmsiController,
  getAnnualCiiByMmsiAndYearController,
  getAnnualCiiByMMSIWithDDVectorController,
  updateAnnualCiiController,
  deleteAnnualCiiController,
} from '../../../controllers/cii/annualcii.controller';

const router: Router = express.Router();

router.post('/', createAnnualCiiController);
router.get('/', getAllAnnualCiiController);
router.get('/:mmsi', getAnnualCiiByMmsiController);
router.get('/:mmsi/year/:year', getAnnualCiiByMmsiAndYearController);
router.get('/:mmsi/ddvector', getAnnualCiiByMMSIWithDDVectorController);
router.put('/:mmsi/year/:year', updateAnnualCiiController);
router.delete('/:mmsi', deleteAnnualCiiController);

export default router;
