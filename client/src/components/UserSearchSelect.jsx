import React, { useState, useEffect } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import axios from '../api/api';

const UserSearchSelect = ({ onUserSelected, isInvalid }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.length < 2) {
        setUsers([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`/api/admin/users/search?q=${searchTerm}`);
        setUsers(response.data);
      } catch (err) {
        console.error('Error searching users:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchUsers, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelect = (user) => {
    setSelectedUser(user);
    onUserSelected(user);
    setSearchTerm(user.name);
    setUsers([]);
  };

  return (
    <div className="user-search-select">
      <Form.Control
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users by name or email"
        isInvalid={isInvalid}
      />
      
      {loading && (
        <div className="mt-2">
          <Spinner animation="border" size="sm" />
        </div>
      )}

      {users.length > 0 && !loading && (
        <div className="search-results mt-2 border rounded shadow-sm">
          {users.map(user => (
            <div 
              key={user.id} 
              className="p-2 hover-bg cursor-pointer"
              onClick={() => handleSelect(user)}
            >
              {user.name} ({user.email})
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <div className="mt-2 p-2 bg-light rounded">
          Selected: <strong>{selectedUser.name}</strong>
          <button 
            className="btn btn-sm btn-link text-danger"
            onClick={() => {
              setSelectedUser(null);
              onUserSelected(null);
              setSearchTerm('');
            }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default UserSearchSelect;