import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  return (
    <div className="user-dashboard">
      <h2>User Dashboard</h2>
      <div className="mt-4">
        <Card>
          <Card.Body>
            <Card.Title>Welcome to Store Rating System</Card.Title>
            <Card.Text>
              You can browse stores and submit ratings for your favorite stores.
            </Card.Text>
            <Link to="/stores" className="btn btn-primary">
              Browse Stores
            </Link>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;