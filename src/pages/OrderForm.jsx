import React, { useState, useEffect } from 'react';
import { addData, updateData, getDataById } from '../Helper/firebaseHelper';

const OrderForm = ({ orderId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    orderid: '',
    customer: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    status: 'Pending',
    items: '',
    payments: 'Unpaid'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statusOptions = ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];
  const paymentOptions = ['Paid', 'Unpaid', 'Partial'];

  useEffect(() => {
    if (orderId) {
      loadOrderData();
    } else {
      // Generate new order ID
      const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, orderid: newOrderId }));
    }
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      const orderData = await getDataById('orders', orderId);
      if (orderData) {
        setFormData({
          orderid: orderData.orderid || '',
          customer: orderData.customer || '',
          date: orderData.date || new Date().toISOString().split('T')[0],
          amount: orderData.amount || '',
          status: orderData.status || 'Pending',
          items: orderData.items || '',
          payments: orderData.payments || 'Unpaid'
        });
      }
    } catch (error) {
      setError('Failed to load order data');
      console.error('Error loading order:', error);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (orderId) {
        // Update existing order
        await updateData('orders', orderId, orderData);
      } else {
        // Create new order
        await addData('orders', orderData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      setError('Failed to save order');
      console.error('Error saving order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && orderId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading order data...</p>
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
          <h3>{orderId ? 'Edit Order' : 'Add New Order'}</h3>
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
                Order ID:
              </label>
              <input
                type="text"
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
                readOnly={!!orderId}
              />
            </div>

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
                placeholder="Enter customer name"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
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

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Payment Status:
              </label>
              <select
                name="payments"
                value={formData.payments}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              >
                {paymentOptions.map(payment => (
                  <option key={payment} value={payment}>{payment}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Items:
            </label>
            <textarea
              name="items"
              value={formData.items}
              onChange={handleInputChange}
              required
              rows="3"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px',
                resize: 'vertical'
              }}
              placeholder="Enter items description (e.g., 10 Chickens, 2 Feed Bags)"
            />
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
              {loading ? 'Saving...' : (orderId ? 'Update Order' : 'Create Order')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;


