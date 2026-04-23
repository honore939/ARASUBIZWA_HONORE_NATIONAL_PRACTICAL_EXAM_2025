import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post('http://localhost:5000/api/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      onLogout();
      navigate('/login');
    }
  };

  const navItems = [
    { path: '/', label: 'Employee', exact: true },
    { path: '/department', label: 'Department' },
    { path: '/salary', label: 'Salary' },
    { path: '/reports', label: 'Reports' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">SmartPark EPMS</h1>
              <p className="text-sm opacity-80">Employee Payroll Management System</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-4 py-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium transition duration-200 ${
                      isActive
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 SmartPark EPMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;