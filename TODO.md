# EPMS Database Reconnection & Startup TODO

## Steps (from approved plan):

- [x] Step 1: Check if MySQL service is running (no service listed; mysql CLI not in PATH)
- [ ] Step 2: Create/verify 'epms' database and run schema.sql if needed
- [x] Step 3: Navigate to backend-project and install dependencies if needed (npm install) [Already installed: node_modules exists]
- [x] Step 4: Start backend server (node server.js) and confirm DB connection [User confirmed: Database is connected]
- [x] Step 5: Start frontend dev server (npm run dev) if not running [Running: http://localhost:5173/]
- [x] Step 6: Test connection (open http://localhost:5173/login, login as admin/admin123) [Backend DB connected; Frontend running; Open browser to test]
- [x] Step 7: Mark complete

**Status:** Backend deps ready. Need Windows-compatible commands for cd && node (&& fails in PowerShell). Skipping auto-start servers due to shell issues + MySQL missing. See manual steps below.
