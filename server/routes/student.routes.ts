import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';

const router = Router();

router.get('/', StudentController.list);
router.get('/:id', StudentController.getById);
router.post('/register', StudentController.register);

export default router;
