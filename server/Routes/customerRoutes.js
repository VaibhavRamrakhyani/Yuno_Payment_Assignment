import express from 'express';
import {
  createCustomer,
  getCustomer,
  updateCustomer,
  getCustomerPaymentMethods,
  deleteCustomer
} from '../Controller/customerController.js';
import { authenticateToken, authenticatePayment } from '../Authentication/authMiddleware.js';

const router = express.Router();

// Create customer (public route - creates user account)
router.post('/', createCustomer);

// Get customer information (authenticated)
router.get('/:customerId', authenticateToken, getCustomer);

// Update customer information (authenticated)
router.put('/:customerId', authenticateToken, updateCustomer);

// Get customer payment methods (authenticated)
router.get('/:customerId/payment-methods', authenticateToken, getCustomerPaymentMethods);

// Delete customer (authenticated)
router.delete('/:customerId', authenticateToken, deleteCustomer);

export default router;
