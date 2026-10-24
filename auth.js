const jwt = require('jsonwebtoken');
const { users } = require('../data/store');

function authMiddleware(req,res,next){
  try{
    const header = req.headers.authorization;
    if(!header || !header.startsWith('Bearer ')) return res.status(401).json({error:'Missing token'});
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_change_this_in_prod_123');
    const user = users.find(u=>u.id===payload.id);
    if(!user) return res.status(401).json({error:'User not found'});
    req.user=user; 
    next();
  }catch(e){
    return res.status(401).json({error:'Invalid token'});
  }
}

module.exports = { authMiddleware };
