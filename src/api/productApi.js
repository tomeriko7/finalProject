import axios from 'axios';
import { API_URL } from './api';

// Set auth token in axios instance
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Get all products with filters and pagination
export const getProducts = async ({
  page = 1,
  pageSize = 10,
  keyword = '',
  category = '',
  minPrice = '',
  maxPrice = '',
  sort = 'createdAt:desc',
  isAdmin = false
} = {}) => {
  try {
    let url = `${API_URL}/api/products?page=${page}&pageSize=${pageSize}`;
    
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;
    if (sort) url += `&sort=${encodeURIComponent(sort)}`;
    if (isAdmin) url += '&admin=true';
    
    const response = await axios.get(url);
    return {
      success: true,
      data: response.data.data,
      pagination: {
        page: response.data.page,
        pages: response.data.pages,
        total: response.data.total,
        pageSize: response.data.pageSize
      }
    };
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch products';
  }
};

// Get all available categories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products/categories`);
    return {
      success: true,
      data: response.data.categories || []
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || 'Failed to fetch categories'
    };
  }
};

// Get top rated products
export const getTopProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products/top`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch top products';
  }
};

// Get single product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch product';
  }
};

// Create a new product
export const createProduct = async (productData, token) => {
  try {
    setAuthToken(token);
    
    // Use XMLHttpRequest instead of Axios for better FormData compatibility
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_URL}/api/products`);
      
      // Add authorization header
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({
              success: true,
              data: response.data,
              message: 'Product created successfully'
            });
          } catch (err) {
            reject('Invalid response format');
          }
        } else {
          reject(`Server responded with status ${xhr.status}: ${xhr.statusText}`);
        }
      };
      
      xhr.onerror = function() {
        reject('Network error');
      };
      
      const formData = new FormData();
      
      // Explicitly add each field individually
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price.toString());
      formData.append('category', productData.category);
      
      if (productData.stockQuantity !== undefined) {
        formData.append('stockQuantity', productData.stockQuantity.toString());
      }
      
      if (productData.imageUrl) {
        formData.append('imageUrl', productData.imageUrl);
      }
      
      if (productData.isActive !== undefined) {
        formData.append('isActive', productData.isActive.toString());
      }
      
      if (productData.discount !== undefined) {
        formData.append('discount', productData.discount.toString());
      }
      
      if (productData.tags && Array.isArray(productData.tags)) {
        formData.append('tags', JSON.stringify(productData.tags));
      }
      
      // If image is a File object, append it
      if (productData.image instanceof File) {
        formData.append('image', productData.image);
      }
      
      // Debug logging
      console.log('Form data being sent:');
      for (let [key, value] of formData.entries()) {
        console.log(key, ':', value);
      }
      
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Error in createProduct:', error);
    throw error?.message || 'Failed to create product';
  }
};

// Update a product
export const updateProduct = async (id, productData, token) => {
  try {
    setAuthToken(token);
    
    const formData = new FormData();
    
    // Append all product data to formData
    Object.entries(productData).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await axios.put(`${API_URL}/api/products/${id}`, formData, config);
    return {
      success: true,
      data: response.data.data,
      message: 'Product updated successfully'
    };
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update product';
  }
};

// Update product stock
export const updateProductStock = async (id, quantity, operation = 'add', token) => {
  try {
    setAuthToken(token);
    
    const response = await axios.put(
      `${API_URL}/api/products/${id}/stock`,
      { quantity, operation }
    );
    
    return {
      success: true,
      data: response.data.data,
      message: 'Stock updated successfully'
    };
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update product stock';
  }
};

// Delete a product
export const deleteProduct = async (id, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.delete(`${API_URL}/api/products/${id}`, config);

    return {
      success: true,
      data: response.data.data,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete product';
  }
};

// Upload product image
export const uploadProductImage = async (imageFile, token) => {
  try {
    setAuthToken(token);
    
    const formData = new FormData();
    formData.append('image', imageFile);; // string URL
;

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await axios.post(`${API_URL}/api/upload`, formData, config);
    
    return {
      success: true,
      imageUrl: response.data.imageUrl,
      message: 'Image uploaded successfully'
    };
  } catch (error) {
    throw error.response?.data?.message || 'Failed to upload image';
  }
};

// Create product review
export const createProductReview = async (productId, reviewData, token) => {
  try {
    setAuthToken(token);
    
    const response = await axios.post(
      `${API_URL}/api/products/${productId}/reviews`,
      reviewData
    );
    
    return {
      success: true,
      data: response.data.data,
      message: 'Review submitted successfully'
    };
  } catch (error) {
    throw error.response?.data?.message || 'Failed to submit review';
  }
};

// Search products for autocomplete suggestions
export const searchProductsSuggestions = async (query, limit = 6) => {
  try {
    // Use the regular getProducts with minimum parameters needed for quick search
    const response = await getProducts({
      keyword: query,
      pageSize: limit,
      page: 1
    });
    
    return {
      success: true,
      data: response.data?.map(product => ({
        id: product._id,
        name: product.name,
        price: product.price,
        discount: product.discount || 0,
        image: product.image || product.imageUrl,
        stockQuantity: product.stockQuantity || 0
      })) || []
    };
  } catch (error) {
    console.error('Error searching products for suggestions:', error);
    return {
      success: false,
      data: [],
      error: error.message || 'Failed to search products'
    };
  }
};
