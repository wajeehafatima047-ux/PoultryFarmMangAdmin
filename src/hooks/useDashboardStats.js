// Custom hook for dashboard statistics with real-time Firestore data
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebase';

export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    chickenSales: 0,
    activeEmployees: 0,
    revenue: 0,
    recentOrders: [],
    inventoryLowStock: 0,
    totalFeedStock: 0,
    totalChickenStock: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribers = [];

    try {
      // Listen to orders collection
      const ordersQuery = query(collection(db, 'orders'));
      const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Calculate total orders
        const totalOrders = ordersData.length;
        
        // Calculate revenue from delivered orders only
        const revenue = ordersData
          .filter(order => order.orderStatus === 'Delivered')
          .reduce((sum, order) => {
            return sum + (parseFloat(order.totalAmount) || 0);
          }, 0);
        
        // Calculate total chicken sales quantity
        const chickenSales = ordersData
          .filter(order => order.orderStatus === 'Delivered')
          .reduce((sum, order) => {
            return sum + (parseInt(order.quantitySold) || 0);
          }, 0);
        
        // Get recent orders (last 5)
        const recentOrders = ordersData
          .sort((a, b) => {
            const dateA = a.saleDate?.toDate ? a.saleDate.toDate() : new Date(a.saleDate || 0);
            const dateB = b.saleDate?.toDate ? b.saleDate.toDate() : new Date(b.saleDate || 0);
            return dateB - dateA;
          })
          .slice(0, 5);

        setStats(prev => ({
          ...prev,
          totalOrders,
          revenue,
          chickenSales,
          recentOrders,
          loading: false
        }));
      }, (error) => {
        console.error('Error fetching orders:', error);
        setStats(prev => ({ ...prev, error: error.message, loading: false }));
      });
      unsubscribers.push(unsubOrders);

      // Listen to employees collection
      const employeesQuery = query(collection(db, 'employees'));
      const unsubEmployees = onSnapshot(employeesQuery, (snapshot) => {
        const employeesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Count active employees
        const activeEmployees = employeesData.filter(emp => 
          (emp.status || 'Active') === 'Active'
        ).length;

        setStats(prev => ({
          ...prev,
          activeEmployees,
          loading: false
        }));
      }, (error) => {
        console.error('Error fetching employees:', error);
      });
      unsubscribers.push(unsubEmployees);

      // Listen to inventory collection
      const inventoryQuery = query(collection(db, 'inventory'));
      const unsubInventory = onSnapshot(inventoryQuery, (snapshot) => {
        const inventoryData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Count low stock items
        const inventoryLowStock = inventoryData.filter(item => 
          item.status === 'Low Stock' || item.status === 'Out of Stock'
        ).length;

        setStats(prev => ({
          ...prev,
          inventoryLowStock,
          loading: false
        }));
      }, (error) => {
        console.error('Error fetching inventory:', error);
      });
      unsubscribers.push(unsubInventory);

      // Listen to feed inventory
      const feedInventoryQuery = query(collection(db, 'feedInventory'));
      const unsubFeedInventory = onSnapshot(feedInventoryQuery, (snapshot) => {
        const feedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const totalFeedStock = feedData.reduce((sum, item) => {
          return sum + (parseFloat(item.totalInStock) || 0);
        }, 0);

        setStats(prev => ({
          ...prev,
          totalFeedStock,
          loading: false
        }));
      }, (error) => {
        console.error('Error fetching feed inventory:', error);
      });
      unsubscribers.push(unsubFeedInventory);

      // Listen to chicken inventory
      const chickenInventoryQuery = query(collection(db, 'chickenInventory'));
      const unsubChickenInventory = onSnapshot(chickenInventoryQuery, (snapshot) => {
        const chickenData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const totalChickenStock = chickenData.reduce((sum, item) => {
          return sum + (parseFloat(item.totalInStock) || 0);
        }, 0);

        setStats(prev => ({
          ...prev,
          totalChickenStock,
          loading: false
        }));
      }, (error) => {
        console.error('Error fetching chicken inventory:', error);
      });
      unsubscribers.push(unsubChickenInventory);

    } catch (error) {
      console.error('Error setting up listeners:', error);
      setStats(prev => ({ ...prev, error: error.message, loading: false }));
    }

    // Cleanup function to unsubscribe from all listeners
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  return stats;
};

// Hook for financial overview
export const useFinancialStats = () => {
  const [financials, setFinancials] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    loading: true
  });

  useEffect(() => {
    const unsubscribers = [];

    // Listen to receipts for income
    const receiptsQuery = query(collection(db, 'receipts'));
    const unsubReceipts = onSnapshot(receiptsQuery, (snapshot) => {
      const receiptsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const totalIncome = receiptsData.reduce((sum, receipt) => {
        return sum + (parseFloat(receipt.amount) || 0);
      }, 0);

      setFinancials(prev => {
        const netProfit = totalIncome - prev.totalExpenses;
        return {
          ...prev,
          totalIncome,
          netProfit,
          loading: false
        };
      });
    });
    unsubscribers.push(unsubReceipts);

    // Listen to expenses
    const expensesQuery = query(collection(db, 'expenses'));
    const unsubExpenses = onSnapshot(expensesQuery, (snapshot) => {
      const expensesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const totalExpenses = expensesData.reduce((sum, expense) => {
        return sum + (parseFloat(expense.amount) || 0);
      }, 0);

      setFinancials(prev => {
        const netProfit = prev.totalIncome - totalExpenses;
        return {
          ...prev,
          totalExpenses,
          netProfit,
          loading: false
        };
      });
    });
    unsubscribers.push(unsubExpenses);

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  return financials;
};
