import express from 'express';
import {
  getAllAisController,
  getAisByMmsiController,
} from '../../controllers/ais.controller';
import { type Router } from 'express';

const router: Router = express.Router();

router.get('/', getAllAisController);
router.get('/:mmsi', getAisByMmsiController);

export default router;
