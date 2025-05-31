import express from 'express';
import { type Router } from 'express';
import { getCIIByMmsiController } from '../../../controllers/cii/cii.controller';
import zvalueRoute from './zvalue.routes';

const router: Router = express.Router();

router.get('/data/:mmsi', getCIIByMmsiController);
router.use('/zvalue', zvalueRoute);
export default router;
