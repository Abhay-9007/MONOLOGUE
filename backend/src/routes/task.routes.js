import {Router} from 'express';
import {requireAuth} from '../middleware/auth.js';
import {listTasks,createTask,getTask,updateTask,deleteTask} from '../controllers/task.controller.js';
const router=Router();router.use(requireAuth);
router.get('/',listTasks);router.post('/',createTask);router.get('/:id',getTask);router.put('/:id',updateTask);router.patch('/:id',updateTask);router.delete('/:id',deleteTask);
export default router;
