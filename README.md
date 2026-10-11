# University Research Opportunity Portal

REST API + MySQL + frontend for managing research opportunities.

GitHub Repository: https://github.com/haseeb-arif/research-opportunity-portal


## Backend Setup (XAMPP)
1. Install Node.js and XAMPP; start **MySQL** in the XAMPP Control Panel.
2. Create the database: `mysql -u root < database/schema.sql`
3. `cd backend && npm install`
4. Copy `.env.example` to `.env` (XAMPP root has no password by default).
5. `npm run dev` (server runs on http://localhost:5000)