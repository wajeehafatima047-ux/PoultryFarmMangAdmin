import React, { useState, useEffect } from 'react';
import { addData, updateData, getDataById, getAllData } from '../Helper/firebaseHelper';

const EmployeePayrollForm = ({ payrollId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    employee: '',
    position: '',
    baseSalary: '',
    workingDay: '',
    bonus: '',
    deduction: '',
    netSalary: '',
    status: 'Pending'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);

  const statusOptions = ['Pending', 'Approved', 'Paid', 'Rejected', 'On Hold'];

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
      const payrollData = await getDataById('payroll', payrollId);
      if (payrollData) {
        setFormData({
          employee: payrollData.employee || '',
          position: payrollData.position || '',
          baseSalary: payrollData.baseSalary || '',
          workingDay: payrollData.workingDay || '',
          bonus: payrollData.bonus || '',
          deduction: payrollData.deduction || '',
          netSalary: payrollData.netSalary || '',
          status: payrollData.status || 'Pending'
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate net salary when base salary, bonus, or deduction changes
    if (name === 'baseSalary' || name === 'bonus' || name === 'deduction') {
      calculateNetSalary(name, value);
    }
  };

  const calculateNetSalary = (changedField, changedValue) => {
    const baseSalary = parseFloat(changedField === 'baseSalary' ? changedValue : formData.baseSalary) || 0;
    const bonus = parseFloat(changedField === 'bonus' ? changedValue : formData.bonus) || 0;
    const deduction = parseFloat(changedField === 'deduction' ? changedValue : formData.deduction) || 0;
    
    const netSalary = baseSalary + bonus - deduction;
    
    setFormData(prev => ({
      ...prev,
      netSalary: netSalary.toFixed(2)
    }));
  };

  const handleEmployeeChange = (e) => {
    const selectedEmployeeId = e.target.value;
    const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
    
    if (selectedEmployee) {
      setFormData(prev => ({
        ...prev,
        employee: selectedEmployeeId,
        position: selectedEmployee.position || selectedEmployee.role || '',
        baseSalary: selectedEmployee.salary || ''
      }));
      
      // Recalculate net salary with new base salary
      const bonus = parseFloat(prev.bonus) || 0;
      const deduction = parseFloat(prev.deduction) || 0;
      const netSalary = (parseFloat(selectedEmployee.salary) || 0) + bonus - deduction;
      
      setFormData(prev => ({
        ...prev,
        netSalary: netSalary.toFixed(2)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        employee: selectedEmployeeId,
        position: '',
        baseSalary: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payrollData = {
        ...formData,
        baseSalary: parseFloat(formData.baseSalary) || 0,
        workingDay: parseInt(formData.workingDay) || 0,
        bonus: parseFloat(formData.bonus) || 0,
        deduction: parseFloat(formData.deduction) || 0,
        netSalary: parseFloat(formData.netSalary) || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (payrollId) {
        // Update existing payroll
        await updateData('payroll', payrollId, payrollData);
      } else {
        // Create new payroll
        await addData('payroll', payrollData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      setError('Failed to save payroll');
      console.error('Error saving payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && payrollId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading payroll data...</p>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>{payrollId ? 'Edit Payroll' : 'Add New Payroll'}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
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
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Employee:
              </label>
              <select
                name="employee"
                value={formData.employee}
                onChange={handleEmployeeChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              >
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.employee || employee.name} - {employee.position || employee.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Position:
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
                placeholder="Employee position"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Base Salary ($):
              </label>
              <input
                type="number"
                name="baseSalary"
                value={formData.baseSalary}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
                placeholder="0.00"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Working Days:
              </label>
              <input
                type="number"
                name="workingDay"
                value={formData.workingDay}
                onChange={handleInputChange}
                required
                min="0"
                max="31"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
                placeholder="0"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Bonus ($):
              </label>
              <input
                type="number"
                name="bonus"
                value={formData.bonus}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
                placeholder="0.00"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Deduction ($):
              </label>
              <input
                type="number"
                name="deduction"
                value={formData.deduction}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
                placeholder="0.00"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Net Salary ($):
              </label>
              <input
                type="number"
                name="netSalary"
                value={formData.netSalary}
                readOnly
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px',
                  backgroundColor: '#f8f9fa',
                  fontWeight: 'bold',
                  color: '#007bff'
                }}
                placeholder="Auto-calculated"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Status:
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: loading ? '#ccc' : '#007bff',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {loading ? 'Saving...' : (payrollId ? 'Update Payroll' : 'Create Payroll')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeePayrollForm;