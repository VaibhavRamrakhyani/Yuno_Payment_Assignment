
// import React, { useState, useEffect } from 'react';
// import {
//   ShoppingCart, Star, Plus, Minus, CreditCard, User,
//   CheckCircle, AlertCircle, X, Package, Trash2
// } from 'lucide-react';
// import axios from 'axios';
// import "./Styles/testPage.scss";
// import CardForm from './cardPay'; // your Yuno CardForm wrapper

// const ProductStore = () => {
//   // Products
//   const [products] = useState([
//     {
//       id: 1, name: "Premium Wireless Headphones", price: 299.99,
//       originalPrice: 399.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
//       rating: 4.8, reviews: 234, description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
//       sku: "HEAD-001", category: "Electronics"
//     },
//     {
//       id: 2, name: "Smart Fitness Watch", price: 199.99,
//       originalPrice: 249.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
//       rating: 4.6, reviews: 189, description: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.",
//       sku: "WATCH-001", category: "Electronics"
//     },
//     {
//       id: 3, name: "Professional Laptop", price: 1299.99,
//       originalPrice: 1499.99, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
//       rating: 4.9, reviews: 456, description: "High-performance laptop perfect for professionals and creative work.",
//       sku: "LAPTOP-001", category: "Computers"
//     },
//     {
//       id: 4, name: "Wireless Speaker", price: 149.99,
//       originalPrice: 199.99, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
//       rating: 4.5, reviews: 123, description: "Portable wireless speaker with exceptional sound quality and 24-hour battery.",
//       sku: "SPEAKER-001", category: "Audio"
//     }
//   ]);

//   // State
//   const [cart, setCart] = useState([]);
//   const [showCart, setShowCart] = useState(false);
//   const [showCheckout, setShowCheckout] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1); // 1: Customer Info, 2: Payment
//   const [customer, setCustomer] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token') || null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [orderData, setOrderData] = useState(null);
//   const [checkoutSession, setCheckoutSession] = useState(null);
//   const [paymentSession, setPaymentSession] = useState(null); // Add this state

//   const [customerForm, setCustomerForm] = useState({
//     name: '', email: '',
//     address: { street: '', city: '', state: '', zip: '', country: 'US' }
//   });

//   const [paymentForm, setPaymentForm] = useState({
//     cardNumber: '', expiryDate: '', cvv: '', cardholderName: ''
//   });

//   const API_BASE = 'http://localhost:5000/api';

//   // Utility
//   const showMessage = (message, type = 'success') => {
//     if (type === 'error') { setError(message); setSuccess(''); }
//     else { setSuccess(message); setError(''); }
//     setTimeout(() => { setError(''); setSuccess(''); }, 5000);
//   };

//   const calculateDiscount = (original, current) => Math.round(((original - current) / original) * 100);
//   const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);
//   const getSubtotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
//   const getTax = () => getSubtotal() * 0.08;
//   const getShipping = () => getSubtotal() > 100 ? 0 : 9.99;
//   const getTotal = () => getSubtotal() + getTax() + getShipping();

//   // Cart functions
//   const addToCart = (product) => {
//     setCart(prev => {
//       const exist = prev.find(i => i.id === product.id);
//       if (exist) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
//       return [...prev, { ...product, quantity: 1 }];
//     });
//     showMessage(`${product.name} added to cart!`);
//   };

//   const updateQuantity = (id, qty) => {
//     if (qty === 0) { removeFromCart(id); return; }
//     setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
//   };

//   const removeFromCart = (id) => {
//     setCart(prev => prev.filter(i => i.id !== id));
//     showMessage('Item removed from cart');
//   };

//   // Backend calls
//   const createCustomer = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.post(`${API_BASE}/customers`, customerForm);
//       setCustomer(data.user);
//       setToken(data.token);
//       localStorage.setItem('token', data.token);
//       showMessage('Customer created!');
//       return data.user;
//     } catch (err) {
//       showMessage(err.response?.data?.error || 'Failed to create customer', 'error');
//       throw err;
//     } finally { setLoading(false); }
//   };

//   const createOrder = async () => {
//     try {
//       setLoading(true);
//       const payload = {
//         items: cart.map(i => ({
//           name: i.name, description: i.description, price: i.price, quantity: i.quantity, sku: i.sku, category: i.category
//         })),
//         subtotal: getSubtotal(),
//         tax: getTax(),
//         shipping: getShipping(),
//         totalAmount: getTotal(),
//         currency: 'USD',
//         shippingAddress: customerForm.address
//       };
//       const { data } = await axios.post(`${API_BASE}/orders`, payload, { headers: { Authorization: `Bearer ${token}` } });
//       setOrderData(data.order);
//       console.log('Order created:', data.order);
//       showMessage('Order created!');
//       return data.order;
//     } catch (err) {
//       showMessage(err.response?.data?.error || 'Failed to create order', 'error');
//       throw err;
//     } finally { setLoading(false); }
//   };

//   const createCheckoutSession = async (orderId) => {
//     try {
//       setLoading(true);
//       const { data } = await axios.post(`${API_BASE}/payments/checkout-sessions`, { orderId }, { headers: { Authorization: `Bearer ${token}` } });
//       setCheckoutSession(data);
//       showMessage('Checkout session created!');
//       console.log('Checkout session:', data);
//       return data;
//     } catch (err) {
//       showMessage(err.response?.data?.error || 'Failed to create checkout session', 'error');
//       throw err;
//     } finally { setLoading(false); }
//   };

//   // Create initial payment session to get clientSecret
//   const createPaymentSession = async (orderId, customerSession) => {
//     try {
//       setLoading(true);
//       const { data } = await axios.post(
//         `${API_BASE}/payments/create-payment`,
//         { 
//           orderId, 
//           customer_session: customerSession,
//           // Don't include oneTimeToken yet - this is just to initialize
//           oneTimeToken:''
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPaymentSession(data);
//       console.log('Payment session created:', data);
//       return data;
//     } catch (err) {
//       showMessage(err.response?.data?.error || 'Failed to create payment session', 'error');
//       throw err;
//     } finally { setLoading(false); }
//   };
// // Handle Checkout
// const handleCheckout = async () => {
//   try {
//     if (!customer) await createCustomer();
//     const order = await createOrder();
//     const checkoutData = await createCheckoutSession(order._id);
//     console.log('Checkout Data:', checkoutData);

//     // ✅ Only set checkout session here
//     setCheckoutSession(checkoutData);
//     setOrderData(order);
//     setCurrentStep(2);
//   } catch (err) {
//     console.error('Checkout error:', err);
//   }
// };

//   // Handle Checkout
//   // const handleCheckout = async () => {
//   //   try {
//   //     if (!customer) await createCustomer();
//   //     const order = await createOrder();
//   //     const checkoutData = await createCheckoutSession(order._id,);
//   //     console.log('Checkout Data:', checkoutData);
      
//   //     // Create initial payment session to get clientSecret
//   //     const paymentData = await createPaymentSession(order._id, checkoutData.checkoutSession);
      
//   //     setCurrentStep(2);
//   //   } catch (err) {
//   //     console.error('Checkout error:', err);
//   //   }
//   // };

//   const handleCustomerFormChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith('address.')) {
//       const field = name.split('.')[1];
//       setCustomerForm(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
//     } else setCustomerForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handlePayment = async (payment) => {
//   console.log('Payment info received:', payment);

//   if (payment.oneTimeToken) {
//     try {
//       setLoading(true);
//       const { data } = await axios.post(
//         `${API_BASE}/payments/create-payment`,
//         { 
//           orderId: orderData._id, 
//           customer_session: checkoutSession.checkoutSession, 
//           oneTimeToken: payment.oneTimeToken 
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       console.log('Payment processed:', data);
      
//       if (data.status === "APPROVED") {
//         showMessage('Payment Successful!');
//         setCart([]);
//         setShowCheckout(false);
//         setCurrentStep(1); 
//         setOrderData(null); 
//         setCheckoutSession(null); 
//       } else {
//         showMessage(`Payment Failed: ${data.status}`, 'error');
//       }
//     } catch (err) {
//       showMessage(`Payment Error: ${err.response?.data?.error || err.message}`, 'error');
//     } finally {
//       setLoading(false);
//     }
//   }
// };

//   // const handlePayment = async (payment) => {
//   //   console.log('Payment info received:', payment);
//   //   console.log('Order Data:', orderData);
//   //   console.log('Checkout Session:', checkoutSession);
//   //   console.log('Payment Session:', paymentSession);
//   //   if (payment.oneTimeToken) {
//   //     try {
//   //       setLoading(true);
//   //       const { data } = await axios.post(
//   //         `${API_BASE}/payments/create-payment`,
//   //         { 
//   //           orderId: orderData._id, 
//   //           customer_session: checkoutSession.customer_session, 
//   //           oneTimeToken: payment.oneTimeToken 
//   //         },
//   //         { headers: { Authorization: `Bearer ${token}` } }
//   //       );
        
//   //       console.log('Payment processed:', data);
        
//   //       if (data.status === "APPROVED") {
//   //         showMessage('Payment Successful!');
//   //         setCart([]);
//   //         setShowCheckout(false);
//   //         setCurrentStep(1); // Reset for future orders
//   //         setOrderData(null); // Reset order data
//   //         setCheckoutSession(null); // Reset checkout session
//   //         setPaymentSession(null); // Reset payment session
//   //       } else {
//   //         showMessage(`Payment Failed: ${data.status}`, 'error');
//   //       }
//   //     } catch (err) {
//   //       showMessage(`Payment Error: ${err.response?.data?.error || err.message}`, 'error');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }
//   // };

//   // JSX
//   return (
//     <div className="store-container">
//       {/* Header */}
//       <header className="store-header">
//         <div className="header-content">
//           <div className="store-brand">
//             <Package className="store-icon" />
//             <h1 className="store-title">Yuno Store</h1>
//           </div>
//           <button onClick={() => setShowCart(true)} className="cart-button">
//             <ShoppingCart className="cart-icon" />
//             {getTotalItems() > 0 && <span className="cart-badge">{getTotalItems()}</span>}
//           </button>
//         </div>
//       </header>

