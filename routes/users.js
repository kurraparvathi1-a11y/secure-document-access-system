const express = require('express');
const { users } = require('../data/store');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();
router.use(authMiddleware);
router.get('/', (req,res)=>{
  if(req.user.role!=='Admin' && req.user.role!=='Manager') return res.status(403).json({error:'Forbidden'});
  res.json(users.map(u=>({id:u.id,email:u.email,role:u.role,name:u.name})));
});
module.exports = router;
