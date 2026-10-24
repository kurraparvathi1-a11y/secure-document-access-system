function canAccessDocument(user, doc){
  if(!user || !doc) return false;
  if(user.role==='Admin') return true;
  if(doc.ownerId===user.id) return true;
  if(Array.isArray(doc.allowedUserIds) && doc.allowedUserIds.includes(user.id)) return true;
  return false;
}

function canEditDocument(user, doc){
  if(user.role==='Admin') return true;
  if(doc.ownerId===user.id) return true;
  return false;
}

module.exports = { canAccessDocument, canEditDocument };
