import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { storeAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const StoreListPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Using the storeAPI service
        const response = await storeAPI.getAll();
        
        // Ensure we're working with response.data
        const storesData = response.data || [];
        
        // Transform data to include average rating if not provided by backend
        const storesWithRatings = storesData.map(store => ({
          ...store,
          avgRating: store.avgRating ? parseFloat(store.avgRating).toFixed(1) : null,
          ratingCount: store.ratingCount || 0
        }));
        
        setStores(storesWithRatings);
      } catch (err) {
        console.error('Fetch stores error:', err);
        setError(err.response?.data?.message || 'Failed to fetch stores. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleCreateStore = () => {
    navigate('/admin/stores/new');
  };

  const handleViewStore = (storeId) => {
    navigate(`/stores/${storeId}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        {error}
      </Alert>
    );
  }

  return (
    <div className="store-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Stores</h2>
        {user?.role === 'admin' && (
          <Button 
            variant="primary" 
            onClick={handleCreateStore}
            disabled={loading}
          >
            Add New Store
          </Button>
        )}
      </div>

      {stores.length === 0 ? (
        <Alert variant="info">No stores found</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.address}</td>
                <td>
                  {store.avgRating ? (
                    <Badge bg="info">
                      {store.avgRating}/5 ({store.ratingCount})
                    </Badge>
                  ) : (
                    <Badge bg="secondary">No ratings</Badge>
                  )}
                </td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm"
                    onClick={() => handleViewStore(store.id)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default StoreListPage;