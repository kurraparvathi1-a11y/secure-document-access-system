const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users, addAuditLog } = require('../data/store');
const router = express.Router();

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const user = users.find(u=>u.email===email);
  if(!user) return res.status(401).json({error:'Invalid credentials'});
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(401).json({error:'Invalid credentials'});
  const token = jwt.sign({id:user.id, role:user.role}, process.env.JWT_SECRET || 'supersecretjwtkey_change_this_in_prod_123', {expiresIn:'1h'});
  addAuditLog({userId:user.id, userEmail:user.email, action:'LOGIN', details:`Login success`, ip:req.ip, success:true});
  res.json({token, user:{id:user.id, email:user.email, role:user.role, name:user.name}});
});

router.get('/me', require('../middleware/auth').authMiddleware, (req,res)=>{
  res.json({id:req.user.id, email:req.user.email, role:req.user.role, name:req.user.name});
});

module.exports = router;
