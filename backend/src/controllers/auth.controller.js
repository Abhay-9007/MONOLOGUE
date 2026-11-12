import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import { sendOtpEmail } from '../services/email.js';

const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');
const makeOtp = () => String(crypto.randomInt(100000, 1000000));
function setCookie(res, userId) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
  res.cookie('accessToken', token, { httpOnly: true, secure: process.env.COOKIE_SECURE === 'true', sameSite: 'lax', maxAge: 24*60*60*1000 });
}
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || '') || (password || '').length < 8)
      return res.status(400).json({ success:false, message:'Enter a name, valid email and password of at least 8 characters.' });
    const normalized = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalized });
    if (user?.isEmailVerified) return res.status(409).json({ success:false, message:'An account with this email already exists.' });
    const hashed = await bcrypt.hash(password, 12);
    if (!user) user = new User({ name: name.trim(), email: normalized, password: hashed });
    else { user.name = name.trim(); user.password = hashed; }
    await user.save();
    await issueOtp(normalized, 'verify');
    res.status(201).json({ success:true, message:'Verification code sent. In development, check the backend terminal if DEV_OTP=true.' });
  } catch(e) { next(e); }
}
async function issueOtp(email, purpose) {
  const otp = makeOtp();
  await Otp.deleteMany({ email, purpose });
  await Otp.create({ email, purpose, otpHash: hashOtp(otp), expiresAt: new Date(Date.now()+5*60*1000) });
  await sendOtpEmail(email, otp, purpose);
}
export async function resendOtp(req,res,next) {
  try {
    const email = (req.body.email || '').toLowerCase().trim();
    if (!email) return res.status(400).json({success:false,message:'Email is required.'});
    await issueOtp(email, 'verify');
    res.json({success:true,message:'A new code has been sent.'});
  } catch(e){next(e);}
}
export async function verifyOtp(req,res,next) {
  try {
    const email=(req.body.email||'').toLowerCase().trim(), otp=String(req.body.otp||'');
    const record=await Otp.findOne({email,purpose:'verify'}).sort({createdAt:-1});
    if(!record || record.expiresAt < new Date()) return res.status(400).json({success:false,message:'Code expired. Request a new one.'});
    if(record.attempts>=5) return res.status(429).json({success:false,message:'Too many attempts. Request a new code.'});
    record.attempts++;
    if(record.otpHash !== hashOtp(otp)) { await record.save(); return res.status(400).json({success:false,message:'Incorrect verification code.'}); }
    const user=await User.findOneAndUpdate({email},{isEmailVerified:true},{new:true});
    await Otp.deleteMany({email,purpose:'verify'});
    setCookie(res,user._id);
    res.json({success:true,user:{id:user._id,name:user.name,email:user.email}});
  } catch(e){next(e);}
}
export async function login(req,res,next) {
  try {
    const email=(req.body.email||'').toLowerCase().trim();
    const user=await User.findOne({email}).select('+password');
    if(!user || !(await bcrypt.compare(req.body.password||'',user.password)))
      return res.status(401).json({success:false,message:'Invalid email or password.'});
    if(!user.isEmailVerified) return res.status(403).json({success:false,message:'Please verify your email first.'});
    setCookie(res,user._id);
    res.json({success:true,user:{id:user._id,name:user.name,email:user.email}});
  } catch(e){next(e);}
}
export async function logout(_req,res) {
  res.clearCookie('accessToken',{httpOnly:true,secure:process.env.COOKIE_SECURE==='true',sameSite:'lax'});
  res.json({success:true,message:'Logged out.'});
}
export async function me(req,res) {
  const user=await User.findById(req.user.id).select('name email preferences');
  if(!user) return res.status(404).json({success:false,message:'User not found.'});
  res.json({success:true,user:{id:user._id,name:user.name,email:user.email,preferences:user.preferences}});
}
export async function forgotPassword(req,res,next) {
  try {
    const email=(req.body.email||'').toLowerCase().trim();
    if(await User.exists({email})) await issueOtp(email,'reset');
    res.json({success:true,message:'If the account exists, a reset code has been sent.'});
  } catch(e){next(e);}
}
export async function resetPassword(req,res,next) {
  try {
    const email=(req.body.email||'').toLowerCase().trim(), otp=String(req.body.otp||''), password=req.body.password||'';
    if(password.length<8) return res.status(400).json({success:false,message:'Password must contain at least 8 characters.'});
    const record=await Otp.findOne({email,purpose:'reset'}).sort({createdAt:-1});
    if(!record || record.expiresAt<new Date() || record.attempts>=5) return res.status(400).json({success:false,message:'Code expired or unavailable.'});
    record.attempts++;
    if(record.otpHash!==hashOtp(otp)){await record.save();return res.status(400).json({success:false,message:'Incorrect code.'});}
    await User.findOneAndUpdate({email},{password:await bcrypt.hash(password,12)});
    await Otp.deleteMany({email,purpose:'reset'});
    res.json({success:true,message:'Password updated. You can now log in.'});
  } catch(e){next(e);}
}
