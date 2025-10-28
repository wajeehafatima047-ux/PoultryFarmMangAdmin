import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { addData, getDataById, updateData } from '../Helper/firebaseHelper';

function ExpenseTypeForm({ typeId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    typeId: '',
    title: '',
    description: '',
    createdDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (typeId) {
      loadTypeData();
    } else {
      // Generate unique type ID for new type
      generateTypeId();
    }
  }, [typeId]);

  const generateTypeId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setFormData(prev => ({ ...prev, typeId: `EXP-${timestamp}${random}` }));
  };

  const loadTypeData = async () => {
    try {
      setLoading(true);
      const data = await getDataById('expenseTypes', typeId);
      if (data) {
        setFormData({
          typeId: data.typeId || '',
          title: data.title || '',
          description: data.description || '',
          createdDate: data.createdDate || new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error loading expense type:', error);
      alert('Failed to load expense type data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.typeId.trim()) {
      newErrors.typeId = 'Type ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const dataToSave = {
        typeId: formData.typeId,
        title: formData.title,
        description: formData.description,
        createdDate: formData.createdDate,
        updatedAt: new Date().toISOString()
      };

      if (typeId) {
        // Update existing type
        await updateData('expenseTypes', typeId, dataToSave);
        alert('Expense type updated successfully!');
      } else {
        // Add new type
        await addData('expenseTypes', dataToSave);
        alert('Expense type added successfully!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving expense type:', error);
      alert('Failed to save expense type. Please try again.');
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
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          <FiX />
        </button>

        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>
          {typeId ? 'Edit Expense Type' : 'Add New Expense Type'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Type ID <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="typeId"
              value={formData.typeId}
              onChange={handleChange}
              readOnly={!!typeId}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: `1px solid ${errors.typeId ? 'red' : '#ddd'}`,
                fontSize: '14px',
                backgroundColor: typeId ? '#f5f5f5' : 'white'
              }}
            />
            {errors.typeId && <span style={{ color: 'red', fontSize: '12px' }}>{errors.typeId}</span>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Title <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter expense type title"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: `1px solid ${errors.title ? 'red' : '#ddd'}`,
                fontSize: '14px'
              }}
            />
            {errors.title && <span style={{ color: 'red', fontSize: '12px' }}>{errors.title}</span>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description (optional)"
              rows="4"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Created Date
            </label>
            <input
              type="date"
              name="createdDate"
              value={formData.createdDate}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '5px',
                border: '1px solid #ddd',
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
                borderRadius: '5px',
                border: 'none',
                backgroundColor: loading ? '#ccc' : '#007bff',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {loading ? 'Saving...' : (typeId ? 'Update Type' : 'Add Type')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseTypeForm;
