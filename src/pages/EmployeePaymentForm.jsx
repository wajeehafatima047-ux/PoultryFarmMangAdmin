import React, { useState, useEffect } from 'react';
import { addData, updateData, getDataById, getAllData } from '../Helper/firebaseHelper';
import { Timestamp } from 'firebase/firestore';

const EmployeePaymentForm = ({ payrollId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    employee: '',
    employeeName: '',
    salaryMonth: '',
    amount: '',
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    invoiceId: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);

  const paymentMethodOptions = ['cash', 'bank', 'cheque'];

  useEffect(() => {
    loadEmployees();
    if (payrollId) {
      loadPayrollData();
    }
  }, [payrollId]);

  const loadEmployees = async () => {
    try {
      const employeesData = await getAllData('employees');
      setEmployees(employeesData || []);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadPayrollData = async () => {
    try {
      setLoading(true);
      const payrollData = await getDataById('salaryPayments', payrollId);
      if (payrollData) {
        setFormData({
          employee: payrollData.employeeId || payrollData.employee || '',
          employeeName: payrollData.employeeName || '',
          salaryMonth: payrollData.salaryMonth || '',
          amount: payrollData.amount || '',
          paymentMethod: payrollData.paymentMethod || 'cash',
          paymentDate: payrollData.paymentDate?.toDate ? payrollData.paymentDate.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          invoiceId: payrollData.invoiceId || ''
        });
      }
    } catch (error) {
      setError('Failed to load payroll data');
      console.error('Error loading payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If employee select changes, also update employeeName
    if (name === 'employee') {
      const selectedEmployee = employees.find(emp => emp.id === value);
      setFormData(prev => ({
        ...prev,
        employee: value,
        employeeName: selectedEmployee ? (selectedEmployee.name || selectedEmployee.employeeName || '') : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payrollData = {
        employeeId: formData.employee,
        employeeName: formData.employeeName,
        salaryMonth: formData.salaryMonth,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        paymentDate: Timestamp.fromDate(new Date(formData.paymentDate)),
        invoiceId: formData.invoiceId || ''
      };

      if (payrollId) {
        await updateData('salaryPayments', payrollId, payrollData);
      } else {
        const addedId = await addData('salaryPayments', payrollData);
        
        // Create expense automatically
        await createExpense(payrollData);
        
        // Create invoice automatically
        await createInvoice(payrollData, addedId);
      }

      onSuccess();
    } catch (error) {
      setError('Failed to save payment. Please try again.');
      console.error('Error saving payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (payrollData) => {
    try {
      await addData('expenses', {
        category: 'salary',
        referenceId: `salary_${Date.now()}`,
        description: `Salary Payment - ${payrollData.employeeName} - ${payrollData.salaryMonth}`,
        amount: payrollData.amount,
        date: Timestamp.now(),
        createdBy: 'system'
      });
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const createInvoice = async (payrollData, salaryPaymentId) => {
    try {
      const invoiceId = `INV-${Date.now().toString().slice(-6)}`;
      await addData('invoices', {
        invoiceId,
        invoiceType: 'Salary',
        referenceId: salaryPaymentId,
        date: Timestamp.now(),
        totalAmount: payrollData.amount,
        createdBy: 'system'
      });
      
      // Update salary payment with invoice ID
      await updateData('salaryPayments', salaryPaymentId, { invoiceId });
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '30px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>{payrollId ? 'Edit Payment' : 'Add Salary Payment'}</h3>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {/* Employee */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Employee *</label>
              <select
                name="employee"
                value={formData.employee}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name || emp.employeeName || emp.id}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Name */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Employee Name</label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                readOnly
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  backgroundColor: '#f5f5f5'
                }}
              />
            </div>

            {/* Salary Month */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Salary Month *</label>
              <input
                type="month"
                name="salaryMonth"
                value={formData.salaryMonth}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd'
                }}
              />
            </div>

            {/* Amount */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Amount *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                step="0.01"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd'
                }}
              />
            </div>

            {/* Payment Method */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Payment Method *</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd'
                }}
              >
                {paymentMethodOptions.map((method) => (
                  <option key={method} value={method}>
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Date */}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Payment Date *</label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd'
                }}
              />
            </div>

            {/* Invoice ID */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Invoice ID</label>
              <input
                type="text"
                name="invoiceId"
                value={formData.invoiceId}
                onChange={handleInputChange}
                placeholder="Optional"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Saving...' : payrollId ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeePaymentForm;
