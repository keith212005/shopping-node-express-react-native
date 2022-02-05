import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

export const HomeNavBar = () => {
  return (
    <Navbar expand="lg" variant="light" bg="light">
      <Container>
        <Navbar.Brand href="#home">Dashboard</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav.Link href="/">Logout</Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
