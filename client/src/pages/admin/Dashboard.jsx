import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import { Card, Row, Col, Spinner } from 'react-bootstrap';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard statistics');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text className="display-4">{stats.totalUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Stores</Card.Title>
              <Card.Text className="display-4">{stats.totalStores}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Ratings</Card.Title>
              <Card.Text className="display-4">{stats.totalRatings}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;