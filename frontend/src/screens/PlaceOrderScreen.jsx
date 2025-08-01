import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { useAuth } from '../context/AuthContext';
import { useGetCartQuery } from '../slices/cartApiSlice';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const { data: cart, isLoading: loadingCart, error: errorCart, refetch: refetchCart } = useGetCartQuery(undefined, {
    skip: !userInfo,
  });

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  // Calculate prices
  const itemsPrice = cart?.cartItems?.reduce((acc, item) => acc + item.qty * item.price, 0) || 0;
  const shippingPrice = itemsPrice > 500 ? 0 : 25;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  useEffect(() => {
    if (!cart?.shippingAddress?.address) {
      navigate('/shipping');
    } else if (!cart?.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: Number(itemsPrice.toFixed(2)),
        shippingPrice,
        taxPrice,
        totalPrice: Number(totalPrice),
      }).unwrap();
      await refetchCart();
      navigate(`/order/${res._id}`);
      window.location.reload(); // refreshes entire app state (quick fix)
    } catch (err) {
      toast.error(err?.data?.message || err.message || 'Order failed');
    }
  };

  return (
    <>
      <Meta title={'TechShop'} />
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>{' '}
                {cart?.shippingAddress?.address}, {cart?.shippingAddress?.city}{' '}
                {cart?.shippingAddress?.postalCode},{' '}
                {cart?.shippingAddress?.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart?.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart?.cartItems?.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link
                            to={`/product/${item.product}`}
                            style={{ textDecoration: 'none', color: '#000' }}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>
                    ${shippingPrice.toFixed(2)}
                    {itemsPrice < 500 && (
                      <small style={{ display: 'block', color: /*red*/'blue' }}>
                        Get free shipping for orders over $500!
                      </small>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax (15%)</Col>
                  <Col>${taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>
                    <strong>${totalPrice}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              {error && (
                <ListGroup.Item>
                  <Message variant='danger'>
                    {error?.data?.message || error.error}
                  </Message>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block btn-cyan'
                  disabled={cart?.cartItems?.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {(isLoading || loadingCart) && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
