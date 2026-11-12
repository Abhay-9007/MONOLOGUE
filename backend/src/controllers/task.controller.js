import Task from '../models/Task.js';
const safeFields=['title','description','category','priority','status','startDate','dueDate','startTime','endTime','estimatedDuration','tags','subtasks','reminder'];
export async function listTasks(req,res,next){
 try{
  const {status,priority,search,from,to}=req.query, filter={userId:req.user.id};
  if(status) filter.status=status; if(priority) filter.priority=priority;
  if(search) filter.title={$regex:search.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),$options:'i'};
  if(from||to){filter.dueDate={};if(from)filter.dueDate.$gte=new Date(from);if(to)filter.dueDate.$lte=new Date(to);}
  const tasks=await Task.find(filter).sort({dueDate:1,createdAt:-1}).limit(300);
  res.json({success:true,tasks});
 }catch(e){next(e);}
}
export async function createTask(req,res,next){
 try{
  if(!req.body.title?.trim()) return res.status(400).json({success:false,message:'Task title is required.'});
  const data={}; for(const k of safeFields) if(req.body[k]!==undefined)data[k]=req.body[k];
  const task=await Task.create({...data,userId:req.user.id});
  res.status(201).json({success:true,task});
 }catch(e){next(e);}
}
export async function getTask(req,res,next){
 try{const task=await Task.findOne({_id:req.params.id,userId:req.user.id});if(!task)return res.status(404).json({success:false,message:'Task not found.'});res.json({success:true,task});}catch(e){next(e);}
}
export async function updateTask(req,res,next){
 try{const data={};for(const k of safeFields)if(req.body[k]!==undefined)data[k]=req.body[k];
  if(data.status==='Completed')data.completedAt=new Date();else if(data.status)data.completedAt=null;
  const task=await Task.findOneAndUpdate({_id:req.params.id,userId:req.user.id},data,{new:true,runValidators:true});
  if(!task)return res.status(404).json({success:false,message:'Task not found.'});res.json({success:true,task});
 }catch(e){next(e);}
}
export async function deleteTask(req,res,next){
 try{const task=await Task.findOneAndDelete({_id:req.params.id,userId:req.user.id});if(!task)return res.status(404).json({success:false,message:'Task not found.'});res.json({success:true});}catch(e){next(e);}
}
