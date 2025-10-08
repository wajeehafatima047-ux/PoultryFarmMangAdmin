# Firestore Security Rules

## 🔒 Recommended Security Rules for Your Poultry Management System

### Current Setup (Development)
Your Firebase is likely using test mode rules that allow all reads/writes. This is **NOT secure for production**.

---

## 🚨 Production-Ready Security Rules

Copy these rules to your Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read: if isAuthenticated() && isOwner(userId);
      allow write: if isAuthenticated() && isOwner(userId);
    }
    
    // Orders collection - authenticated users can read all, write their own
    match /orders/{orderId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated();
      // In production, you might want to restrict delete to admins only
    }
    
    // Employees collection - authenticated users can read all, admins can write
    match /employees/{employeeId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAuthenticated();
      // Add admin check: && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
    }
    
    // Inventory collection - authenticated users can read all, write all
    match /inventory/{itemId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAuthenticated();
    }
    
    // Chicken Sales collection - authenticated users can read all, write all
    match /chickenSales/{saleId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAuthenticated();
    }
    
    // Payments collection - authenticated users can read all, write all
    match /payments/{paymentId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAuthenticated();
    }
    
    // Payroll collection - authenticated users can read all, write all
    match /payroll/{payrollId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAuthenticated();
    }
    
    // Attendance collection - authenticated users can read all, write all
    match /attendance/{attendanceId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAuthenticated();
    }
  }
}
```

---

## 🎯 Enhanced Rules with Admin Role

If you want to add admin-only operations:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) || isAdmin();
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated();
      allow delete: if isAdmin(); // Only admins can delete orders
    }
    
    // Employees collection
    match /employees/{employeeId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin(); // Only admins manage employees
    }
    
    // Inventory collection
    match /inventory/{itemId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated();
      allow delete: if isAdmin();
    }
    
    // Chicken Sales collection
    match /chickenSales/{saleId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated();
      allow delete: if isAdmin();
    }
    
    // Payments collection
    match /payments/{paymentId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated();
      allow delete: if isAdmin();
    }
    
    // Payroll collection - sensitive data
    match /payroll/{payrollId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin(); // Only admins manage payroll
    }
    
    // Attendance collection
    match /attendance/{attendanceId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated();
      allow delete: if isAdmin();
    }
  }
}
```

---

## 📝 How to Add Admin Role to User

### Step 1: Create Admin User
In Firebase Console → Firestore → `users` collection:

```javascript
{
  uid: "user-firebase-uid-here",
  email: "admin@example.com",
  role: "admin",  // Add this field
  createdAt: "2025-01-15T10:00:00Z"
}
```

### Step 2: Update Your Signup Code
In `src/Helper/firebaseHelper.js`, update the `handleSignUp` function:

```javascript
export const handleSignUp = async (email, password, extraData = {}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userData = {
      uid: user.uid,
      email: user.email,
      role: extraData.role || "user", // Default to "user", can be "admin"
      createdAt: new Date().toISOString(),
      ...extraData,
    };

    await setDoc(doc(db, "users", user.uid), userData);
    return userData;
  } catch (error) {
    console.error("Error signing up:", error.message);
    throw error;
  }
};
```

---

## 🔐 Data Validation Rules

Add validation to ensure data integrity:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Orders with validation
    match /orders/{orderId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && 
                      request.resource.data.keys().hasAll(['orderid', 'customer', 'date', 'amount']) &&
                      request.resource.data.amount is number &&
                      request.resource.data.amount > 0;
      allow update: if isAuthenticated();
      allow delete: if isAuthenticated();
    }
    
    // Employees with validation
    match /employees/{employeeId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && 
                      request.resource.data.keys().hasAll(['employeeId', 'employee', 'salary']) &&
                      request.resource.data.salary is number &&
                      request.resource.data.salary > 0;
      allow update, delete: if isAuthenticated();
    }
    
    // Inventory with validation
    match /inventory/{itemId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && 
                      request.resource.data.keys().hasAll(['name', 'category', 'quantity']) &&
                      request.resource.data.quantity is string;
      allow update, delete: if isAuthenticated();
    }
  }
}
```

---

## 🧪 Testing Security Rules

### Test in Firebase Console
1. Go to Firestore Database → Rules
2. Click "Rules Playground"
3. Test different scenarios:
   - Authenticated user reading orders ✅
   - Unauthenticated user reading orders ❌
   - Admin deleting employee ✅
   - Regular user deleting employee ❌

### Test in Your App
```javascript
// This should work (authenticated user)
const orders = await getAllData('orders');

// This should fail (if not authenticated)
// Will show "Missing or insufficient permissions" error
```

---

## 🚀 Deployment Steps

### Step 1: Update Rules in Firebase Console
1. Go to Firebase Console
2. Select your project
3. Navigate to Firestore Database
4. Click on "Rules" tab
5. Paste the security rules
6. Click "Publish"

### Step 2: Test Thoroughly
- Test all CRUD operations
- Test with different user roles
- Verify authentication works
- Check error handling

### Step 3: Monitor Usage
- Go to Firebase Console → Firestore → Usage
- Monitor read/write operations
- Check for any security violations

---

## ⚠️ Important Security Notes

### DO NOT use these rules in production:
```javascript
// ❌ INSECURE - Allows anyone to read/write
allow read, write: if true;

// ❌ INSECURE - Test mode
allow read, write: if request.time < timestamp.date(2025, 12, 31);
```

### DO use these patterns:
```javascript
// ✅ SECURE - Requires authentication
allow read, write: if request.auth != null;

// ✅ SECURE - Requires specific role
allow write: if request.auth.token.admin == true;

// ✅ SECURE - Validates data
allow create: if request.resource.data.amount > 0;
```

---

## 📊 Rule Complexity Limits

Firestore has limits on rule complexity:
- Maximum 20,000 bytes for rules
- Maximum nesting depth of 10
- Keep rules simple and readable

---

## 🔍 Debugging Rules

### Check Rules in Browser Console
```javascript
// If you see this error:
// "Missing or insufficient permissions"

// It means:
// 1. User is not authenticated, OR
// 2. Security rules deny the operation, OR
// 3. Document doesn't exist
```

### Enable Firestore Debug Mode
```javascript
// In your firebase.js
import { enableIndexedDbPersistence } from 'firebase/firestore';

// Add this for debugging
enableIndexedDbPersistence(db, { synchronizeTabs: true })
  .catch((err) => {
    console.error('Persistence error:', err);
  });
```

---

## ✅ Security Checklist

Before going to production:

- [ ] Remove test mode rules
- [ ] Require authentication for all operations
- [ ] Add role-based access control (admin/user)
- [ ] Validate data types and required fields
- [ ] Test all CRUD operations
- [ ] Test with different user roles
- [ ] Monitor Firebase Console for violations
- [ ] Set up Firebase App Check (optional but recommended)
- [ ] Enable audit logging
- [ ] Review rules regularly

---

## 🎯 Recommended Rule Structure

```
1. Authentication required for ALL operations
2. Read access: All authenticated users
3. Write access: Based on role or ownership
4. Delete access: Admins only (for sensitive data)
5. Data validation: Ensure required fields exist
6. Type checking: Validate data types
```

---

## 📚 Additional Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Security Rules Testing](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [Best Practices](https://firebase.google.com/docs/firestore/security/rules-conditions)

---

**Remember**: Security rules are your first line of defense. Always test thoroughly before deploying to production! 🔒
