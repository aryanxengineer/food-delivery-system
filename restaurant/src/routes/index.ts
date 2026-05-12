import { Router } from 'express';
import { isAuth } from '../middlewares/authentication.middleware.js';

const indexRouter = Router();

indexRouter.use(isAuth);



export default indexRouter;