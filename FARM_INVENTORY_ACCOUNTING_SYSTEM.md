# Farm Inventory & Accounting Management System

## Overview
A comprehensive management system for farm inventory tracking with automatic stock adjustments and alerts.

## Features Implemented

### ✅ Feed Management
- **Feed Purchase**: Record feed purchases with vendor details, quantities, pricing
- **Feed Usage**: Track feed consumption by animal groups
- **Feed Inventory**: Monitor current stock levels with low stock alerts

### ✅ Medicine Management
- **Medicine Purchase**: Record medicine purchases with expiry dates
- **Medicine Usage**: Track medicine consumption by animal groups
- **Medicine Inventory**: Monitor stock levels and expiry warnings

## Database Structure (Firestore Collections)

### FeedPurchases
```javascript
{
  vendorId: string,
  itemName: string,
  quantityPurchased: number,
  unit: string, // "kg", "bags", "tons"
  pricePerUnit: number,
  totalCost: number,
  purchaseDate: Timestamp,
  invoiceId: string
}
```

### FeedUsage
```javascript
{
  animalGroup: string,
  quantityUsed: number,
  unit: string,
  usedBy: string,
  usageDate: Timestamp
}
```

### FeedInventory
```javascript
{
  itemName: string,
  totalInStock: number,
  unit: string,
  lastUpdated: Timestamp
}
```

### MedicinePurchases
```javascript
{
  vendorId: string,
  medicineName: string,
  quantityPurchased: number,
  unit: string, // "units", "boxes", "bottles", "packs"
  expiryDate: Timestamp,
  pricePerUnit: number,
  totalCost: number,
  purchaseDate: Timestamp,
  invoiceId: string
}
```

### MedicineUsage
```javascript
{
  animalGroup: string,
  medicineName: string,
  quantityUsed: number,
  unit: string,
  usageDate: Timestamp
}
```

### MedicineInventory
```javascript
{
  medicineName: string,
  totalInStock: number,
  unit: string,
  expiryDate: Timestamp,
  lastUpdated: Timestamp
}
```

## Automatic Features

### 1. Inventory Adjustments
- When feed/medicine is purchased → stock automatically increases
- When feed/medicine is used → stock automatically decreases
- Real-time inventory updates without manual intervention

### 2. Stock Alerts
- **Feed**: Low stock alert when inventory < 100 units
- **Medicine**: Low stock alert when inventory < 10 units
- Visual indicators (⚠️) and warning messages

### 3. Expiry Warnings
- Medicine expiring within 30 days highlighted in red
- Automatic calculation of days until expiry
- Alert notifications for expiring inventory

### 4. Form Validation
- Required field validation
- Number input validation
- Date validation
- Stock availability checks before usage

### 5. Data Tables
- Pagination (10 items per page)
- Search functionality
- Responsive design

## Navigation Structure

### Sidebar Dropdowns
1. **Feed Management**
   - Feed Purchase
   - Feed Usage
   - Feed Inventory

2. **Medicine Management**
   - Medicine Purchase
   - Medicine Usage
   - Medicine Inventory

## Technology Stack
- **Frontend**: React 19.1.0
- **Routing**: React Router DOM 7.6.1
- **Database**: Firebase Firestore
- **State Management**: Redux Toolkit
- **Notifications**: React Toastify
- **Icons**: React Icons

## File Structure
```
src/
├── pages/
│   ├── FeedPurchase.jsx
│   ├── FeedUsage.jsx
│   ├── FeedInventory.jsx
│   ├── MedicinePurchase.jsx
│   ├── MedicineUsage.jsx
│   └── MedicineInventory.jsx
├── components/
│   └── sidebar.jsx
├── Helper/
│   └── firebaseHelper.js
└── App.jsx
```

## Usage Instructions

### Adding Feed Purchase
1. Navigate to Feed Management → Feed Purchase
2. Click "Add Purchase"
3. Fill in vendor ID, item name, quantity, price, and date
4. System automatically calculates total cost
5. Stock is updated automatically

### Recording Feed Usage
1. Navigate to Feed Management → Feed Usage
2. Click "Record Usage"
3. Select feed item from dropdown (shows available stock)
4. Enter quantity used and animal group
5. System validates stock availability
6. Stock is decreased automatically

### Viewing Feed Inventory
1. Navigate to Feed Management → Feed Inventory
2. View all feed items with current stock
3. Low stock items highlighted in red
4. Edit or delete items as needed

### Recording Medicine Purchase
1. Navigate to Medicine Management → Medicine Purchase
2. Click "Add Purchase"
3. Fill in vendor ID, medicine name, quantity, price, and expiry date
4. System automatically calculates total cost
5. Stock is updated automatically

### Recording Medicine Usage
1. Navigate to Medicine Management → Medicine Usage
2. Click "Record Usage"
3. Select medicine from dropdown (shows available stock)
4. Enter quantity used and animal group
5. System validates stock availability
6. Stock is decreased automatically

### Viewing Medicine Inventory
1. Navigate to Medicine Management → Medicine Inventory
2. View all medicine items with current stock
3. Low stock items highlighted in red
4. Expiring items highlighted in red
5. Edit or delete items as needed

## Security & Data Integrity
- All data stored securely in Firebase
- Timestamp-based audit trails
- Automatic inventory validation
- Stock availability checks
- Form validation on all inputs

## Future Enhancements
- Advanced analytics and charts
- Expense reporting module
- Vendor management module
- Email notifications for alerts
- Mobile app version
- Barcode scanning for inventory

## Support
For issues or questions, refer to the main README.md file or contact the development team.