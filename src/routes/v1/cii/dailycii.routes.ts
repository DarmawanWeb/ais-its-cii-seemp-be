import express from 'express';
import { Router } from 'express';

import {
  createDailyCiiController,
  getAllDailyCiiController,
  getDailyCiiByMmsiController,
  getDailyCiiByMmsiAndTimestampController,
  updateDailyCiiController,
  deleteDailyCiiController,
} from '../../../controllers/cii/dailycii.controller';

const router: Router = express.Router();

router.post('/', createDailyCiiController);
router.get('/', getAllDailyCiiController);
router.get('/:mmsi', getDailyCiiByMmsiController);
router.get('/:mmsi/:timestamp', getDailyCiiByMmsiAndTimestampController);
router.put('/:mmsi/:timestamp', updateDailyCiiController);
router.delete('/:mmsi', deleteDailyCiiController);

export default router;
