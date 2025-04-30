import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="font-bold text-xl">
          Store Rating App
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/stores" className="px-3 py-2">
                  Stores
                </Nav.Link>
                {user?.role === 'admin' && (
                  <Dropdown as={Nav.Item}>
                    <Dropdown.Toggle as={Nav.Link} className="px-3 py-2">
                      Admin
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/admin/users">Users</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/stores">Stores</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                {user?.role === 'store_owner' && (
                  <Nav.Link as={Link} to="/store-owner" className="px-3 py-2">
                    My Store
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>

          <Nav className="ml-auto flex items-center">
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" id="dropdown-user">
                  <span className="mr-2">{user?.name}</span>
                  <i className="bi bi-person-circle"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/change-password">
                    Change Password
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-light" 
                  className="me-2"
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/signup" 
                  variant="primary"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;