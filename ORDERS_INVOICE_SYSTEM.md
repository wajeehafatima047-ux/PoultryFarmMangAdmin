# Chicken Orders & Invoice Management System

## Overview
Complete order processing and invoice management system with automatic accounting integration.

## Features Implemented

### ✅ Daily Chicken Rate Management
- Set daily selling prices per breed
- View today's active rate prominently
- Historical rate tracking
- Auto-populated in order forms

### ✅ Orders Management
- **Order Placement**: Customer details, delivery/pickup, breed selection
- **Status Tracking**: Pending → Approved → Packed → OutForDelivery → Delivered
- **Cancellation**: Restore inventory automatically
- **Auto-pricing**: Uses latest daily rate
- **Real-time status updates**

### ✅ Invoice Management
- **Unified Invoice System**: All transaction types
- **Invoice Details**: View linked transaction data
- **Print & Export**: Invoice printing and PDF export ready
- **Invoice Filtering**: By type and search
- **Total Revenue Tracking**

## Database Collections

### DailyChickenRate
```javascript
{
  date: timestamp,
  breed: string,
  pricePerUnit: number
}
```

### Orders
```javascript
{
  orderId: string,
  customerName: string,
  customerPhone: string,
  deliveryType: "delivery" | "pickup",
  address: string, // only if delivery
  breed: string,
  quantitySold: number,
  pricePerUnit: number,
  totalAmount: number,
  orderStatus: "Pending" | "Approved" | "Packed" | "OutForDelivery" | "Delivered" | "Cancelled",
  saleDate: timestamp,
  invoiceId: string
}
```

### Invoices
```javascript
{
  invoiceId: string,
  invoiceType: "FeedPurchase" | "ChickenPurchase" | "ChickenSale" | "Salary",
  referenceId: string,
  date: timestamp,
  totalAmount: number,
  createdBy: string
}
```

## Workflow Rules

### Order Status Flow
```
Pending → Approved → Packed → OutForDelivery → Delivered
                ↘ Cancelled (restores inventory)
```

### On Order Creation
1. ✅ Decrease ChickenInventory automatically
2. ✅ Create Invoice entry
3. ✅ Create Receipt entry (Income)

### On Order Cancellation
1. ✅ Restore ChickenInventory
2. ✅ Remove from Orders collection
3. ⚠️ Note: Related invoice/receipt remain for audit

## Business Rules - Accounting Integration

| Action | Inventory | Expense | Receipt | Invoice |
|--------|-----------|---------|---------|---------|
| Buy Feed | + | ✅ | ❌ | ✅ |
| Buy Chickens | + | ✅ | ❌ | ✅ |
| Sell Chickens (Order) | − | ❌ | ✅ | ✅ |
| Pay Salaries | ❌ | ✅ | ❌ | ✅ |

**Profit Calculation**: Total Receipts − Total Expenses

## UI Features

### Daily Rate Page
- **Today's Active Rate** highlight box
- Today's date auto-set
- Breed-based rate tracking
- Historical rate table

### Orders Page
- **Order Form**: Customer info, delivery type, breed selection
- **Auto-price**: Latest daily rate auto-fills
- **Status Dropdown**: Direct status updates per order
- **Cancel Button**: Restores inventory
- **Search & Filter**: By customer, status, order ID

### Invoices Page
- **Invoice List**: All invoice types
- **Total Revenue** KPI
- **View Details**: Click to see linked transaction
- **Print Function**: Browser print dialog
- **Export PDF**: Ready for PDF library integration

## Navigation Structure

Updated sidebar with new menu items:

```
Dashboard
Employee
Feed Management
  ├─ Feed Purchase
  ├─ Feed Usage
  └─ Feed Inventory
Medicine Management
  ├─ Medicine Purchase
  ├─ Medicine Usage
  └─ Medicine Inventory
Chicken Management
  ├─ Chicken Purchase
  ├─ Chicken Inventory
  ├─ Orders ✨
  └─ Daily Rates ✨
Invoices ✨
Settings
```

## Technical Implementation

### Auto-Price Integration
- Orders page loads latest daily rates on mount
- Breed selection triggers price auto-fill
- Manual override supported

### Status Management
- Color-coded status dropdowns
- Disabled on Delivered/Cancelled
- Real-time database updates

### Inventory Restoration
- On cancellation, finds breed in inventory
- Adds back quantity sold
- Updates lastModified timestamp

### Invoice Generation
- Automatic on order creation
- Links to order reference
- System-generated ID

## File Structure
```
src/pages/
├── DailyChickenRate.jsx ✨
├── Orders.jsx ✨
├── Invoices.jsx ✨
├── PurchaseChicken.jsx
├── ChickenInventory.jsx
├── FeedPurchase.jsx
├── Employee.jsx
└── ...other pages

src/components/
└── sidebar.jsx (updated)

src/App.jsx (updated routes)
```

## Future Enhancements
- PDF generation library integration
- Email invoice delivery
- Automated status notifications
- Order history analytics
- Customer management module
- Bulk order processing

## Testing Checklist
- ✅ Set daily rate
- ✅ Place order with auto-price
- ✅ Update order status
- ✅ Cancel order (inventory restored)
- ✅ View all invoices
- ✅ Print invoice
- ✅ Search and filter orders
- ✅ Verify accounting entries

