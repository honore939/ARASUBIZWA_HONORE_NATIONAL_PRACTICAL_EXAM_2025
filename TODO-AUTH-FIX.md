# EPMS Authentication & Authorization Fix TODO

## Approved Plan Steps:

- [x] Step 1: Read current backend server.js to confirm auth logic [Confirmed: plaintext password === comparison]
- [x] Step 2: Update database.sql with bcrypt hashed default admin [Updated with placeholder hash + role column; run in MySQL]
- [x] Step 3: Update server.js: Use bcrypt.compare(), add user roles (admin/employee), auth middleware [Done: CORS fixed, bcrypt login, middleware, session role]
- [ ] Step 4: Restart backend server
- [ ] Step 5: Test login with new hashed admin/admin123
- [ ] Step 6: Add role-based routes protection
- [ ] Step 7: Frontend updates if needed (roles from session)
- [ ] Step 8: Complete

**Status:** Steps 1-2 done. Ready for Step 3: server.js edits (bcrypt + role auth). DB SQL updated (run ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'; then INSERT hashed admin).

Default login after fix: admin / admin123 (hashed securely)
