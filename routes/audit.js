const express = require('express');
const { auditLogs } = require('../data/store');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();
router.use(authMiddleware);
router.get('/', (req,res)=>{
  if(req.user.role!=='Admin') return res.status(403).json({error:'Forbidden'});
  res.json(auditLogs.slice().reverse());
});
module.exports = router;
