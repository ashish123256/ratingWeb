import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { userAPI } from '../../api/api';


const CreateUserPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user'
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when field changes
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 20 || formData.name.length > 60) {
      errors.name = 'Name must be between 20 and 60 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.address.length > 400) {
      errors.address = 'Address must be less than 400 characters';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!/^(?=.*[A-Z])(?=.*[!@#$&*]).{8,16}$/.test(formData.password)) {
      errors.password = 'Password must be 8-16 characters with at least one uppercase and one special character';
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
      await userAPI.create(formData);
      navigate('/admin/users', {
        state: {
          toast: {
            type: 'success',
            message: 'User created successfully!'
          }
        }
      });
    } catch (err) {
      if (err.response?.data?.errors) {
        // Backend validation errors
        setValidationErrors(err.response.data.errors);
      } else {
        setSubmitError(
          err.response?.data?.message || 
          'Failed to create user. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-user-page">
      <h2 className="mb-4">Create New User</h2>
      
      {submitError && (
        <Alert variant="danger" className="mb-4">
          {submitError}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Full Name *</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            isInvalid={!!validationErrors.name}
            required
            minLength={20}
            maxLength={60}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.name}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            Must be 20-60 characters
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email *</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!validationErrors.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="address"
            value={formData.address}
            onChange={handleChange}
            isInvalid={!!validationErrors.address}
            maxLength={400}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.address}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            {formData.address.length}/400 characters
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password *</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!validationErrors.password}
            required
            minLength={8}
            maxLength={16}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.password}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            8-16 characters with at least one uppercase and one special character
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-4" controlId="role">
          <Form.Label>Role *</Form.Label>
          <Form.Control
            as="select"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">Normal User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </Form.Control>
        </Form.Group>

        <div className="d-flex justify-content-end gap-2">
          <Button
            variant="outline-secondary"
            onClick={() => navigate('/admin/users')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
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
                Creating...
              </>
            ) : (
              'Create User'
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateUserPage;