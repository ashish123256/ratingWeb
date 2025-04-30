import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { storeAPI } from '../../api/api';
import UserSearchSelect from '../../components/UserSearchSelect';

const CreateStorePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: null
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

  const handleOwnerSelect = (selectedUser) => {
    setFormData(prev => ({
      ...prev,
      ownerId: selectedUser ? selectedUser.id : null
    }));
    if (validationErrors.ownerId) {
      setValidationErrors(prev => ({
        ...prev,
        ownerId: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Store name is required';
    } else if (formData.name.length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.address.length > 400) {
      errors.address = 'Address must be less than 400 characters';
    }

 
    if (!formData.ownerId) {
      errors.ownerId = 'Please select a store owner';
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
      
      await storeAPI.create(formData);
      navigate('/admin/stores', {
        state: { 
          toast: {
            type: 'success',
            message: `Store "${formData.name}" created successfully!`
          }
        }
      });
    } catch (err) {
      // Handle different types of errors
      if (err.response) {
        // Backend validation errors
        if (err.response.status === 400 && err.response.data.errors) {
          setValidationErrors(err.response.data.errors);
        } else {
          setSubmitError(err.response.data.message || 'Failed to create store');
        }
      } else if (err.request) {
        setSubmitError('Network error - please try again');
      } else {
        setSubmitError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-store-page">
      <Card className="shadow-sm">
        <Card.Header as="h5" className="py-3">
          Create New Store
        </Card.Header>
        <Card.Body>
          {submitError && (
            <Alert variant="danger" className="mb-4">
              {submitError}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-4" controlId="name">
              <Form.Label>Store Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!validationErrors.name}
                placeholder="Enter store name"
                maxLength={100}
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="email">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!validationErrors.email}
                placeholder="Enter store email"
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
                isInvalid={!!validationErrors.address}
                placeholder="Enter store address"
                maxLength={400}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.address}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                {formData.address.length}/400 characters
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4" controlId="owner">
              <Form.Label>Store Owner *</Form.Label>
              <UserSearchSelect 
                onUserSelected={handleOwnerSelect}
                isInvalid={!!validationErrors.ownerId}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.ownerId}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Select a registered user to assign as store owner
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/admin/stores')}
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
                  'Create Store'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateStorePage;