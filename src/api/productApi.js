import axios from "axios";
import { API_URL } from "./api";

// Set auth token in axios instance
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Get all products with filters and pagination
export const getProducts = async ({
  page = 1,
  pageSize = 10,
  keyword = "",
  category = "",
  minPrice = "",
  maxPrice = "",
  sort = "createdAt:desc",
  isAdmin = false,
} = {}) => {
  try {
    let url = `${API_URL}/api/products?page=${page}&pageSize=${pageSize}`;

    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;
    if (sort) url += `&sort=${encodeURIComponent(sort)}`;
    if (isAdmin) url += "&admin=true";

    const response = await axios.get(url);
    return {
      success: true,
      data: response.data.data,
      pagination: {
        page: response.data.page,
        pages: response.data.pages,
        total: response.data.total,
        pageSize: response.data.pageSize,
      },
    };
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch products";
  }
};

// Get all available categories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products/categories`);
    return {
      success: true,
      data: response.data.categories || [],
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || "Failed to fetch categories",
    };
  }
};

// Get top rated products
export const getTopProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products/top`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch top products";
  }
};

// Get single product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch product";
  }
};

// Create a new product
export const createProduct = async (productData, token) => {
  try {
    setAuthToken(token);

    const response = await axios.post(`${API_URL}/api/products`, productData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data.data,
      message: "Product created successfully",
    };
  } catch (error) {
    console.error("Error in createProduct:", error);

    if (error.response?.data?.message) {
      throw error.response.data.message;
    } else if (error.response?.status === 400) {
      throw "נתונים לא תקינים - אנא בדוק את כל השדות";
    } else if (error.response?.status === 401) {
      throw "אין הרשאה - אנא התחבר מחדש";
    } else if (error.response?.status === 403) {
      throw "אין הרשאות מנהל";
    } else {
      throw error?.message || "Failed to create product";
    }
  }
};

// Update a product
export const updateProduct = async (id, productData, token) => {
  try {
    setAuthToken(token);

    const response = await axios.put(
      `${API_URL}/api/products/${id}`,
      productData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data.data,
      message: "Product updated successfully",
    };
  } catch (error) {
    console.error("Error in updateProduct:", error);

    if (error.response?.data?.message) {
      throw error.response.data.message;
    } else if (error.response?.status === 400) {
      throw "נתונים לא תקינים - אנא בדוק את כל השדות";
    } else if (error.response?.status === 401) {
      throw "אין הרשאה - אנא התחבר מחדש";
    } else if (error.response?.status === 403) {
      throw "אין הרשאות מנהל";
    } else if (error.response?.status === 404) {
      throw "המוצר לא נמצא";
    } else {
      throw error?.message || "Failed to update product";
    }
  }
};

// Update product stock
export const updateProductStock = async (
  id,
  quantity,
  operation = "add",
  token
) => {
  try {
    setAuthToken(token);

    const response = await axios.put(`${API_URL}/api/products/${id}/stock`, {
      quantity,
      operation,
    });

    return {
      success: true,
      data: response.data.data,
      message: "Stock updated successfully",
    };
  } catch (error) {
    throw error.response?.data?.message || "Failed to update product stock";
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

    const response = await axios.delete(
      `${API_URL}/api/products/${id}`,
      config
    );

    return {
      success: true,
      data: response.data.data,
      message: "Product deleted successfully",
    };
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete product";
  }
};

// Upload product image
export const uploadProductImage = async (imageFile, token) => {
  try {
    setAuthToken(token);

    const formData = new FormData();
    formData.append("image", imageFile); // string URL
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axios.post(
      `${API_URL}/api/upload`,
      formData,
      config
    );

    return {
      success: true,
      imageUrl: response.data.imageUrl,
      message: "Image uploaded successfully",
    };
  } catch (error) {
    throw error.response?.data?.message || "Failed to upload image";
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
      message: "Review submitted successfully",
    };
  } catch (error) {
    throw error.response?.data?.message || "Failed to submit review";
  }
};

// Search products for autocomplete suggestions
export const searchProductsSuggestions = async (query, limit = 6) => {
  try {
    // Use the regular getProducts with minimum parameters needed for quick search
    const response = await getProducts({
      keyword: query,
      pageSize: limit,
      page: 1,
    });

    return {
      success: true,
      data:
        response.data?.map((product) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          discount: product.discount || 0,
          image: product.image || product.imageUrl,
          stockQuantity: product.stockQuantity || 0,
        })) || [],
    };
  } catch (error) {
    console.error("Error searching products for suggestions:", error);
    return {
      success: false,
      data: [],
      error: error.message || "Failed to search products",
    };
  }
};
