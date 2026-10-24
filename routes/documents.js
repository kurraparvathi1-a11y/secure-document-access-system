const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { documents, addAuditLog } = require('../data/store');
const { authMiddleware } = require('../middleware/auth');
const { canAccessDocument, canEditDocument } = require('../middleware/authorize');
const router = express.Router();
router.use(authMiddleware);

router.get('/', (req,res)=>{
  let filtered = documents;
  if(req.user.role!=='Admin'){
    filtered = documents.filter(d=>canAccessDocument(req.user,d));
  }
  res.json(filtered);
});

router.get('/:id', (req,res)=>{
  const doc = documents.find(d=>d.id===req.params.id);
  if(!doc) return res.status(404).json({error:'Not found'});
  if(!canAccessDocument(req.user,doc)) return res.status(403).json({error:'Forbidden'});
  addAuditLog({userId:req.user.id, userEmail:req.user.email, action:'VIEW_DOC', resourceId:doc.id, details:`Viewed ${doc.title}`, ip:req.ip});
  res.json(doc);
});

router.post('/', (req,res)=>{
  const doc = { id:uuidv4(), title:req.body.title, content:req.body.content||'', ownerId:req.user.id, ownerEmail:req.user.email, allowedUserIds:req.body.allowedUserIds||[], createdAt:new Date().toISOString() };
  documents.push(doc);
  addAuditLog({userId:req.user.id, userEmail:req.user.email, action:'CREATE_DOC', resourceId:doc.id, details:`Created ${doc.title}`, ip:req.ip});
  res.status(201).json(doc);
});

router.put('/:id', (req,res)=>{
  const doc = documents.find(d=>d.id===req.params.id);
  if(!doc) return res.status(404).json({error:'Not found'});
  if(!canEditDocument(req.user,doc)) return res.status(403).json({error:'Forbidden'});
  Object.assign(doc, {title:req.body.title||doc.title, content:req.body.content||doc.content, allowedUserIds:req.body.allowedUserIds||doc.allowedUserIds});
  addAuditLog({userId:req.user.id, userEmail:req.user.email, action:'EDIT_DOC', resourceId:doc.id, details:`Edited ${doc.title}`, ip:req.ip});
  res.json(doc);
});

router.delete('/:id', (req,res)=>{
  const idx = documents.findIndex(d=>d.id===req.params.id);
  if(idx===-1) return res.status(404).json({error:'Not found'});
  if(!canEditDocument(req.user,documents[idx])) return res.status(403).json({error:'Forbidden'});
  const del = documents.splice(idx,1)[0];
  addAuditLog({userId:req.user.id, userEmail:req.user.email, action:'DELETE_DOC', resourceId:del.id, details:`Deleted ${del.title}`, ip:req.ip});
  res.json({message:'Deleted'});
});

module.exports = router;
