import express from 'express';
import { 
  getTasks, 
  createTask, 
  deleteTask, 
  updateTask 
} from '../controller/taskController.js';

const router = express.Router();

router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.delete('/tasks/:id', deleteTask);
router.put('/tasks/:id', updateTask);

export default router;