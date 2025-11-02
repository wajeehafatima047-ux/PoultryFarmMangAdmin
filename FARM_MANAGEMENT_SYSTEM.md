# Farm Management & Accounting System

## Overview
A comprehensive farm management system with inventory tracking, accounting automation, employee management, and real-time dashboard analytics.

## Features Implemented

### ✅ Employee Management
- **Employee CRUD**: Create, Edit, Delete employees
- **Attendance Tracking**: Daily attendance recording (Present/Absent/Leave)
- **Salary Management**: Track and record salary payments
- Auto-record salary expense when salary is issued

### ✅ Feed Management
- **Feed Purchase**: Record purchases with vendor details
- **Feed Usage**: Track consumption by animal groups
- **Feed Inventory**: Auto-updated stock levels with low stock alerts

### ✅ Medicine Management
- **Medicine Purchase**: Record purchases with expiry tracking
- **Medicine Usage**: Track consumption by animal groups
- **Medicine Inventory**: Stock levels with expiry warnings (30-day alerts)

### ✅ Chicken Management
- **Chicken Purchase**: Record purchases with breed tracking
- **Chicken Inventory**: Auto-adjusted stock levels
- **Chicken Sales**: Record orders with customer details
- Auto-decrease inventory on sales

### ✅ Accounting: Expenses & Receipts (Auto-Tracked)
Automatically triggered by actions:
- **Feed Purchase** → Creates Expense
- **Chicken Purchase** → Creates Expense
- **Salary Payment** → Creates Expense
- **Chicken Sales** → Creates Receipt (Income)

**Profit Calculation**: Total Receipts − Total Expenses

### ✅ Dashboard (Analytics Overview)
- Total Feed in Stock
- Total Chickens in Stock
- Monthly Feed Expense
- Monthly Chicken Expense
- Salary Expense
- Total Income from Sales
- Net Profit
- Attendance graph
- Latest 10 Orders

## Database Structure (Firestore Collections)

### Employees
```javascript
{
  employeeId: string,
  name: string,
  role: string,
  phone: string,
  salary: number
}
```

### Attendance
```javascript
{
  employeeId: string,
  date: date,
  status: string // "Present" / "Absent" / "Leave"
}
```

### SalaryPayments
```javascript
{
  employeeId: string,
  employeeName: string,
  salaryMonth: string, // YYYY-MM
  amount: number,
  paymentMethod: string, // "cash" / "bank" / "cheque"
  paymentDate: timestamp,
  invoiceId: string
}
```

### FeedPurchases
```javascript
{
  vendorId: string,
  itemName: string,
  quantityPurchased: number,
  unit: string, // "kg", "bags", "tons"
  pricePerUnit: number,
  totalCost: number,
  purchaseDate: timestamp,
  invoiceId: string
}
```

### FeedUsage
```javascript
{
  animalGroup: string,
  quantityUsed: number,
  unit: string,
  usageDate: timestamp
}
```

### FeedInventory
```javascript
{
  itemName: string,
  totalInStock: number,
  unit: string,
  lastUpdated: timestamp
}
```

### MedicinePurchases
```javascript
{
  vendorId: string,
  medicineName: string,
  quantityPurchased: number,
  unit: string,
  expiryDate: timestamp,
  pricePerUnit: number,
  totalCost: number,
  purchaseDate: timestamp,
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
  usageDate: timestamp
}
```

### MedicineInventory
```javascript
{
  medicineName: string,
  totalInStock: number,
  unit: string,
  expiryDate: timestamp,
  lastUpdated: timestamp
}
```

### ChickenPurchases
```javascript
{
  vendorId: string,
  breed: string,
  quantityPurchased: number,
  pricePerUnit: number,
  totalCost: number,
  purchaseDate: timestamp,
  invoiceId: string
}
```

### ChickenInventory
```javascript
{
  breed: string,
  totalInStock: number,
  lastUpdated: timestamp
}
```

### Orders
```javascript
{
  customerName: string,
  customerPhone: string,
  breed: string,
  quantitySold: number,
  pricePerUnit: number,
  totalAmount: number,
  saleDate: timestamp,
  invoiceId: string
}
```

### Expenses
```javascript
{
  category: string, // "feedPurchase", "chickenPurchase", "salary"
  referenceId: string,
  description: string,
  amount: number,
  date: timestamp,
  createdBy: string
}
```

### Receipts
```javascript
{
  referenceId: string,
  description: string,
  amount: number,
  date: timestamp,
  createdBy: string
}
```

