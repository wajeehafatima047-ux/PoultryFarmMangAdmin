import React, { useState, useEffect } from 'react';
import { addData, updateData, getDataById, getAllData } from '../Helper/firebaseHelper';

const PaymentForm = ({ paymentId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    paymentid: '',
    orderid: '',
    customer: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    status: 'Pending',
    method: 'Cash',
    action: 'Payment'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);

  const statusOptions = ['Pending', 'Completed', 'Failed', 'Refunded', 'Cancelled'];
  const methodOptions = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Mobile Payment', 'Check', 'Online Payment'];
  const actionOptions = ['Payment', 'Refund', 'Partial Payment', 'Advance Payment'];

  useEffect(() => {
    loadOrders();
    if (paymentId) {
      loadPaymentData();
    } else {
      // Generate new payment ID
      const newPaymentId = `PAY-${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, paymentid: newPaymentId }));
    }
  }, [paymentId]);

  const loadOrders = async () => {
    try {
      const ordersData = await getAllData('orders');
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      const paymentData = await getDataById('payments', paymentId);
      if (paymentData) {
        setFormData({
          paymentid: paymentData.paymentid || '',
          orderid: paymentData.orderid || '',
          customer: paymentData.customer || '',
          date: paymentData.date || new Date().toISOString().split('T')[0],
          amount: paymentData.amount || '',
          status: paymentData.status || 'Pending',
          method: paymentData.method || 'Cash',
          action: paymentData.action || 'Payment'
        });
      }
    } catch (error) {
      setError('Failed to load payment data');
      console.error('Error loading payment:', error);
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

    // Auto-fill customer when order is selected
    if (name === 'orderid') {
      const selectedOrder = orders.find(order => order.id === value);
      if (selectedOrder) {
        setFormData(prev => ({
          ...prev,
          customer: selectedOrder.customer || '',
          amount: selectedOrder.amount || prev.amount
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const paymentData = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (paymentId) {
        // Update existing payment
        await updateData('payments', paymentId, paymentData);
      } else {
        // Create new payment
        await addData('payments', paymentData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      setError('Failed to save payment');
      console.error('Error saving payment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && paymentId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading payment data...</p>
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
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>{paymentId ? 'Edit Payment' : 'Add New Payment'}</h3>
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
                Payment ID:
              </label>
              <input
                type="text"
                name="paymentid"
                value={formData.paymentid}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
                readOnly={!!paymentId}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Order ID:
              </label>
              <select
                name="orderid"
                value={formData.orderid}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              >
                <option value="">Select Order</option>
                {orders.map(order => (
                  <option key={order.id} value={order.id}>
                    {order.orderid} - {order.customer}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Customer:
              </label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
                placeholder="Customer name"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Date:
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Amount ($):
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Payment Method:
              </label>
              <select
                name="method"
                value={formData.method}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              >
                {methodOptions.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Action:
              </label>
              <select
                name="action"
                value={formData.action}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              >
                {actionOptions.map(action => (
                  <option key={action} value={action}>{action}</option>
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
              {loading ? 'Saving...' : (paymentId ? 'Update Payment' : 'Create Payment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
