import express from 'express';
import { Router } from 'express';

import {
  createDailyCiiController,
  getAllDailyCiiController,
  getDailyCiiByMmsiController,
  getLatestDailyCiiByMmsiController,
  deleteDailyCiiController,
} from '../../../controllers/cii/dailycii.controller';

const router: Router = express.Router();

router.post('/', createDailyCiiController);
router.get('/', getAllDailyCiiController);
router.get('/:mmsi', getDailyCiiByMmsiController);
router.get('/:mmsi/latest', getLatestDailyCiiByMmsiController);
router.delete('/:mmsi', deleteDailyCiiController);

export default router;
