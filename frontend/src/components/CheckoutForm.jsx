// Enhanced Checkout Form component with neon theme
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../styles/ThemeProvider';
import { validateEmail } from '../utils/validateForm';
import styles from '../styles/CheckoutForm.module.css';

function CheckoutForm({ onSuccess }) {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Shipping Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const steps = [
    { id: 1, label: 'Personal', icon: '👤' },
    { id: 2, label: 'Shipping', icon: '📦' },
    { id: 3, label: 'Payment', icon: '💳' }
  ];

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return validateEmail(value) ? '' : 'Please enter a valid email address';
      case 'firstName':
      case 'lastName':
        return value.trim().length >= 2 ? '' : 'Must be at least 2 characters';
      case 'phone':
        return /^\d{10}$/.test(value.replace(/\D/g, '')) ? '' : 'Please enter a valid 10-digit phone number';
      case 'address':
        return value.trim().length >= 5 ? '' : 'Please enter a complete address';
      case 'city':
        return value.trim().length >= 2 ? '' : 'Please enter a valid city';
      case 'zipCode':
        return /^\d{6}$/.test(value) ? '' : 'Please enter a valid 6-digit PIN code';
      case 'cardNumber':
        return /^\d{16}$/.test(value.replace(/\s/g, '')) ? '' : 'Please enter a valid 16-digit card number';
      case 'expiryDate':
        return /^(0[1-9]|1[0-2])\/\d{2}$/.test(value) ? '' : 'Please enter MM/YY format';
      case 'cvv':
        return /^\d{3,4}$/.test(value) ? '' : 'Please enter a valid CVV';
      case 'cardName':
        return value.trim().length >= 2 ? '' : 'Please enter the name on card';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format specific fields
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    } else if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'zipCode') {
      formattedValue = value.replace(/\D/g, '').slice(0, 6);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      ['firstName', 'lastName', 'email', 'phone'].forEach(field => {
        const error = validateField(field, formData[field]);
        if (error) errors[field] = error;
      });
    } else if (step === 2) {
      ['address', 'city', 'state', 'zipCode'].forEach(field => {
        const error = validateField(field, formData[field]);
        if (error) errors[field] = error;
      });
    } else if (step === 3) {
      ['cardNumber', 'expiryDate', 'cvv', 'cardName'].forEach(field => {
        const error = validateField(field, formData[field]);
        if (error) errors[field] = error;
      });
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: "mock",
          customerInfo: formData
        }),
      });
      
      if (!res.ok) throw new Error('Checkout failed');
      const data = await res.json();
      onSuccess(data.receipt);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderFormField = (name, label, type = 'text', placeholder = '') => (
    <div className={styles.inputGroup}>
      <label htmlFor={name} className={styles.inputLabel}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`${styles.inputField} ${fieldErrors[name] ? styles.inputError : ''}`}
      />
      <AnimatePresence>
        {fieldErrors[name] && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.errorMessage}
          >
            ⚠️ {fieldErrors[name]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderPersonalInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.sectionTitle}>Personal Information</div>
      <div className={`${styles.formGrid} ${styles.formGridTwo}`}>
        {renderFormField('firstName', 'First Name', 'text', 'Enter your first name')}
        {renderFormField('lastName', 'Last Name', 'text', 'Enter your last name')}
      </div>
      <div className={styles.formGrid}>
        {renderFormField('email', 'Email Address', 'email', 'Enter your email address')}
        {renderFormField('phone', 'Phone Number', 'tel', 'Enter your 10-digit phone number')}
      </div>
    </motion.div>
  );

  const renderShippingInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.sectionTitle}>Shipping Address</div>
      <div className={styles.formGrid}>
        {renderFormField('address', 'Street Address', 'text', 'Enter your complete address')}
        <div className={`${styles.formGrid} ${styles.formGridTwo}`}>
          {renderFormField('city', 'City', 'text', 'Enter your city')}
          {renderFormField('state', 'State', 'text', 'Enter your state')}
        </div>
        <div className={`${styles.formGrid} ${styles.formGridTwo}`}>
          {renderFormField('zipCode', 'PIN Code', 'text', 'Enter 6-digit PIN code')}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Country</label>
            <input
              type="text"
              value="India"
              disabled
              className={styles.inputField}
              style={{ opacity: 0.7 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderPaymentInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.sectionTitle}>Payment Information</div>
      <div className={styles.formGrid}>
        {renderFormField('cardNumber', 'Card Number', 'text', '1234 5678 9012 3456')}
        {renderFormField('cardName', 'Name on Card', 'text', 'Enter name as on card')}
        <div className={`${styles.formGrid} ${styles.formGridTwo}`}>
          {renderFormField('expiryDate', 'Expiry Date', 'text', 'MM/YY')}
          {renderFormField('cvv', 'CVV', 'text', '123')}
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleCheckout}
      className={styles.checkoutForm}
    >
      {/* Progress Indicator */}
      <div className={styles.progressIndicator}>
        {steps.map((step) => (
          <div
            key={step.id}
            className={`${styles.progressStep} ${
              step.id === currentStep ? styles.progressStepActive : ''
            }`}
          >
            <div
              className={`${styles.progressCircle} ${
                step.id === currentStep
                  ? styles.progressCircleActive
                  : step.id < currentStep
                  ? styles.progressCircleCompleted
                  : ''
              }`}
            >
              {step.id < currentStep ? '✓' : step.icon}
            </div>
            <div
              className={`${styles.progressLabel} ${
                step.id === currentStep ? styles.progressLabelActive : ''
              }`}
            >
              {step.label}
            </div>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className={styles.formSection}>
        <AnimatePresence mode="wait">
          {currentStep === 1 && renderPersonalInfo()}
          {currentStep === 2 && renderShippingInfo()}
          {currentStep === 3 && renderPaymentInfo()}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        {currentStep > 1 && (
          <motion.button
            type="button"
            onClick={handlePrevious}
            className={styles.submitButton}
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              flex: '0 0 auto',
              width: 'auto',
              padding: '1rem 2rem'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ← Previous
          </motion.button>
        )}
        
        {currentStep < 3 ? (
          <motion.button
            type="button"
            onClick={handleNext}
            className={styles.submitButton}
            style={{ flex: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Next →
          </motion.button>
        ) : (
          <motion.button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
            style={{ flex: 1 }}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading && <span className={styles.loadingSpinner}></span>}
            {loading ? 'Processing...' : 'Complete Purchase'}
          </motion.button>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.errorAlert}
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}

export default CheckoutForm;