//       {/* Messages */}
//       {error && (
//         <div className="alert alert-error">
//           <AlertCircle className="alert-icon" />
//           {error}
//           <button onClick={() => setError('')} className="alert-close">
//             <X className="close-icon" />
//           </button>
//         </div>
//       )}
//       {success && (
//         <div className="alert alert-success">
//           <CheckCircle className="alert-icon" />
//           {success}
//           <button onClick={() => setSuccess('')} className="alert-close">
//             <X className="close-icon" />
//           </button>
//         </div>
//       )}

//       {/* Products */}
//       <main className="products-main">
//         <h2 className="products-title">Premium Products</h2>
//         <div className="products-grid">
//           {products.map(p => (
//             <div key={p.id} className="product-card">
//               {p.originalPrice > p.price && (
//                 <div className="discount-badge">-{calculateDiscount(p.originalPrice, p.price)}%</div>
//               )}
//               <img src={p.image} alt={p.name} className="product-image" />
//               <div className="product-info">
//                 <h3 className="product-name">{p.name}</h3>
//                 <div className="rating-stars">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} className={`star ${i < Math.floor(p.rating) ? 'filled' : ''}`} />
//                   ))}
//                   <span className="reviews-count">({p.reviews})</span>
//                 </div>
//                 <p className="product-description">{p.description}</p>
//                 <div className="price-section">
//                   <span className="current-price">${p.price}</span>
//                   {p.originalPrice > p.price && (
//                     <span className="original-price">${p.originalPrice}</span>
//                   )}
//                 </div>
//                 <button onClick={() => addToCart(p)} className="btn btn-primary add-to-cart">
//                   <Plus className="btn-icon" />
//                   Add to Cart
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>

//       {/* Cart Sidebar */}
//       <div className={`cart-sidebar ${showCart ? 'open' : ''}`}>
//         <div className="cart-content">
//           <div className="cart-header">
//             <h3 className="cart-title">Shopping Cart</h3>
//             <button onClick={() => setShowCart(false)} className="cart-close">
//               <X className="close-icon" />
//             </button>
//           </div>
//           {cart.length === 0 ? (
//             <p className="empty-cart">Your cart is empty</p>
//           ) : (
//             <>
//               <div className="cart-items">
//                 {cart.map(i => (
//                   <div key={i.id} className="cart-item">
//                     <img src={i.image} alt={i.name} className="cart-item-image" />
//                     <div className="cart-item-details">
//                       <h4 className="cart-item-name">{i.name}</h4>
//                       <p className="cart-item-price">${i.price}</p>
//                     </div>
//                     <div className="cart-item-controls">
//                       <button 
//                         onClick={() => updateQuantity(i.id, i.quantity - 1)} 
//                         className="quantity-btn"
//                       >
//                         <Minus className="quantity-icon" />
//                       </button>
//                       <span className="quantity-display">{i.quantity}</span>
//                       <button 
//                         onClick={() => updateQuantity(i.id, i.quantity + 1)} 
//                         className="quantity-btn"
//                       >
//                         <Plus className="quantity-icon" />
//                       </button>
//                       <button 
//                         onClick={() => removeFromCart(i.id)} 
//                         className="remove-btn"
//                       >
//                         <Trash2 className="remove-icon" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="cart-summary">
//                 <div className="summary-line">
//                   <span>Subtotal:</span>
//                   <span>${getSubtotal().toFixed(2)}</span>
//                 </div>
//                 <div className="summary-line">
//                   <span>Tax (8%):</span>
//                   <span>${getTax().toFixed(2)}</span>
//                 </div>
//                 <div className="summary-line">
//                   <span>Shipping:</span>
//                   <span>${getShipping().toFixed(2)}</span>
//                 </div>
//                 <div className="summary-total">
//                   <span>Total:</span>
//                   <span>${getTotal().toFixed(2)}</span>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => { setShowCart(false); setShowCheckout(true); }} 
//                 className="btn btn-primary checkout-btn"
//               >
//                 <CreditCard className="btn-icon" />
//                 Checkout
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Checkout Modal */}
//       {showCheckout && (
//         <div className="checkout-modal">
//           <div className="checkout-content">
//             <div className="step-indicator">
//               <div className={`step ${currentStep >= 1 ? 'active' : 'inactive'}`}>
//                 <User className="step-icon" />
//                 Customer Info
//               </div>
//               <div className={`step ${currentStep >= 2 ? 'active' : 'inactive'}`}>
//                 <CreditCard className="step-icon" />
//                 Payment
//               </div>
//             </div>

//             {/* Step 1 - Customer Info */}
//             {currentStep === 1 && (
//               <div className="checkout-step">
//                 <h3 className="step-title">Customer Information</h3>
//                 <div className="form-group">
//                   <label>Full Name</label>
//                   <input 
//                     type="text" 
//                     name="name" 
//                     value={customerForm.name} 
//                     onChange={handleCustomerFormChange} 
//                     placeholder="John Doe" 
//                     required 
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Email</label>
//                   <input 
//                     type="email" 
//                     name="email" 
//                     value={customerForm.email} 
//                     onChange={handleCustomerFormChange} 
//                     placeholder="john@example.com" 
//                     required 
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Street Address</label>
//                   <input 
//                     type="text" 
//                     name="address.street" 
//                     value={customerForm.address.street} 
//                     onChange={handleCustomerFormChange} 
//                     placeholder="123 Main Street" 
//                     required 
//                   />
//                 </div>
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>City</label>
//                     <input 
//                       type="text" 
//                       name="address.city" 
//                       value={customerForm.address.city} 
//                       onChange={handleCustomerFormChange} 
//                       placeholder="New York" 
//                       required 
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>State</label>
//                     <input 
//                       type="text" 
//                       name="address.state" 
//                       value={customerForm.address.state} 
//                       onChange={handleCustomerFormChange} 
//                       placeholder="NY" 
//                       required 
//                     />
//                   </div>
//                 </div>
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>ZIP Code</label>
//                     <input 
//                       type="text" 
//                       name="address.zip" 
//                       value={customerForm.address.zip} 
//                       onChange={handleCustomerFormChange} 
//                       placeholder="10001" 
//                       required 
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>Country</label>
//                     <input 
//                       type="text" 
//                       name="address.country" 
//                       value={customerForm.address.country} 
//                       onChange={handleCustomerFormChange} 
//                       placeholder="US" 
//                       required 
//                     />
//                   </div>
//                 </div>
//                 <div className="form-actions">
//                   <button onClick={() => setShowCheckout(false)} className="btn btn-secondary">
//                     Cancel
//                   </button>
//                   <button 
//                     onClick={handleCheckout} 
//                     disabled={loading || !customerForm.name || !customerForm.email} 
//                     className="btn btn-primary"
//                   >
//                     {loading ? 'Processing...' : 'Continue'}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Step 2 - Payment */}
//             {currentStep === 2 && (
//   <div className="checkout-step">
//     <h3 className="step-title">Payment Information</h3>
//     {orderData && checkoutSession && checkoutSession.clientSecret ? (
//       <div className="payment-form">
//         <CardForm
//           clientSecret={checkoutSession.clientSecret}
//           checkoutSessionId={checkoutSession.checkoutSession} // ✅ pass this correctly
//           onPayment={handlePayment}
//         />
//       </div>
//     ) : (
//       <div className="loading-payment">
//         <p>Initializing payment...</p>
//         {loading && <p>Please wait while we set up your payment...</p>}
//       </div>
//     )}
//     <button 
//       onClick={() => setCurrentStep(1)} 
//       className="btn btn-secondary back-btn"
//       disabled={loading}
//     >
//       Back
//     </button>
//   </div>
// )}

//             {/* {currentStep === 2 && (
//               <div className="checkout-step">
//                 <h3 className="step-title">Payment Information</h3>
//                 {orderData && checkoutSession && paymentSession && paymentSession.clientSecret ? (
//                   <div className="payment-form">
//                     <CardForm
//                       clientSecret={paymentSession.clientSecret}
//                       checkoutSessionId={checkoutSession.customer_session}
//                       onPayment={handlePayment}
//                     />
//                   </div>
//                 ) : (
//                   <div className="loading-payment">
//                     <p>Initializing payment...</p>
//                     {loading && <p>Please wait while we set up your payment...</p>}
//                   </div>
//                 )}
//                 <button 
//                   onClick={() => setCurrentStep(1)} 
//                   className="btn btn-secondary back-btn"
//                   disabled={loading}
//                 >
//                   Back
//                 </button>
//               </div>
//             )} */}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductStore;
// import React, { useState } from 'react';
// import {
//   ShoppingCart, Star, Plus, Minus, CreditCard, User,
//   CheckCircle, AlertCircle, X, Package, Trash2
// } from 'lucide-react';
// import axios from 'axios';
// import "./Styles/testPage.scss";
// import CardForm from './cardPay';

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   originalPrice: number;
//   image: string;
//   rating: number;
//   reviews: number;
//   description: string;
//   sku: string;
//   category: string;
// }

// interface CartItem extends Product { quantity: number }
// // interface Customer { yunoCustomerId?: string }
// interface Customer {
//   yunoCustomerId: string;
//   // Add any other properties the customer object has, e.g.,
//   // name: string;
//   // email: string;
// }
// interface Address {
//   street: string;
//   city: string;
//   state: string;
//   zip: string;
//   country: string;
// }

// interface CustomerForm {
//   name: string;
//   email: string;
//   address: Address;
// }

// interface OrderData { _id: string }

// interface CheckoutSessionResp { checkoutSession: string; clientSecret?: string | null }

// const ProductStore = () => {
//   // Products
//   const [products] = useState<Product[]>([
//     {
//       id: 1, name: "Premium Wireless Headphones", price: 299.99,
//       originalPrice: 399.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
//       rating: 4.8, reviews: 234, description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
//       sku: "HEAD-001", category: "Electronics"
//     },
//     {
//       id: 2, name: "Smart Fitness Watch", price: 199.99,
//       originalPrice: 249.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
//       rating: 4.6, reviews: 189, description: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.",
//       sku: "WATCH-001", category: "Electronics"
//     },
//     {
//       id: 3, name: "Professional Laptop", price: 1299.99,
//       originalPrice: 1499.99, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
//       rating: 4.9, reviews: 456, description: "High-performance laptop perfect for professionals and creative work.",
//       sku: "LAPTOP-001", category: "Computers"
//     },
//     {
//       id: 4, name: "Wireless Speaker", price: 149.99,
//       originalPrice: 199.99, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
//       rating: 4.5, reviews: 123, description: "Portable wireless speaker with exceptional sound quality and 24-hour battery.",
//       sku: "SPEAKER-001", category: "Audio"
//     }
//   ]);

