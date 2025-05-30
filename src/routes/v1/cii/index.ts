import express from 'express';
import { type Router } from 'express';
import { getCIIByMmsiController } from '../../../controllers/cii/cii.controller';

const router: Router = express.Router();

router.get('/:mmsi', getCIIByMmsiController);
export default router;
