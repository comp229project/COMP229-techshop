import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
} from '../slices/cartApiSlice';
import Message from '../components/Message';
import Meta from '../components/Meta';

const CartScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { data, isLoading, error, refetch } = useGetCartQuery(undefined, {
    skip: !userInfo,
  });

  const cartItems = Array.isArray(data?.cartItems || data) ? (data?.cartItems || data) : [];


  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const addToCartHandler = async (item, qty) => {
  try {
    await addToCart({
      productId: item.product,
      qty,
      shippingAddress: {
        address: '',
        city: '',
        postalCode: '',
        country: '',
      },
      paymentMethod: '',
      itemsPrice: 0,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: 0,
    }).unwrap();

    refetch(); // refresh list
  } catch (err) {
    console.error('Add to cart error:', err);
  }
};


  const removeFromCartHandler = async (productId) => {
    try {
      await removeFromCart(productId).unwrap();
      refetch(); // refresh list
    } catch (err) {
      console.error('Remove from cart error:', err);
    }
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  console.log('🧾 cartItems:', cartItems);

  const subtotalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotalPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  return (
    <Row>
      <Meta title={'TechShop'} />
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>Shopping Cart</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <Message variant='danger'>{error?.data?.message || error.error}</Message>
        ) : cartItems.length === 0 ? (
          <Message>
            Your cart is empty. <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product} className='border-bottom shadow'>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link
                      to={`/product/${item.product}`}
                      style={{
                        textDecoration: 'none',
                        color: '#000',
                      }}
                    >
                      {item.name}
                    </Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock || 10).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <FaTrash />
                    </Button>{' '}
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>
                Subtotal ({subtotalItems}) items
              </h3>
              ${subtotalPrice.toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
                style={{
                  backgroundColor: '#D3592A',
                  border: 'none',
                }}
              >
                Continue to checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