## Automatic Features

### Inventory Adjustments
- **Feed/Medicine Purchase** → Stock increases automatically
- **Feed/Medicine Usage** → Stock decreases automatically
- **Chicken Purchase** → Inventory increases automatically
- **Chicken Sales** → Inventory decreases automatically

### Stock Alerts
- **Feed**: Low stock alert when inventory < 100 units
- **Medicine**: Low stock alert when inventory < 10 units
- **Chicken**: Low stock alert when inventory < 50 units
- Visual indicators (⚠️) and toast notifications

### Expiry Warnings
- Medicine expiring within 30 days highlighted
- Automatic calculation of days until expiry
- Alert notifications

### Automatic Accounting
- **Expenses** auto-created for:
  - Feed purchases
  - Chicken purchases
  - Salary payments
- **Receipts** auto-created for:
  - Chicken sales
- Real-time profit calculations

### Form Validation
- Required field validation
- Number input validation
- Date validation
- Stock availability checks

### Data Tables
- Pagination (10 items per page)
- Search functionality
- Date range filtering
- Status filtering

## Navigation Structure

### Sidebar Menu
1. **Dashboard** - Analytics overview
2. **Employee** - Employee management
3. **Feed Management**
   - Feed Purchase
   - Feed Usage
   - Feed Inventory
4. **Medicine Management**
   - Medicine Purchase
   - Medicine Usage
   - Medicine Inventory
5. **Chicken Management**
   - Chicken Purchase
   - Chicken Inventory
   - Chicken Sales
6. **Settings**

## Technology Stack
- **Frontend**: React 19.1.0
- **Routing**: React Router DOM 7.6.1
- **Database**: Firebase Firestore
- **State Management**: Redux Toolkit
- **Notifications**: React Toastify
- **Charts**: React Minimal Pie Chart, Recharts
- **Icons**: React Icons
- **Build Tool**: Vite

## File Structure
```
src/
├── pages/
│   ├── Home.jsx (Dashboard)
│   ├── Employee.jsx
│   ├── EmployeeForm.jsx
│   ├── EmployeeAttendanceForm.jsx
│   ├── EmployeePaymentForm.jsx
│   ├── FeedPurchase.jsx
│   ├── FeedUsage.jsx
│   ├── FeedInventory.jsx
│   ├── MedicinePurchase.jsx
│   ├── MedicineUsage.jsx
│   ├── MedicineInventory.jsx
│   ├── PurchaseChicken.jsx
│   ├── PurchaseChickenForm.jsx
│   ├── ChickenInventory.jsx
│   ├── ChickenSales.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── Setting.jsx
├── components/
│   ├── sidebar.jsx
│   └── OrderForm.jsx
├── Helper/
│   └── firebaseHelper.js
├── hooks/
│   └── useDashboardStats.js
├── redux/
│   ├── Slices/
│   │   └── HomeDataSlice.js
│   └── store/
│       └── index.js
├── App.jsx
└── main.jsx
```

## Usage Instructions

### Employee Management
1. Navigate to **Employee** in sidebar
2. Use tabs to switch between Employees, Attendance, and Payroll
3. Add new employee: Fill in details and save
4. Record attendance: Select date and employee, mark status
5. Record salary: Select employee, month, amount, and payment method

### Feed Management
1. **Purchase**: Record feed purchases with vendor, quantity, and price
2. **Usage**: Select feed type and record consumption
3. **Inventory**: View stock levels with automatic alerts

### Medicine Management
1. **Purchase**: Record medicine purchases with expiry dates
2. **Usage**: Track medicine consumption by animal groups
3. **Inventory**: Monitor stock and expiry dates

### Chicken Management
1. **Purchase**: Record chicken purchases with breed tracking
2. **Inventory**: View chicken stock by breed
3. **Sales**: Record orders with customer details (auto-decreases inventory)

### Dashboard
View real-time analytics including:
- Stock levels
- Monthly expenses by category
- Total income from sales
- Net profit calculation
- Attendance trends
- Latest orders

## Security & Data Integrity
- Firebase Authentication for user access
- Firestore security rules for data protection
- Timestamp-based audit trails
- Automatic inventory validation
- Stock availability checks
- Form validation on all inputs

## Future Enhancements
- Advanced analytics and reports
- Multi-currency support
- Vendor management module
- Email/SMS notifications for alerts
- Mobile app version
- Barcode scanning for inventory
- Role-based access control

## Support
For issues or questions, refer to Firebase documentation or contact the development team.
