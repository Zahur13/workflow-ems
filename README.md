---

## 🖥️ Backend Source Code
cd backend
npm install
npm run dev

## 🖥️ Frontend Source Code
cd frontend
npm install
npm run dev

## 🖥️ Database 
mongod
mongosh

use workflow_ems

db.users.insertOne({
        email: "[EMAIL_ADDRESS]",
    password: "[PASSWORD]"
})

