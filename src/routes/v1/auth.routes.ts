import express from 'express';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from '../../controllers/auth.controller';
import {
  registerValidation,
  loginValidation,
} from '../../validation/auth.validation';
import { type Router } from 'express';

const router: Router = express.Router();

router.post('/register', registerValidation, registerController);
router.post('/login', loginValidation, loginController);
router.post('/refresh', refreshController);
router.post('/logout', logoutController);

export default router;
