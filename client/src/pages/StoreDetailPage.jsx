import React, { useState, useEffect } from 'react';
import axios from '../api/api';
import { useParams } from 'react-router-dom';
import { Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import StarRating from '../components/StarRating';

const StoreDetailPage = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [ratingValue, setRatingValue] = useState(3);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const [storeResponse, ratingResponse] = await Promise.all([
          axios.get(`/api/stores/${id}`),
          axios.get(`/api/ratings/user/${id}`)
        ]);
        
        setStore(storeResponse.data);
        setUserRating(ratingResponse.data);
        if (ratingResponse.data) {
          setRatingValue(ratingResponse.data.rating);
          setComment(ratingResponse.data.comment || '');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch store data');
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [id]);

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (userRating) {
        // Update existing rating
        await axios.put(`/api/ratings/${userRating.id}`, {
          rating: ratingValue,
          comment
        });
        setSuccess('Rating updated successfully!');
      } else {
        // Submit new rating
        await axios.post('/api/ratings', {
          storeId: id,
          rating: ratingValue,
          comment
        });
        setSuccess('Rating submitted successfully!');
        
        // Refresh data
        const [storeResponse, ratingResponse] = await Promise.all([
          axios.get(`/api/stores/${id}`),
          axios.get(`/api/ratings/user/${id}`)
        ]);
        setStore(storeResponse.data);
        setUserRating(ratingResponse.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="store-detail-page">
      <h2>{store.name}</h2>
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Store Information</Card.Title>
              <Card.Text>
                <strong>Email:</strong> {store.email}<br />
                <strong>Address:</strong> {store.address}<br />
                <strong>Average Rating:</strong> {store.avgRating || 'No ratings yet'}
                {store.avgRating && (
                  <>
                    {' '}({store.ratings.length} ratings)
                  </>
                )}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>Submit Your Rating</Card.Title>
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleSubmitRating}>
                <Form.Group controlId="rating">
                  <Form.Label>Your Rating</Form.Label>
                  <div>
                    <StarRating
                      rating={ratingValue}
                      onRatingChange={setRatingValue}
                    />
                  </div>
                </Form.Group>

                <Form.Group controlId="comment">
                  <Form.Label>Comment (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={500}
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  {userRating ? 'Update Rating' : 'Submit Rating'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Owner Information</Card.Title>
              {store.owner && (
                <Card.Text>
                  <strong>Name:</strong> {store.owner.name}<br />
                  <strong>Email:</strong> {store.owner.email}
                </Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StoreDetailPage;