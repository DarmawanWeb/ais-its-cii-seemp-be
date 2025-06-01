import express from 'express';
import { type Router } from 'express';
import { getCIIByMmsiController } from '../../../controllers/cii/cii.controller';

import zvalueRoute from './zvalue.routes';
import anualCIIRoutes from './annualcii.routes';
import dailyCIIRoutes from './dailycii.routes';

const router: Router = express.Router();

router.get('/data/:mmsi', getCIIByMmsiController);
router.use('/zvalue', zvalueRoute);
router.use('/annualcii', anualCIIRoutes);
router.use('/dailycii', dailyCIIRoutes);
export default router;
