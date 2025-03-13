import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/global.css';

const Sales = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [saleDate, setSaleDate] = useState('');
  const [editSaleId, setEditSaleId] = useState<string | null>(null);

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await api.get('/sales');
      setSales(response.data);
    } catch (error) {
      alert('Failed to fetch sales');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      alert('Failed to fetch products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editSaleId) {
        // Update existing sale
        await api.put(`/sales/${editSaleId}`, { productId, quantity, saleDate });
        setEditSaleId(null);
      } else {
        // Add new sale
        await api.post('/sales', { productId, quantity, saleDate });
      }
      fetchSales(); // Refresh sales list
      setProductId('');
      setQuantity(1);
      setSaleDate('');
    } catch (error) {
      alert('Failed to save sale');
    }
  };

  const handleEdit = (sale: any) => {
    setProductId(sale.product._id);
    setQuantity(sale.quantity);
    setSaleDate(sale.saleDate);
    setEditSaleId(sale._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/sales/${id}`);
      fetchSales(); // Refresh sales list
    } catch (error) {
      alert('Failed to delete sale');
    }
  };

  return (
    <div className="container">
      <h1>Sales</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="product">Select Product</label>
            <select
              id="product"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a product
              </option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} (${product.price})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="saleDate">Sale Date</label>
            <input
              type="date"
              id="saleDate"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            {editSaleId ? 'Update Sale' : 'Add Sale'}
          </button>
          {editSaleId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setProductId('');
                setQuantity(1);
                setSaleDate('');
                setEditSaleId(null);
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>
      <h2>Sales History</h2>
      {sales.length === 0 ? (
        <p className="no-data">No data available</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Sale Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id}>
                <td>{sale.product?.name}</td>
                <td>{sale.quantity}</td>
                <td>${sale.totalPrice}</td>
                <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(sale)}>Edit</button>
                  <button onClick={() => handleDelete(sale._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Sales;