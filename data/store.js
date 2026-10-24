const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const users = [
  { 
    id: 'admin-1', 
    email: process.env.ADMIN_EMAIL || 'admin@snovasys.com', 
    passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Admin@123', 10), 
    role: 'Admin', 
    name: 'System Admin' 
  },
  { 
    id: 'manager-1', 
    email: 'manager@test.com', 
    passwordHash: bcrypt.hashSync('Manager@123', 10), 
    role: 'Manager', 
    name: 'Test Manager' 
  },
  { 
    id: 'emp-1', 
    email: 'employee@test.com', 
    passwordHash: bcrypt.hashSync('Employee@123', 10), 
    role: 'Employee', 
    name: 'Test Employee' 
  }
];

const documents = [];
const auditLogs = [];

function addAuditLog({ userId, userEmail, action, resourceId, details, ip, success }) {
  auditLogs.push({
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    userId: userId || 'anonymous',
    userEmail: userEmail || 'unknown',
    action,
    resourceId: resourceId || null,
    details,
    ip: ip || 'unknown',
    success: success !== false
  });
}

module.exports = { users, documents, auditLogs, addAuditLog };
