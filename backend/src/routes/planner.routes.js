import {Router} from 'express';import {requireAuth} from '../middleware/auth.js';import Task from '../models/Task.js';
const router=Router();router.use(requireAuth);
function dayStart(d){const x=new Date(d);x.setHours(0,0,0,0);return x;}
router.get('/today',async(req,res,next)=>{try{const start=dayStart(new Date()),end=new Date(start);end.setDate(end.getDate()+1);const tasks=await Task.find({userId:req.user.id,$or:[{dueDate:{$gte:start,$lt:end}},{startDate:{$gte:start,$lt:end}}]}).sort({startTime:1,dueDate:1});res.json({success:true,tasks});}catch(e){next(e);}});
router.get('/week',async(req,res,next)=>{try{const base=dayStart(req.query.date?new Date(req.query.date):new Date());const monday=new Date(base);monday.setDate(base.getDate()-(base.getDay()+6)%7);const end=new Date(monday);end.setDate(end.getDate()+7);const tasks=await Task.find({userId:req.user.id,$or:[{dueDate:{$gte:monday,$lt:end}},{startDate:{$gte:monday,$lt:end}}]}).sort({dueDate:1});res.json({success:true,tasks,start:monday,end});}catch(e){next(e);}});
export default router;
