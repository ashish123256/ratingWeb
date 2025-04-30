import React, { useState, useEffect } from 'react';
import axios from "../api/api";
import { Card, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import StarRating from '../components/StarRating';

const StoreOwnerDashboard = () => {
  const [storeData, setStoreData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        // Fetch store owner's store data
        const storeResponse = await axios.get('/api/stores/my-store');
        setStoreData(storeResponse.data);

        // Fetch ratings for the store
        const ratingsResponse = await axios.get(`/api/ratings/store/${storeResponse.data.id}`);
        setRatings(ratingsResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch store data');
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-3">{error}</Alert>;
  }

  return (
    <div className="store-owner-dashboard">
      <h2 className="mb-4">My Store Dashboard</h2>
      
      {/* Store Summary Card */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="d-flex justify-content-between align-items-center">
            <span>{storeData.name}</span>
            {storeData.avgRating && (
              <Badge bg="primary" className="fs-6">
                Average Rating: {storeData.avgRating}/5
              </Badge>
            )}
          </Card.Title>
          <Card.Text>
            <strong>Address:</strong> {storeData.address}<br />
            <strong>Email:</strong> {storeData.email}<br />
            <strong>Total Ratings:</strong> {ratings.length}
          </Card.Text>
        </Card.Body>
      </Card>

      {/* Recent Ratings Table */}
      <Card className="shadow-sm">
        <Card.Header as="h5">Recent Ratings</Card.Header>
        <Card.Body>
          {ratings.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Date</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((rating) => (
                  <tr key={rating.id}>
                    <td>{rating.user?.name || 'Anonymous'}</td>
                    <td>
                      <StarRating rating={rating.rating} readonly />
                    </td>
                    <td>{new Date(rating.createdAt).toLocaleDateString()}</td>
                    <td>{rating.comment || 'No comment'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">No ratings yet for your store.</Alert>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default StoreOwnerDashboard;