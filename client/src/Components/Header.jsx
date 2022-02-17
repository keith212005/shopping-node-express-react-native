import React, { memo } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import { getStorageItem } from '../storage/LocalStorage';
import { storageKey } from '../constants/keys';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  console.log('header rendered.....');
  const isAuthenticated = isEmpty(getStorageItem(storageKey.ACCESS_TOKEN));
  const navigate = useNavigate();

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt=""
              src="https://codesign.com.bd/conversations/content/images/2020/03/Sprint-logo-design-Codesign-agency.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            To Do App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {isAuthenticated ? (
                <>
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/signup">Sign Up</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link
                    onClick={async () => {
                      await localStorage.clear();
                      navigate('/');
                    }}
                  >
                    Logout
                  </Nav.Link>
                  <Nav.Link onClick={() => navigate('/Profile')}>
                    Profile
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