//   // State
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [showCart, setShowCart] = useState(false);
//   const [showCheckout, setShowCheckout] = useState(false);
//   const [currentStep, setCurrentStep] = useState<number>(1);
//   const [customer, setCustomer] = useState<unknown>(null);
//   const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [orderData, setOrderData] = useState<OrderData | null>(null);
//   const [checkoutSession, setCheckoutSession] = useState<CheckoutSessionResp | null>(null);

//   const [customerForm, setCustomerForm] = useState<CustomerForm>({
//     name: '', email: '',
//     address: { street: '', city: '', state: '', zip: '', country: 'US' }
//   });
//   const [country, setCountry] = useState<'US' | 'CO' | 'BR' | 'AR' | 'CL'>('US');

//   const API_BASE = 'http://localhost:5000/api';

//   // Utility
//   const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
//     if (type === 'error') { setError(message); setSuccess(''); }
//     else { setSuccess(message); setError(''); }
//     setTimeout(() => { setError(''); setSuccess(''); }, 5000);
//   };

//   const calculateDiscount = (original: number, current: number) => Math.round(((original - current) / original) * 100);
//   const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);
//   const getSubtotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
//   const getTax = () => getSubtotal() * 0.08;
//   const getShipping = () => getSubtotal() > 100 ? 0 : 9.99;
//   const getTotal = () => getSubtotal() + getTax() + getShipping();

//   // Cart functions
//   const addToCart = (product: Product) => {
//     setCart(prev => {
//       const exist = prev.find(i => i.id === product.id);
//       if (exist) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
//       const newItem: CartItem = { ...product, quantity: 1 };
//       return [...prev, newItem];
//     });
//     showMessage(`${product.name} added to cart!`);
//   };

//   const updateQuantity = (id: number, qty: number) => {
//     if (qty === 0) { removeFromCart(id); return; }
//     setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
//   };

//   const removeFromCart = (id: number) => {
//     setCart(prev => prev.filter(i => i.id !== id));
//     showMessage('Item removed from cart');
//   };

//   // Backend calls
//   const createCustomer = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.post(`${API_BASE}/customers`, customerForm);
//       setCustomer(data.user);
//       console.log("Customer:", data.user);
//       setToken(data.token);
//       localStorage.setItem('token', data.token);
//       showMessage('Customer created!');
//       return data.user;
//     } catch (err: unknown) {
//       const e = err as { response?: { data?: { error?: string } } };
//       showMessage(e.response?.data?.error || 'Failed to create customer', 'error');
//       throw err;
//     } finally { setLoading(false); }
//   };

//   const createOrder = async () => {
//     try {
//       setLoading(true);
//       const payload = {
//         items: cart.map(i => ({
//           name: i.name, description: i.description, price: i.price, quantity: i.quantity, sku: i.sku, category: i.category
//         })),
//         subtotal: getSubtotal(),
//         tax: getTax(),
//         shipping: getShipping(),
//         totalAmount: getTotal(),
//         currency: 'USD',
//         shippingAddress: customerForm.address
//       };
//       const { data } = await axios.post(`${API_BASE}/orders`, payload, { headers: { Authorization: `Bearer ${token}` } });
//       setOrderData(data.order as OrderData);
//       showMessage('Order created!');
//       return data.order as OrderData;
//     } catch (err: unknown) {
//       const e = err as { response?: { data?: { error?: string } } };
//       showMessage(e.response?.data?.error || 'Failed to create order', 'error');
//       throw err;
//     } finally { setLoading(false); }
//   };

//   const createCheckoutSession = async (orderId: string) => {
//     try {
//       setLoading(true);
//       const { data } = await axios.post(`${API_BASE}/payments/checkout-sessions`, { orderId, country }, { headers: { Authorization: `Bearer ${token}` } });
//       setCheckoutSession(data as CheckoutSessionResp);
//       showMessage('Checkout session created!');
//       return data as CheckoutSessionResp;
//     } catch (err: unknown) {
//       const e = err as { response?: { data?: { error?: string } } };
//       showMessage(e.response?.data?.error || 'Failed to create checkout session', 'error');
//       throw err;
//     } finally { setLoading(false); }
//   };

// // After creating checkout session
// const handleCheckout = async () => {
//   try {
//     if (!customer) await createCustomer();
//     const order = await createOrder();

//     // Create checkout session first
//     const checkoutData = await createCheckoutSession(order._id);
//     console.log('Checkout Data:', checkoutData);

//     setOrderData(order);
//     setCheckoutSession(checkoutData); // set initial session
//     setCurrentStep(2); // go to payment step

//     // Do not pre-initialize payment here; SDK will request one-time token and call backend
//   } catch (err) {
//     console.error('Checkout error:', err);
//   }
// };

//   const handleCustomerFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (name.startsWith('address.')) {
//       const field = name.split('.')[1] as keyof Address;
//       setCustomerForm(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
//     } else setCustomerForm(prev => ({ ...prev, [name]: value } as CustomerForm));
//   };

//   const handlePayment = async (payment: { oneTimeToken?: string }) => {
//     console.log("Payment info received:", payment);

//     if (!payment.oneTimeToken) {
//       showMessage("Payment token missing!", "error");
//       return;
//     }

//     if (orderData && checkoutSession) {
//       try {
//         setLoading(true);

//         const payload = {
//           orderId: orderData._id,
//           customer_session: checkoutSession.checkoutSession,
//           checkout_session: checkoutSession.checkoutSession,
//           oneTimeToken: payment.oneTimeToken
//         } as const;

//         console.log("Sending payment payload:", payload);

//         const { data } = await axios.post(`${API_BASE}/payments/create-payment`, payload, { headers: { Authorization: `Bearer ${token}` } });

//         console.log("Payment processed:", data);

//         if (data.status === "APPROVED" || data.status === "SUCCEEDED") {
//           showMessage("Payment Successful!");
//           setCart([]);
//           setShowCheckout(false);
//           setCurrentStep(1);
//           setOrderData(null);
//           setCheckoutSession(null);
//         } else {
//           showMessage(`Payment Failed: ${data.status}`, "error");
//         }
//       } catch (err: unknown) {
//         const e = err as { response?: { data?: { error?: string } }, message?: string };
//         showMessage(`Payment Error: ${e.response?.data?.error || e.message}`, "error");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   // JSX
//   return (
//     <div className="store-container">
//       {/* Header */}
//       <header className="store-header">
//         <div className="header-content">
//           <div className="store-brand">
//             <Package className="store-icon" />
//             <h1 className="store-title">Yuno Store</h1>
//           </div>
//           <button onClick={() => setShowCart(true)} className="cart-button">
//             <ShoppingCart className="cart-icon" />
//             {getTotalItems() > 0 && <span className="cart-badge">{getTotalItems()}</span>}
//           </button>
//         </div>
//       </header>

//       {/* Alerts */}
//       {error && <div className="alert alert-error"><AlertCircle />{error}<button onClick={() => setError('')}><X /></button></div>}
//       {success && <div className="alert alert-success"><CheckCircle />{success}<button onClick={() => setSuccess('')}><X /></button></div>}

//       {/* Products */}
//       <main className="products-main">
//         <h2 className="products-title">Premium Products</h2>
//         <div style={{ marginBottom: 12 }}>
//           <label htmlFor="country-select" style={{ marginRight: 8 }}>Country</label>
//           <select id="country-select" value={country} onChange={(e) => setCountry(e.target.value as 'US' | 'CO' | 'BR' | 'AR' | 'CL')}>
//             <option value="US">US</option>
//             <option value="CO">CO</option>
//             <option value="BR">BR</option>
//             <option value="AR">AR</option>
//             <option value="CL">CL</option>
//           </select>
//         </div>
//         <div className="products-grid">
//           {products.map(p => (
//             <div key={p.id} className="product-card">
//               {p.originalPrice > p.price && <div className="discount-badge">-{calculateDiscount(p.originalPrice, p.price)}%</div>}
//               <img src={p.image} alt={p.name} className="product-image" />
//               <div className="product-info">
//                 <h3 className="product-name">{p.name}</h3>
//                 <div className="rating-stars">
//                   {[...Array(5)].map((_, i) => <Star key={i} className={`star ${i < Math.floor(p.rating) ? 'filled' : ''}`} />)}
//                   <span className="reviews-count">({p.reviews})</span>
//                 </div>
//                 <p className="product-description">{p.description}</p>
//                 <div className="price-section">
//                   <span className="current-price">${p.price}</span>
//                   {p.originalPrice > p.price && <span className="original-price">${p.originalPrice}</span>}
//                 </div>
//                 <button onClick={() => addToCart(p)} className="btn btn-primary add-to-cart"><Plus /> Add to Cart</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>

//       {/* Cart Sidebar */}
//       <div className={`cart-sidebar ${showCart ? 'open' : ''}`}>
//         <div className="cart-content">
//           <div className="cart-header">
//             <h3>Shopping Cart</h3>
//             <button onClick={() => setShowCart(false)}><X /></button>
//           </div>
//           {cart.length === 0 ? (
//             <p>Your cart is empty</p>
//           ) : (
//             <>
//               <div className="cart-items">
//                 {cart.map(i => (
//                   <div key={i.id} className="cart-item">
//                     <img src={i.image} alt={i.name} />
//                     <div className="cart-item-details">
//                       <h4>{i.name}</h4>
//                       <p>${i.price}</p>
//                     </div>
//                     <div className="cart-item-controls">
//                       <button onClick={() => updateQuantity(i.id, i.quantity - 1)}><Minus /></button>
//                       <span>{i.quantity}</span>
//                       <button onClick={() => updateQuantity(i.id, i.quantity + 1)}><Plus /></button>
//                       <button onClick={() => removeFromCart(i.id)}><Trash2 /></button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="cart-summary">
//                 <div><span>Subtotal:</span> <span>${getSubtotal().toFixed(2)}</span></div>
//                 <div><span>Tax (8%):</span> <span>${getTax().toFixed(2)}</span></div>
//                 <div><span>Shipping:</span> <span>${getShipping().toFixed(2)}</span></div>
//                 <div><span>Total:</span> <span>${getTotal().toFixed(2)}</span></div>
//               </div>
//               <button onClick={() => { setShowCart(false); setShowCheckout(true); }} className="btn btn-primary checkout-btn"><CreditCard /> Checkout</button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Checkout Modal */}
//       {showCheckout && (
//         <div className="checkout-modal">
//           <div className="checkout-content">
//             <div className="step-indicator">
//               <div className={`step ${currentStep >= 1 ? 'active' : 'inactive'}`}><User /> Customer Info</div>
//               <div className={`step ${currentStep >= 2 ? 'active' : 'inactive'}`}><CreditCard /> Payment</div>
//             </div>

