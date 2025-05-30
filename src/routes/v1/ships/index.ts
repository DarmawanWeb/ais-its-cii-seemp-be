import express from 'express';
import { type Router } from 'express';

import generalRoutes from './general.routes';
import sizeRoutes from './size.routes';
import fuelRoutes from './fuel.routes';
import typeRoutes from './type.routes';
import auxEngineRoutes from './auxengine.routes';
import mainEngineRoutes from './mainengine.routes';

const router: Router = express.Router();

router.use('/general', generalRoutes);
router.use('/size', sizeRoutes);
router.use('/fuel', fuelRoutes);
router.use('/type', typeRoutes);
router.use('/auxengine', auxEngineRoutes);
router.use('/mainengine', mainEngineRoutes);

export default router;
