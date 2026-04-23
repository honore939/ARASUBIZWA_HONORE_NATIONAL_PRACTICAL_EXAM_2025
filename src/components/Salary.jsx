import { useState, useEffect } from 'react';
import axios from 'axios';

function Salary() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);
  const [formData, setFormData] = useState({
    employeeNumber: '',
    GlossSalary: '',
    TotalDeduction: '',
    NetSalary: '',
    month: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchSalaries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/salaries');
      setSalaries(response.data);
    } catch (error) {
      showMessage('error', 'Failed to fetch salary records');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      showMessage('error', 'Failed to fetch employees');
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/departments');
      setDepartments(response.data);
    } catch (error) {
      showMessage('error', 'Failed to fetch departments');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    
    // Auto-calculate NetSalary when GrossSalary or TotalDeduction changes
    if (name === 'GlossSalary' || name === 'TotalDeduction') {
      const gross = parseFloat(newFormData.GlossSalary) || 0;
      const deduction = parseFloat(newFormData.TotalDeduction) || 0;
      newFormData.NetSalary = gross - deduction;
    }
    
    setFormData(newFormData);
  };

  const handleEmployeeSelect = (e) => {
    const empNo = e.target.value;
    const employee = employees.find(emp => emp.employeeNumber === empNo);
    
    if (employee) {
      const dept = departments.find(d => d.DepartementCode === employee.DepartmentCode);
      if (dept) {
        setFormData({
          ...formData,
          employeeNumber: empNo,
          GlossSalary: dept.GrossSalary,
          TotalDeduction: dept.TotalDeduction,
          NetSalary: dept.GrossSalary - dept.TotalDeduction
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSalary) {
        await axios.put(`http://localhost:5000/api/salaries/${editingSalary}`, formData);
        showMessage('success', 'Salary updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/salaries', formData);
        showMessage('success', 'Salary added successfully');
      }
      resetForm();
      fetchSalaries();
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Failed to save salary');
    }
  };

  const handleEdit = (salary) => {
    setEditingSalary(salary.id);
    setFormData({
      employeeNumber: salary.employeeNumber,
      GlossSalary: salary.GlossSalary,
      TotalDeduction: salary.TotalDeduction,
      NetSalary: salary.NetSalary,
      month: salary.month
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      try {
        await axios.delete(`http://localhost:5000/api/salaries/${id}`);
        showMessage('success', 'Salary deleted successfully');
        fetchSalaries();
      } catch (error) {
        showMessage('error', 'Failed to delete salary');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingSalary(null);
    setFormData({
      employeeNumber: '',
      GlossSalary: '',
      TotalDeduction: '',
      NetSalary: '',
      month: ''
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', { 
      style: 'currency', 
      currency: 'RWF',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const months = [
    'January 2025', 'February 2025', 'March 2025', 'April 2025',
    'May 2025', 'June 2025', 'July 2025', 'August 2025',
    'September 2025', 'October 2025', 'November 2025', 'December 2025'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Salary / Payroll Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
        >
          + Add Salary
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Salary Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingSalary ? 'Edit Salary' : 'Add New Salary'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee *
                </label>
                <select
                  name="employeeNumber"
                  value={formData.employeeNumber}
                  onChange={handleEmployeeSelect}
                  disabled={editingSalary}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.employeeNumber} value={emp.employeeNumber}>
                      {emp.employeeNumber} - {emp.FirstName} {emp.LastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month *
                </label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gross Salary (RWF) *
                </label>
                <input
                  type="number"
                  name="GlossSalary"
                  value={formData.GlossSalary}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Deduction (RWF) *
                </label>
                <input
                  type="number"
                  name="TotalDeduction"
                  value={formData.TotalDeduction}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Net Salary (RWF) *
                </label>
                <input
                  type="number"
                  name="NetSalary"
                  value={formData.NetSalary}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100"
                  readOnly
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {editingSalary ? 'Update' : 'Add'} Salary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Salary Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emp No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deduction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salaries.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                    No salary records found. Add your first salary record!
                  </td>
                </tr>
              ) : (
                salaries.map((salary) => (
                  <tr key={salary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {salary.employeeNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {salary.FirstName} {salary.LastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {salary.Position || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {salary.DepartementName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(salary.GlossSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                      {formatCurrency(salary.TotalDeduction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(salary.NetSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {salary.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEdit(salary)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(salary.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Salary;