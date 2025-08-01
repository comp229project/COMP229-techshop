import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useCreateProductMutation, useUploadProductImageMutation } from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';

const AddProductScreen = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    price: 0,
    image: '',
    brand: '',
    category: '',
    countInStock: 0,
    description: '',
  });

  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const createdProduct = await createProduct(form).unwrap();
      toast.success('Product created successfully');
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message || 'Image uploaded successfully');
      setForm((prev) => ({ ...prev, image: res.image }));
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1>Add Product</h1>
      {(isLoading || loadingUpload) && <Loader />}
      <Form onSubmit={submitHandler}>
        {/* Name */}
        <Form.Group controlId='name' className='my-2'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </Form.Group>

        {/* Price */}
        <Form.Group controlId='price' className='my-2'>
          <Form.Label>Price</Form.Label>
          <Form.Control
            type='number'
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            required
          />
        </Form.Group>

        {/* Image Upload */}
        <Form.Group controlId='image' className='my-2'>
          <Form.Label>Image</Form.Label>
          <Form.Control
            type='text'
            placeholder='Image URL or upload file below'
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            required
          />
          <Form.Control type='file' onChange={uploadFileHandler} />
          {form.image && (
            <img
              src={form.image}
              alt='preview'
              style={{ width: '100px', marginTop: '10px', borderRadius: '4px' }}
            />
          )}
        </Form.Group>

        {/* Brand */}
        <Form.Group controlId='brand' className='my-2'>
          <Form.Label>Brand</Form.Label>
          <Form.Control
            type='text'
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            required
          />
        </Form.Group>

        {/* Count In Stock */}
        <Form.Group controlId='countInStock' className='my-2'>
          <Form.Label>Count In Stock</Form.Label>
          <Form.Control
            type='number'
            value={form.countInStock}
            onChange={(e) => setForm({ ...form, countInStock: Number(e.target.value) })}
            required
          />
        </Form.Group>

        {/* Category */}
        <Form.Group controlId='category' className='my-2'>
          <Form.Label>Category</Form.Label>
          <Form.Control
            type='text'
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
        </Form.Group>

        {/* Description */}
        <Form.Group controlId='description' className='my-2'>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type='text'
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </Form.Group>

        <Button type='submit' className='mt-3 btn-cyan' variant='primary'>
          Create Product
        </Button>
      </Form>
    </FormContainer>
  );
};

export default AddProductScreen;
