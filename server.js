require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { addAuditLog } = require('./data/store');
const authRoutes = require('./routes/auth');
const docRoutes = require('./routes/documents');
const userRoutes = require('./routes/users');
const auditRoutes = require('./routes/audit');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req,res,next)=>{
  req.ip=req.headers['x-forwarded-for']||req.connection.remoteAddress;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/documents', docRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit', auditRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req,res)=>res.json({status:'ok', timestamp:new Date().toISOString()}));

app.get('*', (req,res)=>{
  if(req.path.startsWith('/api/')) return res.status(404).json({error:'API not found'});
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, ()=>console.log('Running on '+PORT));
