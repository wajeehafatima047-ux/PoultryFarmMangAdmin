import React, { useState, useEffect } from 'react';
import { addData, updateData } from '../Helper/firebaseHelper';

const OrderForm = ({ order, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    product: 'Chicken - Whole',
    quantity: 1,
    chickenInKg: 1,
    price: 0,
    status: 'Pending',
    paymentStatus: 'Unpaid',
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customerName || '',
        phone: order.phone || '',
        address: order.address || '',
        product: order.product || 'Chicken - Whole',
        quantity: order.quantity || 1,
        price: order.price || 0,
        status: order.status || 'Pending',
        paymentStatus: order.paymentStatus || 'Unpaid',
        orderDate: order.orderDate || new Date().toISOString().split('T')[0],
        deliveryDate: order.deliveryDate || '',
        notes: order.notes || ''
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' || name === 'chickenInKg' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderData = {
        ...formData,
        total: formData.quantity * formData.price,
        updatedAt: new Date().toISOString()
      };

      if (order && order.id) {
        await updateData('orders', order.id, orderData);
      } else {
        await addData('orders', {
          ...orderData,
          createdAt: new Date().toISOString(),
          orderNumber: `ORD-${Date.now()}`
        });
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order');
    } finally {
      setLoading(false);
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
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        width: '100%',
        maxWidth: '42rem',
        maxHeight: '90vh',
        overflowY: 'auto',
        margin: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {order ? 'Edit Order' : 'Add New Order'}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Product *</label>
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="Chicken - Whole">Chicken - Whole</option>
                  <option value="Chicken - Boneless">Chicken - Boneless</option>
                  <option value="Chicken - Legs">Chicken - Legs</option>
                  <option value="Chicken - Wings">Chicken - Wings</option>
                  <option value="Chicken - Breast">Chicken - Breast</option>
                  <option value="Chicken - Thighs">Chicken - Thighs</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  step="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Chicken (kg) *</label>
                <input
                  type="number"
                  name="chickenInKg"
                  min="0.1"
                  step="0.1"
                  value={formData.chickenInKg}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Price per kg (PKR) *</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount (PKR)</label>
                <div className="mt-1 p-2 bg-gray-100 rounded-md">
                  {(formData.chickenInKg * formData.price).toFixed(2)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Order Date</label>
                <input
                  type="date"
                  name="orderDate"
                  value={formData.orderDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Delivery Date</label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Any special instructions or notes..."
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Saving...' : order ? 'Update Order' : 'Create Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
