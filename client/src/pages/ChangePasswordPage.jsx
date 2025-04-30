import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Alert } from 'react-bootstrap';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { changePassword } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const result = await changePassword(formData.oldPassword, formData.newPassword);
      if (result.success) {
        setSuccess(true);
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to change password');
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Password changed successfully!</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="oldPassword">
          <Form.Label>Current Password</Form.Label>
          <Form.Control
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="newPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <Form.Text className="text-muted">
            Password must be 8-16 characters with at least one uppercase and one special character
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="confirmNewPassword">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Change Password
        </Button>
      </Form>
    </div>
  );
};

export default ChangePasswordPage;