//             {currentStep === 1 && (
//               <div className="checkout-step">
//                 <h3>Customer Information</h3>
//                 <input type="text" name="name" placeholder="Full Name" value={customerForm.name} onChange={handleCustomerFormChange} required />
//                 <input type="email" name="email" placeholder="Email" value={customerForm.email} onChange={handleCustomerFormChange} required />
//                 <input type="text" name="address.street" placeholder="Street" value={customerForm.address.street} onChange={handleCustomerFormChange} required />
//                 <input type="text" name="address.city" placeholder="City" value={customerForm.address.city} onChange={handleCustomerFormChange} required />
//                 <input type="text" name="address.state" placeholder="State" value={customerForm.address.state} onChange={handleCustomerFormChange} required />
//                 <input type="text" name="address.zip" placeholder="ZIP" value={customerForm.address.zip} onChange={handleCustomerFormChange} required />
//                 <select 
//                   name="address.country" 
//                   value={customerForm.address.country} 
//                   onChange={(e) => { 
//                     handleCustomerFormChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
//                     setCountry(e.target.value as 'US' | 'CO' | 'BR' | 'AR' | 'CL');
//                   }} 
//                   required
//                 >
//                   <option value="" disabled>Country</option>
//                   <option value="US">US</option>
//                   <option value="CO">CO</option>
//                   <option value="BR">BR</option>
//                   <option value="AR">AR</option>
//                   <option value="CL">CL</option>
//                 </select>
//                 <div className="form-actions">
//                   <button onClick={() => setShowCheckout(false)}>Cancel</button>
//                   <button onClick={handleCheckout} disabled={loading || !customerForm.name || !customerForm.email}>{loading ? 'Processing...' : 'Continue'}</button>
//                 </div>
//               </div>
//             )}

//            {/* Step 2 - Payment */}
// {currentStep === 2 && (
//   <div className="checkout-step">
//     <h3 className="step-title">Payment Information</h3>

//     {checkoutSession?.checkoutSession ? (
//       <CardForm
//         orderId={orderData?._id}
//         // customerForm={customerForm}
//         checkoutSessionId={checkoutSession.checkoutSession}
//         countryCode={country}
//         customerFirstName={(customerForm.name || '').trim().split(' ').slice(0, -1).join(' ') || (customerForm.name || '').trim().split(' ')[0] || ''}
//         customerLastName={(customerForm.name || '').trim().split(' ').slice(-1)[0] || ''}
//         // yunoCustomerId={customer?.yunoCustomerId}
//         yunoCustomerId={customer?.yunoCustomerId || ''}
//         customerEmail={customerForm.email}
//         onSuccess={(data) => handlePayment(data as { oneTimeToken?: string })}
//         setShowCheckout={setShowCheckout}
//         onError={(e) => showMessage(e.message || 'Payment error', 'error')}
//         showMessage={showMessage}
//       />
//     ) : (
//       <div className="loading-payment">
//         <p>Initializing payment...</p>
//         {loading && <p>Please wait while we set up your payment...</p>}
//       </div>
//     )}

//     <button
//       onClick={() => setCurrentStep(1)}
//       className="btn btn-secondary back-btn"
//       disabled={loading}
//     >
//       Back
//     </button>
//   </div>
// )}

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductStore;
// import React, { useState, useEffect } from 'react';
// import {
//   ShoppingCart, Star, Plus, Minus, CreditCard, User,
//   CheckCircle, AlertCircle, X, Package, Trash2, Search,
//   Filter, Heart, Eye, Zap, Sparkles, ArrowRight, Globe,
//   Truck, Shield, Award, TrendingUp
// } from 'lucide-react';

// const YuniqueFashionStore = () => {
//   const [products] = useState([
//     {
//       id: 1, 
//       name: "Premium Silk Evening Dress", 
//       price: 459.99,
//       originalPrice: 599.99, 
//       image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop",
//       rating: 4.9, 
//       reviews: 342, 
//       description: "Luxurious silk evening dress with elegant draping and premium finish.",
//       sku: "DRESS-001", 
//       category: "Dresses", 
//       trending: true,
//       sizes: ["XS", "S", "M", "L", "XL"],
//       colors: ["Black", "Navy", "Burgundy"]
//     },
//     {
//       id: 2, 
//       name: "Designer Leather Handbag", 
//       price: 329.99,
//       originalPrice: 429.99, 
//       image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop",
//       rating: 4.7, 
//       reviews: 189, 
//       description: "Handcrafted leather handbag with gold hardware and premium lining.",
//       sku: "BAG-001", 
//       category: "Accessories", 
//       trending: false,
//       sizes: ["One Size"],
//       colors: ["Brown", "Black", "Tan"]
//     },
//     {
//       id: 3, 
//       name: "Cashmere Blend Sweater", 
//       price: 199.99,
//       originalPrice: 279.99, 
//       image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop",
//       rating: 4.8, 
//       reviews: 456, 
//       description: "Ultra-soft cashmere blend sweater perfect for layering.",
//       sku: "SWEATER-001", 
//       category: "Knitwear", 
//       trending: true,
//       sizes: ["XS", "S", "M", "L", "XL"],
//       colors: ["Cream", "Grey", "Camel"]
//     },
//     {
//       id: 4, 
//       name: "Italian Leather Boots", 
//       price: 389.99,
//       originalPrice: 489.99, 
//       image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=600&h=600&fit=crop",
//       rating: 4.6, 
//       reviews: 123, 
//       description: "Handmade Italian leather boots with premium construction.",
//       sku: "BOOTS-001", 
//       category: "Footwear", 
//       trending: false,
//       sizes: ["36", "37", "38", "39", "40", "41"],
//       colors: ["Black", "Brown", "Cognac"]
//     },
//     {
//       id: 5, 
//       name: "Silk Scarf Collection", 
//       price: 129.99,
//       originalPrice: 169.99, 
//       image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=600&fit=crop",
//       rating: 4.5, 
//       reviews: 267, 
//       description: "Premium silk scarf with exclusive Yunique patterns.",
//       sku: "SCARF-001", 
//       category: "Accessories", 
//       trending: true,
//       sizes: ["One Size"],
//       colors: ["Floral", "Geometric", "Abstract"]
//     },
//     {
//       id: 6, 
//       name: "Tailored Blazer", 
//       price: 299.99,
//       originalPrice: 399.99, 
//       image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop",
//       rating: 4.8, 
//       reviews: 198, 
//       description: "Perfectly tailored blazer for the modern professional.",
//       sku: "BLAZER-001", 
//       category: "Outerwear", 
//       trending: false,
//       sizes: ["XS", "S", "M", "L", "XL"],
//       colors: ["Black", "Navy", "Charcoal"]
//     }
//   ]);

//   const [cart, setCart] = useState([]);
//   const [showCart, setShowCart] = useState(false);
//   const [showCheckout, setShowCheckout] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [wishlist, setWishlist] = useState([]);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [selectedCurrency, setSelectedCurrency] = useState('USD');
//   const [selectedCountry, setSelectedCountry] = useState('US');

//   const [customerForm, setCustomerForm] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     address: { street: '', city: '', state: '', zip: '', country: 'US' }
//   });

//   const currencies = [
//     { code: 'USD', symbol: '$', rate: 1 },
//     { code: 'EUR', symbol: '€', rate: 0.85 },
//     { code: 'GBP', symbol: '£', rate: 0.73 },
//     { code: 'JPY', symbol: '¥', rate: 110 },
//     { code: 'CAD', symbol: 'C$', rate: 1.25 }
//   ];

//   const countries = ['US', 'CA', 'GB', 'FR', 'DE', 'IT', 'ES', 'AU', 'JP', 'BR', 'CO', 'AR', 'CL'];

//   // Utility functions
//   const showMessage = (message: React.SetStateAction<string>, type = 'success') => {
//     if (type === 'error') { setError(message); setSuccess(''); }
//     else { setSuccess(message); setError(''); }
//     setTimeout(() => { setError(''); setSuccess(''); }, 5000);
//   };

//   const convertPrice = (price) => {
//     const currency = currencies.find(c => c.code === selectedCurrency);
//     const convertedPrice = price * currency.rate;
//     return currency.symbol + (currency.code === 'JPY' ? Math.round(convertedPrice) : convertedPrice.toFixed(2));
//   };

//   const calculateDiscount = (original, current) => Math.round(((original - current) / original) * 100);
//   const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);
//   const getSubtotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
//   const getTax = () => getSubtotal() * 0.08;
//   const getShipping = () => getSubtotal() > 200 ? 0 : 19.99;
//   const getTotal = () => getSubtotal() + getTax() + getShipping();

//   const categories = ['All', ...new Set(products.map(p => p.category))];

//   const filteredProducts = products.filter(p => {
//     const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   // Cart functions
//   const addToCart = (product, selectedSize = null, selectedColor = null) => {
//     setIsAnimating(true);
//     const cartItem = {
//       ...product,
//       selectedSize: selectedSize || product.sizes[0],
//       selectedColor: selectedColor || product.colors[0],
//       cartId: `${product.id}-${selectedSize || product.sizes[0]}-${selectedColor || product.colors[0]}`
//     };

//     setCart(prev => {
//       const exist = prev.find(i => i.cartId === cartItem.cartId);
//       if (exist) return prev.map(i => i.cartId === cartItem.cartId ? { ...i, quantity: i.quantity + 1 } : i);
//       return [...prev, { ...cartItem, quantity: 1 }];
//     });
//     showMessage(`${product.name} added to cart!`);
//     setTimeout(() => setIsAnimating(false), 600);
//   };

//   const updateQuantity = (cartId, qty) => {
//     if (qty === 0) { removeFromCart(cartId); return; }
//     setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, quantity: qty } : i));
//   };

//   const removeFromCart = (cartId) => {
//     setCart(prev => prev.filter(i => i.cartId !== cartId));
//     showMessage('Item removed from cart');
//   };

//   const toggleWishlist = (productId) => {
//     setWishlist(prev => 
//       prev.includes(productId) 
//         ? prev.filter(id => id !== productId)
//         : [...prev, productId]
//     );
//   };

//   const handleCustomerFormChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith('address.')) {
//       const field = name.split('.')[1];
//       setCustomerForm(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
//     } else setCustomerForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCheckout = async () => {
//     setLoading(true);
//     try {
//       // Simulate customer creation and order processing
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       setCurrentStep(2);
//       showMessage('Customer information validated!');
//     } catch (err) {
//       showMessage('Checkout failed. Please try again.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayment = async (paymentData) => {
//     setLoading(true);
//     try {
//       // Simulate Yuno SDK payment processing
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       showMessage('Payment successful! Order confirmed.');
//       setCart([]);
//       setShowCheckout(false);
//       setCurrentStep(1);
//     } catch (err) {
//       showMessage('Payment failed. Please try again.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
//       {/* Floating Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-rose-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute top-1/2 -left-40 w-60 h-60 bg-gradient-to-br from-purple-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-gradient-to-br from-amber-300/20 to-orange-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
//       </div>

//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-rose-100/50 shadow-sm">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             {/* Brand */}
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-purple-600 rounded-xl flex items-center justify-center">
//                   <span className="text-white font-bold text-xl">Y</span>
//                 </div>
//                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-ping"></div>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
//                   Yunique Fashion
//                 </h1>
//                 <p className="text-xs text-gray-500 flex items-center">
//                   <Globe className="w-3 h-3 mr-1" />
//                   Global Fashion · 120+ Countries
//                 </p>
//               </div>
//             </div>

//             {/* Search and Controls */}
//             <div className="flex items-center space-x-4">
//               {/* Currency Selector */}
//               <select
//                 value={selectedCurrency}
//                 onChange={(e) => setSelectedCurrency(e.target.value)}
//                 className="px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
//               >
//                 {currencies.map(currency => (
//                   <option key={currency.code} value={currency.code}>{currency.code}</option>
//                 ))}
//               </select>

//               {/* Search Bar */}
//               <div className="relative hidden md:block">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search fashion..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10 pr-4 py-2 w-64 bg-white/70 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
//                 />
//               </div>

//               {/* Wishlist */}
//               <button className="relative p-2 text-gray-600 hover:text-rose-600 transition-colors duration-300">
//                 <Heart className="w-6 h-6" />
//                 {wishlist.length > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//                     {wishlist.length}
//                   </span>
//                 )}
//               </button>

//               {/* Cart Button */}
//               <button
//                 onClick={() => setShowCart(true)}
//                 className={`relative p-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl ${isAnimating ? 'animate-bounce' : ''}`}
//               >
//                 <ShoppingCart className="w-6 h-6" />
//                 {getTotalItems() > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold animate-pulse">
//                     {getTotalItems()}
//                   </span>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Messages */}
//       {error && (
//         <div className="fixed top-20 right-4 z-50 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg shadow-lg animate-slide-in-right max-w-md">
//           <div className="flex items-start">
//             <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
//             <div className="flex-1">
//               <span className="text-sm font-medium">{error}</span>
//             </div>
//             <button onClick={() => setError('')} className="ml-2 text-red-500 hover:text-red-700">
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       {success && (
//         <div className="fixed top-20 right-4 z-50 bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg shadow-lg animate-slide-in-right max-w-md">
//           <div className="flex items-start">
//             <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
//             <div className="flex-1">
//               <span className="text-sm font-medium">{success}</span>
//             </div>
//             <button onClick={() => setSuccess('')} className="ml-2 text-green-500 hover:text-green-700">
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <main className="container mx-auto px-6 py-8 relative z-10">
//         {/* Hero Section */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center bg-gradient-to-r from-rose-100 to-purple-100 rounded-full px-4 py-2 mb-6">
//             <Sparkles className="w-4 h-4 text-rose-500 mr-2" />
//             <span className="text-sm font-medium text-gray-700">New Collection Available</span>
//           </div>
          
//           <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
//             Fashion Redefined
//           </h2>
          
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
//             Discover premium fashion pieces crafted for the global trendsetter. 
//             From Milan runways to your wardrobe.
//           </p>

//           {/* Trust Indicators */}
//           <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
//             <div className="flex items-center">
//               <Truck className="w-5 h-5 mr-2 text-green-500" />
//               <span>Free Global Shipping</span>
//             </div>
//             <div className="flex items-center">
//               <Shield className="w-5 h-5 mr-2 text-blue-500" />
//               <span>Secure Payments</span>
//             </div>
//             <div className="flex items-center">
//               <Award className="w-5 h-5 mr-2 text-yellow-500" />
//               <span>Premium Quality</span>
//             </div>
//           </div>
//         </div>

//         {/* Category Filter */}
//         <div className="flex flex-wrap justify-center gap-3 mb-12">
//           {categories.map(category => (
//             <button
//               key={category}
//               onClick={() => setSelectedCategory(category)}
//               className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
//                 selectedCategory === category
//                   ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg scale-105'
//                   : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
//               }`}
//             >
//               {category}
//               {category !== 'All' && (
//                 <span className="ml-2 text-xs opacity-75">
//                   ({products.filter(p => p.category === category).length})
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>

//         {/* Products Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {filteredProducts.map(product => (
//             <div
//               key={product.id}
//               className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-white/50"
//             >
//               {/* Product Image */}
//               <div className="relative overflow-hidden">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
//                 />
                
//                 {/* Badges */}
//                 <div className="absolute top-4 left-4 flex flex-col gap-2">
//                   {product.originalPrice > product.price && (
//                     <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
//                       {calculateDiscount(product.originalPrice, product.price)}% OFF
//                     </div>
//                   )}
//                   {product.trending && (
//                     <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
//                       <TrendingUp className="w-3 h-3 mr-1" />
//                       Trending
//                     </div>
//                   )}
//                 </div>

//                 {/* Wishlist Button */}
//                 <button
//                   onClick={() => toggleWishlist(product.id)}
//                   className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 group-hover:scale-110 shadow-lg"
//                 >
//                   <Heart
//                     className={`w-5 h-5 transition-colors duration-300 ${
//                       wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'
//                     }`}
//                   />
//                 </button>

//                 {/* Quick Actions */}
//                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                   <div className="flex gap-3">
//                     <button className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full font-medium hover:bg-white transition-all duration-300 flex items-center shadow-lg">
//                       <Eye className="w-4 h-4 mr-2" />
//                       Quick View
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Product Info */}
//               <div className="p-6">
//                 <div className="flex items-start justify-between mb-3">
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-800 group-hover:text-rose-600 transition-colors duration-300 mb-1">
//                       {product.name}
//                     </h3>
//                     <p className="text-sm text-gray-500">{product.category}</p>
//                   </div>
//                 </div>

//                 {/* Rating */}
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="flex">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`w-4 h-4 ${
//                           i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   <span className="text-sm text-gray-600">({product.reviews})</span>
//                 </div>

//                 {/* Sizes */}
//                 <div className="mb-3">
//                   <p className="text-xs text-gray-500 mb-2">Available sizes:</p>
//                   <div className="flex flex-wrap gap-1">
//                     {product.sizes.slice(0, 4).map(size => (
//                       <span key={size} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
//                         {size}
//                       </span>
//                     ))}
//                     {product.sizes.length > 4 && (
//                       <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
//                         +{product.sizes.length - 4}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Colors */}
//                 <div className="mb-4">
//                   <p className="text-xs text-gray-500 mb-2">Colors:</p>
//                   <div className="flex gap-2">
//                     {product.colors.slice(0, 3).map(color => (
//                       <div
//                         key={color}
//                         className="w-6 h-6 rounded-full border-2 border-gray-200"
//                         style={{
//                           backgroundColor: color.toLowerCase() === 'black' ? '#000' :
//                                          color.toLowerCase() === 'white' ? '#fff' :
//                                          color.toLowerCase() === 'brown' ? '#8B4513' :
//                                          color.toLowerCase() === 'navy' ? '#000080' :
//                                          color.toLowerCase() === 'burgundy' ? '#800020' :
//                                          color.toLowerCase() === 'cream' ? '#F5F5DC' :
//                                          color.toLowerCase() === 'grey' ? '#808080' :
//                                          color.toLowerCase() === 'gray' ? '#808080' :
//                                          color.toLowerCase() === 'camel' ? '#C19A6B' : '#ccc'
//                         }}
//                         title={color}
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 {/* Price */}
//                 <div className="flex items-center gap-3 mb-4">
//                   <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
//                     {convertPrice(product.price)}
//                   </span>
//                   {product.originalPrice > product.price && (
//                     <span className="text-lg text-gray-400 line-through">
//                       {convertPrice(product.originalPrice)}
//                     </span>
//                   )}
//                 </div>

//                 {/* Add to Cart Button */}
//                 <button
//                   onClick={() => addToCart(product)}
//                   className="w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white py-3 rounded-2xl font-medium hover:from-rose-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center group"
//                 >
//                   <Plus className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
//                   Add to Cart
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {filteredProducts.length === 0 && (
//           <div className="text-center py-16">
//             <div className="text-gray-400 mb-4">
//               <Search className="w-20 h-20 mx-auto" />
//             </div>
//             <h3 className="text-2xl font-semibold text-gray-600 mb-2">No products found</h3>
//             <p className="text-gray-500">Try adjusting your search or filter criteria</p>
//             <button
//               onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
//               className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors duration-300"
//             >
//               Clear Filters
//             </button>
//           </div>
//         )}
//       </main>

//       {/* Cart Sidebar */}
//       <div className={`fixed inset-y-0 right-0 w-96 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-500 ease-in-out z-50 ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
//         <div className="flex flex-col h-full">
//           {/* Cart Header */}
//           <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-purple-50">
//             <div>
//               <h3 className="text-xl font-bold text-gray-800">Shopping Cart</h3>
//               <p className="text-sm text-gray-600">{getTotalItems()} items</p>
//             </div>
//             <button
//               onClick={() => setShowCart(false)}
//               className="p-2 hover:bg-white rounded-full transition-colors duration-300"
//             >
//               <X className="w-5 h-5 text-gray-500" />
//             </button>
//           </div>

//           {cart.length === 0 ? (
//             <div className="flex-1 flex items-center justify-center">
//               <div className="text-center px-6">
//                 <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
//                 <p className="text-gray-400 text-sm mb-6">Discover our latest fashion collections!</p>
//                 <button
//                   onClick={() => setShowCart(false)}
//                   className="px-6 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full hover:from-rose-600 hover:to-purple-700 transition-all duration-300"
//                 >
//                   Continue Shopping
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* Cart Items */}
//               <div className="flex-1 overflow-y-auto p-4">
//                 {cart.map(item => (
//                   <div key={item.cartId} className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-rose-50/50 rounded-2xl mb-4 hover:from-gray-100 hover:to-rose-100/50 transition-all duration-300">
//                     <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl shadow-md" />
                    
//                     <div className="flex-1">
//                       <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.name}</h4>
//                       <p className="text-xs text-gray-500 mb-2">{item.selectedSize} · {item.selectedColor}</p>
//                       <div className="flex items-center gap-2">
//                         <span className="text-lg font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
//                           {convertPrice(item.price)}
//                         </span>
//                         {item.originalPrice > item.price && (
//                           <span className="text-sm text-gray-400 line-through">
//                             {convertPrice(item.originalPrice)}
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex flex-col items-end gap-3">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
//                           className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-300"
//                         >
//                           <Minus className="w-4 h-4" />
//                         </button>
//                         <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
//                         <button
//                           onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
//                           className="w-8 h-8 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-colors duration-300"
//                         >
//                           <Plus className="w-4 h-4" />
//                         </button>
//                       </div>
//                       <button
//                         onClick={() => removeFromCart(item.cartId)}
//                         className="p-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full transition-colors duration-300"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Cart Summary */}
//               <div className="p-6 border-t border-gray-200 bg-gradient-to-br from-rose-50/50 to-purple-50/50">
//                 <div className="space-y-3 mb-6">
//                   <div className="flex justify-between text-gray-600">
//                     <span>Subtotal ({getTotalItems()} items):</span>
//                     <span>{convertPrice(getSubtotal())}</span>
//                   </div>
//                   <div className="flex justify-between text-gray-600">
//                     <span>Tax (8%):</span>
//                     <span>{convertPrice(getTax())}</span>
//                   </div>
//                   <div className="flex justify-between text-gray-600">
//                     <div className="flex items-center">
//                       <span>Shipping:</span>
//                       {getShipping() === 0 && (
//                         <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">FREE</span>
//                       )}
//                     </div>
//                     <span>{getShipping() === 0 ? 'Free' : convertPrice(getShipping())}</span>
//                   </div>
//                   <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t border-gray-200">
//                     <span>Total:</span>
//                     <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
//                       {convertPrice(getTotal())}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500 text-center">
//                     Secure checkout powered by Yuno
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => { setShowCart(false); setShowCheckout(true); }}
//                   className="w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white py-4 rounded-2xl font-bold hover:from-rose-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group mb-3"
//                 >
//                   <CreditCard className="w-5 h-5 mr-2" />
//                   Secure Checkout
//                   <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
//                 </button>

//                 <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
//                   <div className="flex items-center">
//                     <Shield className="w-3 h-3 mr-1" />
//                     <span>SSL Secure</span>
//                   </div>
//                   <div className="flex items-center">
//                     <Truck className="w-3 h-3 mr-1" />
//                     <span>Global Delivery</span>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Checkout Modal */}
//       {showCheckout && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Step Indicator */}
//             <div className="flex justify-center p-6 border-b border-gray-200 bg-gradient-to-r from-rose-50/50 to-purple-50/50">
//               <div className="flex items-center space-x-8">
//                 <div className={`flex items-center ${currentStep >= 1 ? 'text-rose-600' : 'text-gray-400'}`}>
//                   <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= 1 ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white scale-105' : 'bg-gray-200'}`}>
//                     <User className="w-6 h-6" />
//                   </div>
//                   <span className="ml-3 font-medium">Customer Information</span>
//                 </div>
                
//                 <div className={`w-20 h-px transition-colors duration-300 ${currentStep >= 2 ? 'bg-gradient-to-r from-rose-500 to-purple-600' : 'bg-gray-300'}`}></div>
                
//                 <div className={`flex items-center ${currentStep >= 2 ? 'text-rose-600' : 'text-gray-400'}`}>
//                   <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= 2 ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white scale-105' : 'bg-gray-200'}`}>
//                     <CreditCard className="w-6 h-6" />
//                   </div>
//                   <span className="ml-3 font-medium">Payment & Review</span>
//                 </div>
//               </div>
//             </div>

//             {/* Step Content */}
//             <div className="p-8">
//               {currentStep === 1 && (
//                 <div className="space-y-6">
//                   <div className="text-center mb-8">
//                     <h3 className="text-3xl font-bold text-gray-800 mb-3">Customer Information</h3>
//                     <p className="text-gray-600">Please provide your details for delivery and order updates</p>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     {/* Customer Form */}
//                     <div className="space-y-6">
//                       <h4 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h4>
                      
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
//                           <input
//                             type="text"
//                             name="firstName"
//                             value={customerForm.firstName}
//                             onChange={handleCustomerFormChange}
//                             placeholder="John"
//                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
//                           <input
//                             type="text"
//                             name="lastName"
//                             value={customerForm.lastName}
//                             onChange={handleCustomerFormChange}
//                             placeholder="Doe"
//                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
//                             required
//                           />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
//                         <input
//                           type="email"
//                           name="email"
//                           value={customerForm.email}
//                           onChange={handleCustomerFormChange}
//                           placeholder="john.doe@example.com"
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
//                         <input
//                           type="tel"
//                           name="phone"
//                           value={customerForm.phone}
//                           onChange={handleCustomerFormChange}
//                           placeholder="+1 (555) 123-4567"
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
//                         />
//                       </div>

//                       <h4 className="text-lg font-semibold text-gray-800 mb-4 mt-8">Shipping Address</h4>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
//                         <input
//                           type="text"
//                           name="address.street"
//                           value={customerForm.address.street}
//                           onChange={handleCustomerFormChange}
//                           placeholder="123 Fashion Avenue"
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
//                           required
//                         />
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
//                           <input
//                             type="text"
//                             name="address.city"
//                             value={customerForm.address.city}
//                             onChange={handleCustomerFormChange}
//                             placeholder="New York"
//                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
//                           <input
//                             type="text"
//                             name="address.state"
//                             value={customerForm.address.state}
//                             onChange={handleCustomerFormChange}
//                             placeholder="NY"
//                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
//                             required
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
//                           <input
//                             type="text"
//                             name="address.zip"
//                             value={customerForm.address.zip}
//                             onChange={handleCustomerFormChange}
//                             placeholder="10001"
//                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
//                           <select
//                             name="address.country"
//                             value={customerForm.address.country}
//                             onChange={(e) => handleCustomerFormChange({target: {name: 'address.country', value: e.target.value}})}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
//                             required
//                           >
//                             {countries.map(country => (
//                               <option key={country} value={country}>{country}</option>
//                             ))}
//                           </select>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Order Summary */}
//                     <div className="lg:pl-8">
//                       <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h4>
//                       <div className="bg-gradient-to-br from-gray-50 to-rose-50/30 rounded-2xl p-6">
//                         <div className="space-y-4 mb-6">
//                           {cart.slice(0, 3).map(item => (
//                             <div key={item.cartId} className="flex items-center gap-3">
//                               <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
//                               <div className="flex-1">
//                                 <p className="text-sm font-medium text-gray-800">{item.name}</p>
//                                 <p className="text-xs text-gray-500">{item.selectedSize} · {item.selectedColor} · Qty: {item.quantity}</p>
//                               </div>
//                               <p className="text-sm font-semibold text-gray-800">{convertPrice(item.price * item.quantity)}</p>
//                             </div>
//                           ))}
//                           {cart.length > 3 && (
//                             <p className="text-sm text-gray-500 text-center">+ {cart.length - 3} more items</p>
//                           )}
//                         </div>

