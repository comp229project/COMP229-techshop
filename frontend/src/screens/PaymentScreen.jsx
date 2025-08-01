import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';
import { useAuth } from '../context/AuthContext';
import { useGetCartQuery, useAddToCartMutation } from '../slices/cartApiSlice';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const { data: cart } = useGetCartQuery(undefined, { skip: !userInfo });
  const [addToCart] = useAddToCartMutation();

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  useEffect(() => {
    if (!cart?.shippingAddress?.address) {
      navigate('/shipping');
    }
  }, [cart, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const firstItem = cart?.cartItems?.[0];
      if (!firstItem) throw new Error('Cart is empty');

      await addToCart({
        productId: firstItem.product,
        qty: firstItem.qty,
        paymentMethod,
      }).unwrap();

      navigate('/placeorder');
    } catch (err) {
      console.error('❌ Failed to update payment method:', err);
    }
  };

  return (
    <FormContainer>
      <Meta title='TechShop' />
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              className='my-2'
              type='radio'
              label='PayPal or Credit Card'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>
        <Button
          className='my-3'
          type='submit'
          style={{
            backgroundColor: '#D3592A',
            border: 'none',
          }}
        >
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
