import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Spinner,Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';


const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signin } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Use the login function from your auth context
      const result = await signin(formData.email, formData.password);
      
      if (result.success) {
        navigate('/', {
          state: {
            toast: {
              type: 'success',
              message: 'Logged in successfully!'
            }
          }
        });
      } else {
        setSubmitError(result.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setSubmitError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center min-vh-100">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Card className="shadow-sm">
          <Card.Body>
            <h2 className="text-center mb-4">Login</h2>
            
            {submitError && (
              <Alert variant="danger" className="mb-4">
                {submitError}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.email}
                  placeholder="Enter email"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password *</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!validationErrors.password}
                  placeholder="Password"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mb-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>

              <div className="text-center">
                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot password?
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>

        <div className="text-center mt-3">
          Don't have an account?{' '}
          <Link to="/signup" className="text-decoration-none">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;