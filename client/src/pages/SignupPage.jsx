import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validated, setValidated] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (formData.name.length < 20 || formData.name.length > 60) {
      setError('Name must be between 20 and 60 characters');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.address.length > 400) {
      setError('Address must be less than 400 characters');
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be 8-16 characters with at least one uppercase and one special character');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setValidated(true);

    if (!validateForm()) return;

    try {
      const result = await signup({
        name: formData.name,
        email: formData.email,
        address: formData.address,
        password: formData.password
      });

      if (result.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          address: '',
          password: '',
          confirmPassword: ''
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Account created successfully! Redirecting to login...</Alert>}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {/* Name */}
            <Form.Group controlId="name" className="mb-4">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={20}
                maxLength={60}
                isInvalid={validated && (formData.name.length < 20 || formData.name.length > 60)}
              />
              <Form.Control.Feedback type="invalid">
                Name must be between 20 and 60 characters
              </Form.Control.Feedback>
            </Form.Group>

            {/* Email */}
            <Form.Group controlId="email" className="mb-4">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                isInvalid={validated && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email address
              </Form.Control.Feedback>
            </Form.Group>

            {/* Address */}
            <Form.Group controlId="address" className="mb-4">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
                maxLength={400}
                isInvalid={validated && formData.address.length > 400}
              />
              <Form.Control.Feedback type="invalid">
                Address must be less than 400 characters
              </Form.Control.Feedback>
            </Form.Group>

            {/* Password */}
            <Form.Group controlId="password" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                isInvalid={validated && !/^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/.test(formData.password)}
              />
              <Form.Control.Feedback type="invalid">
                Password must be 8-16 characters with at least one uppercase and one special character
              </Form.Control.Feedback>
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group controlId="confirmPassword" className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                isInvalid={validated && formData.password !== formData.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                Passwords do not match
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-full py-2">
              Sign Up
            </Button>
          </Form>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
