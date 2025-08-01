import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, NavDropdown, Spinner } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { useGetCartQuery } from '../slices/cartApiSlice';
import SearchBox from './SearchBox';
import logo from '../assets/zeusLogo.png';
import '../assets/styles/header.css';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();
  const [logoutApi] = useLogoutMutation();

  const {
    data: cartData,
    isLoading: loadingCart,
    error: cartError,
  } = useGetCartQuery(undefined, {
    skip: !userInfo,
  });

  const cartItems = cartData?.cartItems || [];




  const logoutHandler = async () => {
    try {
      await logoutApi().unwrap();
      logout();              // ✅ clears localStorage + context
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };


  const totalCartQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className='border-bottom border-3'>
      <Navbar expand='md' collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to='/'>
            <img
              src={logo}
              alt='ZeusLogo'
              width='auto'
              height={75}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <SearchBox />
              <LinkContainer to='/cart'>
                <Nav.Link className='text-cyan'>
                  <FaShoppingCart className='me-1' /> Cart
                  {loadingCart ? (
                    <Spinner />
                  ) : (
                    <Badge pill bg='primary' className='ms-2'>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}


                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown
                  title={userInfo.name}
                  id='username'
                  className='text-cyan'
                >
                  <LinkContainer
                    to='/profile'
                    activeStyle={{
                      backgroundColor: '#D3592A',
                    }}
                  >
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link className='text-cyan'>
                    <FaUser className='me-1' /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title='Admin'
                  id='adminmenu'
                  className='text-cyan'
                >
                  <LinkContainer
                    to='/admin/orderlist'
                    activeStyle={{
                      backgroundColor: '#D3592A',
                    }}
                  /*Not sure what the purpose for activeStyle is*/
                  >
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer
                    to='/admin/productlist'
                    activeStyle={{
                      backgroundColor: '#D3592A',
                    }}
                  >
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer
                    to='/admin/userlist'
                    activeStyle={{
                      backgroundColor: '#D3592A',
                    }}
                  >
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
