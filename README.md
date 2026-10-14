# University Research Opportunity Portal

REST API + MySQL + frontend for managing research opportunities.

GitHub Repository: https://github.com/haseeb-arif/research-opportunity-portal


## Backend Setup (XAMPP)
1. Install Node.js and XAMPP; start **MySQL** in the XAMPP Control Panel.
2. Create the database: `mysql -u root < database/schema.sql`
3. `cd backend && npm install`
4. Copy `.env.example` to `.env` (XAMPP root has no password by default).
5. `npm run dev` (server runs on http://localhost:5000)


## API Testing
Import `postman/research-opportunity-portal.postman_collection.json` into Postman and run the requests in order.

## Running the Full Application
1. Start **MySQL** in XAMPP and create the database (see Backend Setup).
2. `cd backend && npm run dev`
3. Open http://localhost:5000 (the frontend is served by the backend).

## Features
- View all research opportunities and the full details of each
- Create, edit, close (Open to Closed) and delete opportunities
- Form validation and success / error messages

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/opportunities | Create an opportunity |
| GET | /api/opportunities | Get all opportunities |
| GET | /api/opportunities/:id | Get one opportunity |
| PUT | /api/opportunities/:id | Update an opportunity |
| DELETE | /api/opportunities/:id | Delete an opportunity |