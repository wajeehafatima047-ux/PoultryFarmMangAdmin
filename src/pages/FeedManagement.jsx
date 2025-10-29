import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, getDoc, updateDoc, getDocs, Timestamp, query, orderBy, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tabs, Tab, Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, CardActions } from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function FeedManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [feedInventory, setFeedInventory] = useState([]);
  const [feedTypes, setFeedTypes] = useState([]);
  
  // Purchase Form State
  const [purchaseData, setPurchaseData] = useState({
    feedType: '',
    quantityKg: '',
    unitPrice: '',
    supplierName: '',
    invoiceId: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  // Usage Form State
  const [usageData, setUsageData] = useState({
    feedType: '',
    quantityUsedKg: '',
    usedBy: '',
    remarks: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Load feed inventory and types
  useEffect(() => {
    loadFeedInventory();
  }, []);

  const loadFeedInventory = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'feedInventory'));
      const inventory = [];
      const types = [];
      
      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        inventory.push(data);
        types.push(doc.id);
      });
      
      setFeedInventory(inventory);
      setFeedTypes(types);
    } catch (error) {
      console.error('Error loading feed inventory:', error);
      toast.error('Failed to load feed inventory');
    }
  };

  // Handle purchase form input changes
  const handlePurchaseInputChange = (e) => {
    const { name, value } = e.target;
    setPurchaseData(prev => ({
      ...prev,
      [name]: name === 'quantityKg' || name === 'unitPrice' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle usage form input changes
  const handleUsageInputChange = (e) => {
    const { name, value } = e.target;
    setUsageData(prev => ({
      ...prev,
      [name]: name === 'quantityUsedKg' ? parseFloat(value) || 0 : value
    }));
  };

  // Add new feed purchase
  const handleAddPurchase = async (e) => {
    e.preventDefault();
    
    try {
      const { feedType, quantityKg, unitPrice, supplierName, invoiceId, purchaseDate } = purchaseData;
      const totalCost = quantityKg * unitPrice;
      
      // Add to purchases collection
      await addDoc(collection(db, 'feedPurchases'), {
        feedType,
        quantityKg,
        unitPrice,
        totalCost,
        supplierName,
        invoiceId,
        purchaseDate: Timestamp.fromDate(new Date(purchaseDate))
      });

      // Update inventory
      await updateFeedInventory(feedType, quantityKg);
      
      // Reset form
      setPurchaseData({
        feedType: '',
        quantityKg: '',
        unitPrice: '',
        supplierName: '',
        invoiceId: '',
        purchaseDate: new Date().toISOString().split('T')[0]
      });
      
      toast.success('Purchase recorded successfully!');
    } catch (error) {
      console.error('Error adding purchase:', error);
      toast.error('Failed to record purchase');
    }
  };

  // Record feed usage
  const handleRecordUsage = async (e) => {
    e.preventDefault();
    
    try {
      const { feedType, quantityUsedKg, usedBy, remarks, date } = usageData;
      
      // Check if enough stock exists
      const inventoryRef = doc(db, 'feedInventory', feedType);
      const inventorySnap = await getDoc(inventoryRef);
      
      if (!inventorySnap.exists() || inventorySnap.data().totalStockKg < quantityUsedKg) {
        toast.error('Insufficient stock!');
        return;
      }
      
      // Add to usage collection
      await addDoc(collection(db, 'feedUsage'), {
        feedType,
        quantityUsedKg,
        usedBy,
        remarks,
        date: Timestamp.fromDate(new Date(date))
      });

      // Update inventory (negative quantity to reduce stock)
      await updateFeedInventory(feedType, -quantityUsedKg);
      
      // Reset form
      setUsageData({
        feedType: '',
        quantityUsedKg: '',
        usedBy: '',
        remarks: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      toast.success('Feed usage recorded successfully!');
    } catch (error) {
      console.error('Error recording usage:', error);
      toast.error('Failed to record feed usage');
    }
  };

  // Update feed inventory (helper function)
  const updateFeedInventory = async (feedType, quantity) => {
    try {
      const inventoryRef = doc(db, 'feedInventory', feedType);
      const inventorySnap = await getDoc(inventoryRef);
      
      if (inventorySnap.exists()) {
        // Update existing inventory
        const currentStock = inventorySnap.data().totalStockKg || 0;
        const newStock = currentStock + quantity;
        
        if (newStock < 0) {
          throw new Error('Insufficient stock!');
        }
        
        await updateDoc(inventoryRef, {
          totalStockKg: newStock,
          lastUpdated: Timestamp.now()
        });
        
        // Show low stock warning
        if (newStock < 50) {
          toast.warning(`Low stock alert for ${feedType}: ${newStock}kg remaining`);
        }
      } else {
        // Create new inventory item
        if (quantity <= 0) {
          throw new Error('Initial stock must be greater than 0');
        }
        
        await setDoc(inventoryRef, {
          totalStockKg: quantity,
          lastUpdated: Timestamp.now()
        });
      }
      
      // Refresh inventory
      await loadFeedInventory();
      
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  };

  return (
    <div className="p-4">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Add Purchase" />
          <Tab label="Record Usage" />
          <Tab label="View Inventory" />
        </Tabs>
      </Box>

      {/* Add Purchase Tab */}
      <TabPanel value={activeTab} index={0}>
        <Card sx={{ maxWidth: 600, margin: '0 auto' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Record New Feed Purchase</Typography>
            <form onSubmit={handleAddPurchase}>
              <TextField
                fullWidth
                margin="normal"
                label="Feed Type"
                name="feedType"
                value={purchaseData.feedType}
                onChange={handlePurchaseInputChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Quantity (kg)"
                name="quantityKg"
                type="number"
                step="0.01"
                value={purchaseData.quantityKg}
                onChange={handlePurchaseInputChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Unit Price (per kg)"
                name="unitPrice"
                type="number"
                step="0.01"
                value={purchaseData.unitPrice}
                onChange={handlePurchaseInputChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Supplier Name"
                name="supplierName"
                value={purchaseData.supplierName}
                onChange={handlePurchaseInputChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Invoice ID (Optional)"
                name="invoiceId"
                value={purchaseData.invoiceId}
                onChange={handlePurchaseInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Purchase Date"
                name="purchaseDate"
                type="date"
                value={purchaseData.purchaseDate}
                onChange={handlePurchaseInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
              <Box mt={2}>
                <Button type="submit" variant="contained" color="primary">
                  Record Purchase
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Record Usage Tab */}
      <TabPanel value={activeTab} index={1}>
        <Card sx={{ maxWidth: 600, margin: '0 auto' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Record Feed Usage</Typography>
            <form onSubmit={handleRecordUsage}>
              <TextField
                fullWidth
                margin="normal"
                select
                label="Feed Type"
                name="feedType"
                value={usageData.feedType}
                onChange={handleUsageInputChange}
                SelectProps={{ native: true }}
                required
              >
                <option value="">Select Feed Type</option>
                {feedTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </TextField>
              <TextField
                fullWidth
                margin="normal"
                label="Quantity Used (kg)"
                name="quantityUsedKg"
                type="number"
                step="0.01"
                value={usageData.quantityUsedKg}
                onChange={handleUsageInputChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Used By (Optional)"
                name="usedBy"
                value={usageData.usedBy}
                onChange={handleUsageInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Remarks (Optional)"
                name="remarks"
                value={usageData.remarks}
                onChange={handleUsageInputChange}
                multiline
                rows={2}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Date"
                name="date"
                type="date"
                value={usageData.date}
                onChange={handleUsageInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
              <Box mt={2}>
                <Button type="submit" variant="contained" color="primary">
                  Record Usage
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </TabPanel>

      {/* View Inventory Tab */}
      <TabPanel value={activeTab} index={2}>
        <Typography variant="h6" gutterBottom>Current Feed Inventory</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Feed Type</TableCell>
                <TableCell align="right">Stock (kg)</TableCell>
                <TableCell>Last Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedInventory.map((item) => (
                <TableRow 
                  key={item.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.id}
                  </TableCell>
                  <TableCell align="right" style={{ color: item.totalStockKg < 50 ? 'red' : 'inherit' }}>
                    {item.totalStockKg.toFixed(2)} kg
                    {item.totalStockKg < 50 && ' (Low Stock!)'}
                  </TableCell>
                  <TableCell>
                    {item.lastUpdated?.toDate ? 
                      item.lastUpdated.toDate().toLocaleString() : 
                      'N/A'}
                  </TableCell>
                </TableRow>
              ))}
              {feedInventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No feed inventory records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </div>
  );
}

export default FeedManagement;
