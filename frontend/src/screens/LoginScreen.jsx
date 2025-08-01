import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useLoginMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [loginApi, { isLoading }] = useLoginMutation();
  const { login } = useAuth(); // from AuthContext
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect]);

const submitHandler = async (e) => {
  e.preventDefault();
  try {
    const res = await loginApi({ email, password }).unwrap(); // ✅ RTK mutation
    login(res); // ✅ update AuthContext
    window.location.reload()
    toast.success('Login successful');
    navigate(redirect);
  } catch (err) {
    toast.error(err?.data?.message || err.message);
  }
};

  return (
    <FormContainer>
      <Meta title={'TechShop'} />
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='password' className='my-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type='submit'
          variant='primary'
          className='mt-2'
          disabled={isLoading}
        >
          Sign In
        </Button>
        {isLoading && <Loader />}
      </Form>
      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            className='text-decoration-none'
          >
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
