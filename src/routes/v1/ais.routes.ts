import express from 'express';
import {
  getAllAisController,
  getAisByMmsiController,
  getTwoShipRoutesInSpecificTimeRangeController,
  
} from '../../controllers/ais.controller';
import { type Router } from 'express';

const router: Router = express.Router();

router.get('/', getAllAisController);
router.get('/:mmsi', getAisByMmsiController);
router.get('/routes/:mmsi1/:mmsi2', getTwoShipRoutesInSpecificTimeRangeController);

export default router;
