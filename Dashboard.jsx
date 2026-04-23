import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Dashboard({ logout }) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      logout();
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
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
      <header className="bg-gradient-to-r from-green-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">SmartPark EPMS</h1>
              <p className="text-sm opacity-80">Employee Payroll Management System</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-200 disabled:opacity-50"
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
                        ? 'bg-green-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
      <main className="container mx-auto px-4 py-8 flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; 2025 SmartPark EPMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;

