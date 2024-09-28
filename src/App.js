import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from 'react-router-dom';

// Main App component with routing
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route to display the list of products */}
        <Route path="/" element={<ProductList />} />

        {/* Route to display individual product details */}
        <Route path="/products/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
};

// Component to display list of products
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const navigate = useNavigate(); // Replaces useHistory

  useEffect(() => {
    // Fetch all products
    fetch(`https://serv-0de1.onrender.com/api/products`) // Replace with your actual backend URL
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const addProduct = () => {
    fetch(`https://serv-0de1.onrender.com/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newProduct, price: newProductPrice }),
    })
      .then((res) => res.json())
      .then((product) => {
        setProducts([...products, product]);
        setNewProduct(''); // Reset input field
        setNewProductPrice(''); // Reset input field
      })
      .catch((error) => console.error("Error adding product:", error));
  };

  const handleProductClick = (id) => {
    navigate(`/products/${id}`); // Navigate to /products/:id
  };

  return (
    <div>
      <h1>Products List</h1>
      
      {/* Display list of products */}
      <ul>
        {products.map((product) => (
          <li 
            key={product.id} 
            onClick={() => handleProductClick(product.id)} // On click, navigate to product details page
            style={{ cursor: 'pointer', color: 'purple' }} // Styling for clickable items
          >
            {product.name}
          </li>
        ))}
      </ul>

      {/* Input for adding a new product */}
      <input
        type="text"
        value={newProduct}
        onChange={(e) => setNewProduct(e.target.value)}
        placeholder="Enter new product"
      />
      <input
        type="number"
        value={newProductPrice}
        onChange={(e) => setNewProductPrice(e.target.value)}
        placeholder="Enter price of product"
      />
      <button onClick={addProduct}>Add Product</button>
    </div>
  );
};

// Component to display product details based on the id in the URL
const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product details by ID
    fetch(`https://serv-0de1.onrender.com/api/products/${id}`) // Replace with your actual backend URL
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error("Error fetching product details:", error));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h2>Product Details</h2>
      <p><strong>Name:</strong> {product.name}</p>
      <p><strong>Price:</strong> {product.price}€</p>
      <Link to="/">Back to Products List</Link>
    </div>
  );
};

export default App;
