import {Router} from 'express';import {requireAuth} from '../middleware/auth.js';import Task from '../models/Task.js';
const router=Router();router.use(requireAuth);
router.get('/overview',async(req,res,next)=>{try{
 const tasks=await Task.find({userId:req.user.id}).select('status priority category dueDate createdAt completedAt');
 const total=tasks.length,completed=tasks.filter(t=>t.status==='Completed').length,pending=total-completed;
 const overdue=tasks.filter(t=>t.status!=='Completed'&&t.dueDate&&new Date(t.dueDate)<new Date()).length;
 const categories={};tasks.forEach(t=>categories[t.category||'Other']=(categories[t.category||'Other']||0)+1);
 const last7=Array.from({length:7},(_,i)=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-6+i);const next=new Date(d);next.setDate(next.getDate()+1);return {day:d.toLocaleDateString('en',{weekday:'short'}),completed:tasks.filter(t=>t.completedAt&&new Date(t.completedAt)>=d&&new Date(t.completedAt)<next).length};});
 res.json({success:true,stats:{total,completed,pending,overdue,completionRate:total?Math.round(completed/total*100):0,categories,weekly:last7}});
 }catch(e){next(e);}});
export default router;
