import { useState, useEffect } from 'react';
import axios from 'axios';

function Reports() {
  const [payrollData, setPayrollData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const months = [
    'January 2025', 'February 2025', 'March 2025', 'April 2025',
    'May 2025', 'June 2025', 'July 2025', 'August 2025',
    'September 2025', 'October 2025', 'November 2025', 'December 2025'
  ];

  useEffect(() => {
    fetchPayrollReport();
  }, []);

  const fetchPayrollReport = async (month = '') => {
    setLoading(true);
    try {
      const url = month 
        ? `http://localhost:5000/api/reports/monthly-payroll?month=${encodeURIComponent(month)}`
        : 'http://localhost:5000/api/reports/monthly-payroll';
      
      const response = await axios.get(url);
      setPayrollData(response.data);
    } catch (error) {
      showMessage('error', 'Failed to fetch payroll report');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    fetchPayrollReport(month);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', { 
      style: 'currency', 
      currency: 'RWF',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  // Calculate totals
  const totals = payrollData.reduce((acc, emp) => {
    acc.gross += parseFloat(emp.GrossSalary) || 0;
    acc.deduction += parseFloat(emp.TotalDeduction) || 0;
    acc.net += parseFloat(emp.NetSalary) || 0;
    return acc;
  }, { gross: 0, deduction: 0, net: 0 });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Monthly Payroll Report</h2>
        <div className="flex space-x-4">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Months</option>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Print Report
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Gross Salary</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(totals.gross)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Deductions</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">{formatCurrency(totals.deduction)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Total Net Salary</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(totals.net)}</p>
        </div>
      </div>

      {/* Payroll Report Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedMonth ? `Payroll Report - ${selectedMonth}` : 'All Employees Payroll Report'}
          </h3>
          <p className="text-sm text-gray-500">SmartPark EPMS - Generated on {new Date().toLocaleDateString()}</p>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emp No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Name
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payrollData.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                      No payroll data found. Please add salary records first.
                    </td>
                  </tr>
                ) : (
                  payrollData.map((emp, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {emp.employeeNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {emp.FirstName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {emp.LastName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {emp.Position || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {emp.DepartementName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {emp.GrossSalary ? formatCurrency(emp.GrossSalary) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                        {emp.TotalDeduction ? formatCurrency(emp.TotalDeduction) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {emp.NetSalary ? formatCurrency(emp.NetSalary) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {emp.month || 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {payrollData.length > 0 && (
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                      Total:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatCurrency(totals.gross)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                      {formatCurrency(totals.deduction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                      {formatCurrency(totals.net)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;