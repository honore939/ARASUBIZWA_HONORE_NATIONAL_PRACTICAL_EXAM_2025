import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Employee from './components/Employee';
import Department from './components/Department';
import Salary from './components/Salary';
import Reports from './components/Reports';

function App() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
      />
      <Route
        path="/"
        element={isAuthenticated ? <Dashboard logout={logout} user={user} /> : <Navigate to="/login" />}
      >
        <Route index element={<Employee />} />
        <Route path="department" element={<Department />} />
        <Route path="salary" element={<Salary />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
    </Routes>
  );
}

export default App;
