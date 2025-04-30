import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import { Table, Form, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users', { params: filters });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="user-list-page">
      <h2>User Management</h2>
      <Link to="/admin/create-user" className="btn btn-primary mb-3">
        Create New User
      </Link>

      <div className="filter-section mb-4 p-3 border rounded">
        <h5>Filters</h5>
        <Form>
          <Row>
            <Col md={3}>
              <Form.Group controlId="nameFilter">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="emailFilter">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={filters.email}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="addressFilter">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={filters.address}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="roleFilter">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  name="role"
                  value={filters.role}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="store_owner">Store Owner</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="info" size="sm" as={Link} to={`/admin/users/${user.id}`}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserListPage;