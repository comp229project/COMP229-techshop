import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';
import { useAuth } from '../context/AuthContext';
import {
  useGetCartQuery,
  useAddToCartMutation,
} from '../slices/cartApiSlice';

const ShippingScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const { data: cart, refetch } = useGetCartQuery(undefined, {
    skip: !userInfo,
  });

  const [addToCart] = useAddToCartMutation();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    if (cart?.shippingAddress) {
      setAddress(cart.shippingAddress.address || '');
      setCity(cart.shippingAddress.city || '');
      setPostalCode(cart.shippingAddress.postalCode || '');
      setCountry(cart.shippingAddress.country || '');
    }
  }, [cart]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!cart?.cartItems?.length) {
        throw new Error('Cart is empty');
      }

      const firstItem = cart.cartItems[0];

      await addToCart({
        productId: firstItem.product,
        qty: firstItem.qty,
        shippingAddress: { address, city, postalCode, country },
      }).unwrap();

      console.log('✅ Shipping saved. Navigating to payment...');
      navigate('/payment');
    } catch (err) {
      console.error('❌ Failed to save shipping address:', err);
    }
  };

  return (
    <FormContainer>
      <Meta title={'Z.US'} />
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address' className='my-2'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter address'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='city' className='my-2'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter city'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='postalCode' className='my-2'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter postal code'
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='country' className='my-2'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter country'
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          />
        </Form.Group>

        <Button
          type='submit'
          className='my-2 btn-cyan'
        >
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