//                         <div className="space-y-2 pt-4 border-t border-gray-200">
//                           <div className="flex justify-between text-sm text-gray-600">
//                             <span>Subtotal:</span>
//                             <span>{convertPrice(getSubtotal())}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-gray-600">
//                             <span>Tax:</span>
//                             <span>{convertPrice(getTax())}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-gray-600">
//                             <span>Shipping:</span>
//                             <span>{getShipping() === 0 ? 'Free' : convertPrice(getShipping())}</span>
//                           </div>
//                           <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-200">
//                             <span>Total:</span>
//                             <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
//                               {convertPrice(getTotal())}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex gap-4 pt-6 border-t border-gray-200">
//                     <button
//                       onClick={() => setShowCheckout(false)}
//                       className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleCheckout}
//                       disabled={loading || !customerForm.firstName || !customerForm.lastName || !customerForm.email || !customerForm.address.street}
//                       className="flex-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-xl font-medium hover:from-rose-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                     >
//                       {loading ? (
//                         <>
//                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                           Processing...
//                         </>
//                       ) : (
//                         <>
//                           Continue to Payment
//                           <ArrowRight className="w-5 h-5 ml-2" />
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {currentStep === 2 && (
//                 <div className="space-y-6">
//                   <div className="text-center mb-8">
//                     <h3 className="text-3xl font-bold text-gray-800 mb-3">Payment & Review</h3>
//                     <p className="text-gray-600">Secure payment powered by Yuno SDK</p>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     {/* Payment Form */}
//                     <div className="space-y-6">
//                       <h4 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h4>
                      
//                       {/* Yuno SDK Integration Placeholder */}
//                       <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-dashed border-blue-200">
//                         <div className="text-center">
//                           <CreditCard className="w-16 h-16 text-blue-500 mx-auto mb-4" />
//                           <h5 className="text-lg font-semibold text-gray-800 mb-2">Yuno SDK Integration</h5>
//                           <p className="text-sm text-gray-600 mb-4">
//                             This is where the Yuno SDK FULL component would be integrated for credit card processing.
//                           </p>
//                           <div className="bg-white/70 rounded-xl p-4 space-y-3">
//                             <div className="text-left">
//                               <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
//                               <div className="w-full h-12 bg-gray-100 rounded-lg flex items-center px-4 text-gray-500">
//                                 **** **** **** ****
//                               </div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-3">
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
//                                 <div className="w-full h-12 bg-gray-100 rounded-lg flex items-center px-4 text-gray-500">
//                                   MM/YY
//                                 </div>
//                               </div>
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
//                                 <div className="w-full h-12 bg-gray-100 rounded-lg flex items-center px-4 text-gray-500">
//                                   ***
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                           <button
//                             onClick={() => handlePayment({})}
//                             disabled={loading}
//                             className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
//                           >
//                             {loading ? (
//                               <>
//                                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                                 Processing Payment...
//                               </>
//                             ) : (
//                               <>
//                                 <Shield className="w-5 h-5 mr-2" />
//                                 Pay Securely
//                               </>
//                             )}
//                           </button>
//                         </div>
//                       </div>

//                       {/* Security Features */}
//                       <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
//                         <div className="flex items-center">
//                           <Shield className="w-4 h-4 mr-1 text-green-500" />
//                           <span>256-bit SSL</span>
//                         </div>
//                         <div className="flex items-center">
//                           <Award className="w-4 h-4 mr-1 text-blue-500" />
//                           <span>PCI Compliant</span>
//                         </div>
//                         <div className="flex items-center">
//                           <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
//                           <span>Secure</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Final Order Review */}
//                     <div className="lg:pl-8">
//                       <h4 className="text-lg font-semibold text-gray-800 mb-4">Final Review</h4>
                      
//                       {/* Customer Info Summary */}
//                       <div className="bg-gradient-to-br from-gray-50 to-rose-50/30 rounded-2xl p-6 mb-6">
//                         <h5 className="font-semibold text-gray-800 mb-3">Shipping To:</h5>
//                         <div className="text-sm text-gray-600 space-y-1">
//                           <p className="font-medium">{customerForm.firstName} {customerForm.lastName}</p>
//                           <p>{customerForm.email}</p>
//                           {customerForm.phone && <p>{customerForm.phone}</p>}
//                           <p>{customerForm.address.street}</p>
//                           <p>{customerForm.address.city}, {customerForm.address.state} {customerForm.address.zip}</p>
//                           <p>{customerForm.address.country}</p>
//                         </div>
//                       </div>

//                       {/* Order Items */}
//                       <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-2xl p-6">
//                         <h5 className="font-semibold text-gray-800 mb-4">Order Items ({getTotalItems()})</h5>
//                         <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
//                           {cart.map(item => (
//                             <div key={item.cartId} className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
//                               <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
//                               <div className="flex-1">
//                                 <p className="text-sm font-medium text-gray-800">{item.name}</p>
//                                 <p className="text-xs text-gray-500">{item.selectedSize} · {item.selectedColor}</p>
//                               </div>
//                               <div className="text-right">
//                                 <p className="text-sm font-semibold text-gray-800">{convertPrice(item.price * item.quantity)}</p>
//                                 <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
//                               </div>
//                             </div>
//                           ))}
//                         </div>

//                         <div className="space-y-3 pt-4 border-t border-gray-200">
//                           <div className="flex justify-between text-sm text-gray-600">
//                             <span>Subtotal:</span>
//                             <span>{convertPrice(getSubtotal())}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-gray-600">
//                             <span>Tax (8%):</span>
//                             <span>{convertPrice(getTax())}</span>
//                           </div>
//                           <div className="flex justify-between text-sm text-gray-600">
//                             <div className="flex items-center">
//                               <span>Shipping:</span>
//                               {getShipping() === 0 && (
//                                 <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">FREE</span>
//                               )}
//                             </div>
//                             <span>{getShipping() === 0 ? 'Free' : convertPrice(getShipping())}</span>
//                           </div>
//                           <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t border-gray-200">
//                             <span>Total:</span>
//                             <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
//                               {convertPrice(getTotal())}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex gap-4 pt-6 border-t border-gray-200">
//                     <button
//                       onClick={() => setCurrentStep(1)}
//                       className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 flex items-center"
//                       disabled={loading}
//                     >
//                       <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
//                       Back to Info
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .animate-slide-in-right {
//           animation: slideInRight 0.3s ease-out;
//         }
        
//         @keyframes slideInRight {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default YuniqueFashionStore;



// ProductStore.tsx
import React, { useState } from 'react';
import {
  ShoppingCart, Star, Plus, Minus, CreditCard, User,
  CheckCircle, AlertCircle, X, Package, Trash2
} from 'lucide-react';
import axios from 'axios';
import CardForm from './YunoSdk';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  sku: string;
  category: string;
}

interface CartItem extends Product { quantity: number }

interface Customer {
  yunoCustomerId: string;
  name?: string;
  email?: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface CustomerForm {
  name: string;
  email: string;
  address: Address;
}

interface OrderData { _id: string }

interface CheckoutSessionResp {
  checkoutSession: string;
  clientSecret?: string | null;
}

const ProductStore = () => {
  // Products
const [products] = useState([
    {
      id: 1, 
      name: "Premium Silk Evening Dress", 
      price: 459.99,
      originalPrice: 599.99, 
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop",
      rating: 4.9, 
      reviews: 342, 
      description: "Luxurious silk evening dress with elegant draping and premium finish.",
      sku: "DRESS-001", 
      category: "Dresses", 
      trending: true,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Navy", "Burgundy"]
    },
    {
      id: 2, 
      name: "Designer Leather Handbag", 
      price: 329.99,
      originalPrice: 429.99, 
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop",
      rating: 4.7, 
      reviews: 189, 
      description: "Handcrafted leather handbag with gold hardware and premium lining.",
      sku: "BAG-001", 
      category: "Accessories", 
      trending: false,
      sizes: ["One Size"],
      colors: ["Brown", "Black", "Tan"]
    },
    {
      id: 3, 
      name: "Cashmere Blend Sweater", 
      price: 199.99,
      originalPrice: 279.99, 
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop",
      rating: 4.8, 
      reviews: 456, 
      description: "Ultra-soft cashmere blend sweater perfect for layering.",
      sku: "SWEATER-001", 
      category: "Knitwear", 
      trending: true,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Cream", "Grey", "Camel"]
    },
    {
      id: 4, 
      name: "Italian Leather Boots", 
      price: 389.99,
      originalPrice: 489.99, 
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=600&h=600&fit=crop",
      rating: 4.6, 
      reviews: 123, 
      description: "Handmade Italian leather boots with premium construction.",
      sku: "BOOTS-001", 
      category: "Footwear", 
      trending: false,
      sizes: ["36", "37", "38", "39", "40", "41"],
      colors: ["Black", "Brown", "Cognac"]
    },
    {
      id: 5, 
      name: "Silk Scarf Collection", 
      price: 129.99,
      originalPrice: 169.99, 
      image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=600&fit=crop",
      rating: 4.5, 
      reviews: 267, 
      description: "Premium silk scarf with exclusive Yunique patterns.",
      sku: "SCARF-001", 
      category: "Accessories", 
      trending: true,
      sizes: ["One Size"],
      colors: ["Floral", "Geometric", "Abstract"]
    },
    {
      id: 6, 
      name: "Tailored Blazer", 
      price: 299.99,
      originalPrice: 399.99, 
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop",
      rating: 4.8, 
      reviews: 198, 
      description: "Perfectly tailored blazer for the modern professional.",
      sku: "BLAZER-001", 
      category: "Outerwear", 
      trending: false,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Navy", "Charcoal"]
    }
  ]);



  // State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [checkoutSession, setCheckoutSession] = useState<CheckoutSessionResp | null>(null);

  const [customerForm, setCustomerForm] = useState<CustomerForm>({
    name: '', email: '',
    address: { street: '', city: '', state: '', zip: '', country: 'US' }
  });
  const [country, setCountry] = useState<'US' | 'CO' | 'BR' | 'AR' | 'CL'>('US');

  const API_BASE = 'http://localhost:5000/api';

  // Utility
  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'error') { setError(message); setSuccess(''); }
    else { setSuccess(message); setError(''); }
    setTimeout(() => { setError(''); setSuccess(''); }, 5000);
  };

  const calculateDiscount = (original: number, current: number) => Math.round(((original - current) / original) * 100);
  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);
  const getSubtotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getTax = () => getSubtotal() * 0.08;
  const getShipping = () => getSubtotal() > 100 ? 0 : 9.99;
  const getTotal = () => getSubtotal() + getTax() + getShipping();

  // Cart functions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === product.id);
      if (exist) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      const newItem: CartItem = { ...product, quantity: 1 };
      return [...prev, newItem];
    });
    showMessage(`${product.name} added to cart!`);
  };

  const updateQuantity = (id: number, qty: number) => {
    if (qty === 0) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
    showMessage('Item removed from cart');
  };

  // Backend calls
  const createCustomer = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${API_BASE}/customers`, customerForm);
      setCustomer(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      showMessage('Customer created!');
      return data.user as Customer;
    } catch (err: any) {
      showMessage(err.response?.data?.error || 'Failed to create customer', 'error');
      throw err;
    } finally { setLoading(false); }
  };

  const createOrder = async () => {
    try {
      setLoading(true);
      const payload = {
        items: cart.map(i => ({
          name: i.name, description: i.description, price: i.price, quantity: i.quantity, sku: i.sku, category: i.category
        })),
        subtotal: getSubtotal(),
        tax: getTax(),
        shipping: getShipping(),
        totalAmount: getTotal(),
        currency: 'USD',
        shippingAddress: customerForm.address
      };
      const { data } = await axios.post(`${API_BASE}/orders`, payload, { headers: { Authorization: `Bearer ${token}` } });
      setOrderData(data.order as OrderData);
      showMessage('Order created!');
      return data.order as OrderData;
    } catch (err: any) {
      showMessage(err.response?.data?.error || 'Failed to create order', 'error');
      throw err;
    } finally { setLoading(false); }
  };

  const createCheckoutSession = async (orderId: string) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${API_BASE}/payments/checkout-sessions`,
        { orderId, country },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCheckoutSession(data as CheckoutSessionResp);
      showMessage('Checkout session created!');
      return data as CheckoutSessionResp;
    } catch (err: any) {
      showMessage(err.response?.data?.error || 'Failed to create checkout session', 'error');
      throw err;
    } finally { setLoading(false); }
  };

  // After customer info form is submitted
  const handleCheckout = async () => {
    try {
      const createdCustomer = customer || await createCustomer();
      const order = await createOrder();
      const checkoutData = await createCheckoutSession(order._id);

      setCustomer(createdCustomer);
      setOrderData(order);
      setCheckoutSession(checkoutData);
      setCurrentStep(2); // move to payment step
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  const handleCustomerFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1] as keyof Address;
      setCustomerForm(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
    } else setCustomerForm(prev => ({ ...prev, [name]: value } as CustomerForm));
  };

  const handlePayment = async (payment: { oneTimeToken?: string }) => {
    if (!payment.oneTimeToken) {
      showMessage("Payment token missing!", "error");
      return;
    }
    if (orderData && checkoutSession) {
      try {
        setLoading(true);
        const payload = {
          orderId: orderData._id,
          customer_session: checkoutSession.checkoutSession,
          checkout_session: checkoutSession.checkoutSession,
          oneTimeToken: payment.oneTimeToken
        };
        const { data } = await axios.post(
          `${API_BASE}/payments/create-payment`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.status === "APPROVED" || data.status === "SUCCEEDED") {
          showMessage("Payment Successful!");
          setCart([]);
          setShowCheckout(false);
          setCurrentStep(1);
          setOrderData(null);
          setCheckoutSession(null);
        } else {
          showMessage(`Payment Failed: ${data.status}`, "error");
        }
      } catch (err: any) {
        showMessage(`Payment Error: ${err.response?.data?.error || err.message}`, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // JSX
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 p-4 sm:p-6">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Package className="h-5 w-5" />
            </div>
            <span className="font-semibold text-lg">Yuno Store</span>
          </div>
          <div className="flex items-center gap-3">
            {error && (
              <div className="hidden md:flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-sm text-red-700 border border-red-200">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
                <button onClick={() => setError('')} className="ml-1 text-red-600 hover:text-red-800"><X className="h-4 w-4" /></button>
              </div>
            )}
            {success && (
              <div className="hidden md:flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 border border-emerald-200">
                <CheckCircle className="h-4 w-4" />
                <span>{success}</span>
                <button onClick={() => setSuccess('')} className="ml-1 text-emerald-600 hover:text-emerald-800"><X className="h-4 w-4" /></button>
              </div>
            )}
            <button
              onClick={() => setShowCart(true)}
              className="relative inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full bg-slate-900 px-1.5 text-xs text-white flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Elevate your everyday with premium Clothing
              </h1>
              <p className="mt-4 text-slate-600 text-base sm:text-lg">
                Curated tech, transparent pricing, and secure checkout powered by Yuno.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href="#products" className="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-5 py-2.5 text-sm font-medium shadow hover:bg-slate-800">
                  Shop Featured
                </a>
                <button
                  onClick={() => setShowCart(true)}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium shadow hover:bg-slate-50"
                >
                  View Cart
                </button>
              </div>
              <div className="mt-6 flex items-center gap-6 text-slate-600 text-sm">
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-600" /> Secure Payments</div>
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-600" /> Fast Shipping</div>
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-600" /> 24/7 Support</div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-600 shadow-xl ring-1 ring-slate-900/10 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <div className="mx-auto h-14 w-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center mb-4">
                    <Package className="h-7 w-7" />
                  </div>
                  <p className="text-xl font-semibold">Modern Shopping Experience</p>
                  <p className="mt-2 text-white/80 text-sm">Beautiful UI. Smooth checkout.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main id="products" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Featured Products</h2>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p.id} className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative">
                <img src={p.image} alt={p.name} className="h-52 w-full object-cover" />
                {p.originalPrice > p.price && (
                  <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white shadow">
                    -{calculateDiscount(p.originalPrice, p.price)}%
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-medium line-clamp-1">{p.name}</h3>
                <p className="mt-1 text-sm text-slate-600 line-clamp-2">{p.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold">${p.price}</span>
                    {p.originalPrice > p.price && (
                      <span className="text-sm text-slate-400 line-through">${p.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(p.rating) ? '' : 'text-slate-300'}`} />
                    ))}
                    <span className="ml-1 text-xs text-slate-500">({p.reviews})</span>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(p)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4" /> Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Drawer */}
      <div className={`${showCart ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} fixed inset-0 z-40 transition`}> 
        {/* Backdrop below drawer */}
        <div
          onClick={() => setShowCart(false)}
          className={`${showCart ? 'opacity-100' : 'opacity-0'} absolute inset-0 bg-slate-900/40 transition-opacity z-0`}
        />
        <div
          className={`${showCart ? 'translate-x-0' : 'translate-x-full'} absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl ring-1 ring-slate-900/10 transition-transform z-10`}
        >
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
            <h3 className="text-base font-semibold">Your Cart</h3>
            <button onClick={() => setShowCart(false)} className="rounded-md p-2 hover:bg-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex h-[calc(100%-4rem)] flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center text-slate-600">
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(i => (
                    <div key={i.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-4">
                      <img src={i.image} alt={i.name} className="h-16 w-16 rounded-md object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{i.name}</p>
                        <p className="text-sm text-slate-600">${i.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(i.id, i.quantity - 1)} className="rounded-md border border-slate-300 p-1 hover:bg-slate-50"><Minus className="h-4 w-4" /></button>
                        <span className="w-6 text-center text-sm">{i.quantity}</span>
                        <button onClick={() => updateQuantity(i.id, i.quantity + 1)} className="rounded-md border border-slate-300 p-1 hover:bg-slate-50"><Plus className="h-4 w-4" /></button>
                        <button onClick={() => removeFromCart(i.id)} className="rounded-md p-1 text-slate-500 hover:bg-slate-100"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-slate-200 p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1.5"><span>Subtotal</span><span>${getSubtotal().toFixed(2)}</span></div>
                <div className="flex justify-between py-1.5"><span>Tax (8%)</span><span>${getTax().toFixed(2)}</span></div>
                <div className="flex justify-between py-1.5"><span>Shipping</span><span>${getShipping().toFixed(2)}</span></div>
                <div className="flex justify-between py-1.5 font-semibold text-slate-900"><span>Total</span><span>${getTotal().toFixed(2)}</span></div>
              </div>
              <button
                onClick={() => { setShowCart(false); setShowCheckout(true); }}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-slate-800"
              >
                <CreditCard className="h-4 w-4" /> Secure checkout
              </button>
            </div>
          </div>
        </div>
        
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowCheckout(false)} className="absolute inset-0 bg-slate-900/50" />
          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2 text-sm">
                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${currentStep >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <User className="h-4 w-4" /> Customer
                </div>
                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${currentStep >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <CreditCard className="h-4 w-4" /> Payment
                </div>
              </div>
              <button onClick={() => setShowCheckout(false)} className="rounded-md p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>

            {currentStep === 1 && (
              <div className="px-5 py-5">
                <h3 className="text-base font-semibold">Customer information</h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20" type="text" name="name" placeholder="Full Name" value={customerForm.name} onChange={handleCustomerFormChange} required />
                  <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20" type="email" name="email" placeholder="Email" value={customerForm.email} onChange={handleCustomerFormChange} required />
                  <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 sm:col-span-2" type="text" name="address.street" placeholder="Street" value={customerForm.address.street} onChange={handleCustomerFormChange} required />
                  <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20" type="text" name="address.city" placeholder="City" value={customerForm.address.city} onChange={handleCustomerFormChange} required />
                  <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20" type="text" name="address.state" placeholder="State" value={customerForm.address.state} onChange={handleCustomerFormChange} required />
                  <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20" type="text" name="address.zip" placeholder="ZIP" value={customerForm.address.zip} onChange={handleCustomerFormChange} required />
                  <select
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                    name="address.country"
                    value={customerForm.address.country}
                    onChange={(e) => {
                      handleCustomerFormChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
                      setCountry(e.target.value as 'US' | 'CO' | 'BR' | 'AR' | 'CL');
                    }}
                    required
                  >
                    <option value="" disabled>Country</option>
                    <option value="US">US</option>
                    <option value="CO">CO</option>
                    <option value="BR">BR</option>
                    <option value="AR">AR</option>
                    <option value="CL">CL</option>
                  </select>
                </div>
                <div className="mt-5 flex items-center justify-end gap-3">
                  <button onClick={() => setShowCheckout(false)} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">Cancel</button>
                  <button onClick={handleCheckout} disabled={loading || !customerForm.name || !customerForm.email} className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60">
                    {loading ? 'Processing…' : 'Continue to payment'}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="px-5 py-5">
                <h3 className="text-base font-semibold">Payment information</h3>
                {checkoutSession?.checkoutSession ? (
                  <div className="mt-4 rounded-xl border border-slate-200 p-4 sm:p-5">
                    <CardForm
                      orderId={orderData?._id}
                      checkoutSessionId={checkoutSession.checkoutSession}
                      countryCode={country}
                      customerName={(customerForm?.name || '').trim()}
                      customerEmail={customerForm.email}
                      onSuccess={(data) => handlePayment(data as { oneTimeToken?: string })}
                      onError={(e) => showMessage(e.message || 'Payment error', 'error')}
                      setShowCheckout={setShowCheckout}
                      showMessage={showMessage}
                    />
                  </div>
                ) : (
                  <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    <p>Initializing payment…</p>
                    {loading && <p className="mt-1 text-slate-600">Please wait while we set up your payment…</p>}
                  </div>
                )}
                <div className="mt-5 flex items-center justify-between">
                  <button onClick={() => setCurrentStep(1)} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50" disabled={loading}>
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductStore;
