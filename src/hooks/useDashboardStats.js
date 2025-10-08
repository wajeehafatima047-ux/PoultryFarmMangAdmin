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
        
        // Calculate revenue (sum of all order amounts)
        const revenue = ordersData.reduce((sum, order) => {
          return sum + (parseFloat(order.amount) || 0);
        }, 0);
        
        // Get recent orders (last 5)
        const recentOrders = ordersData
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setStats(prev => ({
          ...prev,
          totalOrders,
          revenue,
          recentOrders,
          loading: false
        }));
      }, (error) => {
        console.error('Error fetching orders:', error);
        setStats(prev => ({ ...prev, error: error.message, loading: false }));
      });
      unsubscribers.push(unsubOrders);

      // Listen to chicken sales collection
      const chickenSalesQuery = query(collection(db, 'chickenSales'));
      const unsubChickenSales = onSnapshot(chickenSalesQuery, (snapshot) => {
        const salesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Calculate total chicken sales
        const chickenSales = salesData.reduce((sum, sale) => {
          return sum + (parseInt(sale.quantity) || 0);
        }, 0);

        setStats(prev => ({
          ...prev,
          chickenSales,
          loading: false
        }));
      }, (error) => {
        console.error('Error fetching chicken sales:', error);
      });
      unsubscribers.push(unsubChickenSales);

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

    // Listen to orders for income
    const ordersQuery = query(collection(db, 'orders'));
    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const totalIncome = ordersData
        .filter(order => order.payments === 'Paid')
        .reduce((sum, order) => sum + (parseFloat(order.amount) || 0), 0);

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
    unsubscribers.push(unsubOrders);

    // Listen to payroll for expenses
    const payrollQuery = query(collection(db, 'payroll'));
    const unsubPayroll = onSnapshot(payrollQuery, (snapshot) => {
      const payrollData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const payrollExpenses = payrollData
        .filter(pay => pay.status === 'Paid')
        .reduce((sum, pay) => sum + (parseFloat(pay.netSalary) || 0), 0);

      setFinancials(prev => {
        const totalExpenses = payrollExpenses;
        const netProfit = prev.totalIncome - totalExpenses;
        return {
          ...prev,
          totalExpenses,
          netProfit,
          loading: false
        };
      });
    });
    unsubscribers.push(unsubPayroll);

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  return financials;
};
