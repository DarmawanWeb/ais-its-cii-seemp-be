import express from 'express';
import {
  getAllResultsController,
  getResultsByShipController,
  getQueueStatusController,
  getQueueByShipsController,
} from '../../controllers/illegal-transhipment.controller';

import { type Router } from 'express';

const router: Router = express.Router();

router.get('/results', getAllResultsController);
router.get('/results/:mmsi', getResultsByShipController);
router.get('/queue/status', getQueueStatusController);
router.get('/queue/:mmsi1/:mmsi2', getQueueByShipsController);

export default router;
