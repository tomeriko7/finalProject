import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";
import { safeMongooseSave } from '../middleware/validationMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  logger.debug("Creating new product", { 
    contentType: req.headers["content-type"],
    formFields: Object.keys(req.body),
    hasFile: !!req.file,
    userId: req.user?._id
  });

  // Use nullish coalescing to ensure we have all fields with defaults
  const name = req.body.name || "";
  const description = req.body.description || "";
  const price = req.body.price || 0;
  const category = req.body.category || "";
  const stockQuantity = req.body.stockQuantity || 0;
  const isActive = req.body.isActive === "false" ? false : true;
  const discount = req.body.discount || 0;
  const tags = req.body.tags || "[]";

  logger.debug("Product fields extracted", {
    name,
    category,
    price,
    stockQuantity,
    isActive,
    discount,
    tagsProvided: !!tags
  });

  // Parse tags if it's a JSON string (from FormData)
  let parsedTags = [];
  if (tags) {
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        // If it's not JSON, treat as comma-separated string
        parsedTags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      }
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    }
  }

  // Basic validation with more helpful error message
  const missingFields = [];
  if (!name) missingFields.push("name");
  if (!description) missingFields.push("description");
  if (!price) missingFields.push("price");
  if (!category) missingFields.push("category");

  if (missingFields.length > 0) {
    res.status(400);
    throw new Error(
      `Please provide all required fields: ${missingFields.join(", ")}`
    );
  }

  // Handle image upload
  let imageUrl = "";
  if (req.file) {
    // If image was uploaded via multer
    const uploadedImage = req.file;
    const tempPath = uploadedImage.path;
    const fileName = uploadedImage.filename;

    // Move file from temp to products directory
    const targetDir = path.join(__dirname, "../../uploads/products");

    // Create directory if not exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, fileName);
    fs.renameSync(tempPath, targetPath);

    // Set imageUrl
    imageUrl = `/uploads/products/${fileName}`;
    logger.debug("Product image saved", { fileName, path: targetPath });
  } else if (req.body.imageUrl) {
    // If image URL was provided directly in the request
    imageUrl = req.body.imageUrl;
    logger.debug("Using provided imageUrl", { imageUrl });
  }

  // Create product with values we extracted earlier
  const productData = {
    name,
    description,
    price: Number(price),
    category,
    stockQuantity: Number(stockQuantity),
    imageUrl,
    isActive: isActive === "true" || isActive === true,
    discount: Number(discount),
    tags: Array.isArray(parsedTags) ? parsedTags : [],
  };

  logger.debug("Final product data prepared", { 
    productName: productData.name,
    category: productData.category,
    hasImage: !!productData.imageUrl
  });

  // Add user if authenticated
  if (req.user) {
    productData.user = req.user._id;
  }



  // יצירת מוצר חדש עם ולידציה מאובטחת
  const product = new Product(productData);
  const createdProduct = await safeMongooseSave(product, res, 'יצירת מוצר');
  if (!createdProduct) return;
    
  logger.info("Product created successfully", { 
    productId: createdProduct._id,
    name: createdProduct.name,
    userId: req.user?._id
  });
  
  // Admin action logging
  if (req.user?.isAdmin) {
    logger.adminAction(req.user._id, 'create_product', {
      productId: createdProduct._id,
      productName: createdProduct.name
    });
  }

  res.status(201).json({
    success: true,
    data: createdProduct,
  });
});

// @desc    Get all products with filtering, sorting and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  // Pagination
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.page) || 1;

  // Build filter object
  const filter = { isActive: true };

  // Filter by category
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Search keyword
  if (req.query.keyword) {
    filter.$or = [
      { name: { $regex: req.query.keyword, $options: "i" } },
      { description: { $regex: req.query.keyword, $options: "i" } },
      { tags: { $regex: req.query.keyword, $options: "i" } },
    ];
  }

  // Price range
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  // Build sort object
  let sort = {};
  if (req.query.sort) {
    const sortBy = req.query.sort.split(":");
    sort[sortBy[0]] = sortBy[1] === "desc" ? -1 : 1;
  } else {
    sort = { createdAt: -1 }; // Default sort by newest
  }

  // Get total count for pagination
  const count = await Product.countDocuments(filter);

  // Execute query with pagination
  const products = await Product.find(filter)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("category", "name")
    .lean();

  res.json({
    success: true,
    count: products.length,
    total: count,
    page,
    pages: Math.ceil(count / pageSize),
    data: products,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name description")
    .populate("user", "name email");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if product is active or if user is admin
  if (!product.isActive && (!req.user || !req.user.isAdmin)) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({
    success: true,
    data: product,
  });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Handle image upload if new image is provided
  if (req.file) {
    // Delete old image if it exists and is not the default
    if (product.imageUrl && !product.imageUrl.includes("default.jpg")) {
      const oldImagePath = path.join(__dirname, "../..", product.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Save new image
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    const fileName = `${uuidv4()}${fileExt}`;
    const uploadPath = path.join(__dirname, "../../uploads/products", fileName);

    // Ensure upload directory exists
    if (!fs.existsSync(path.dirname(uploadPath))) {
      fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
    }

    // Move the file to uploads directory
    fs.renameSync(req.file.path, uploadPath);
    product.imageUrl = `/uploads/products/${fileName}`;
  }

  // Update product fields
  const {
    name,
    description,
    price,
    category,
    stockQuantity,
    isActive,
    discount,
    tags,
  } = req.body;

  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = Number(price);
  if (category) product.category = category;
  if (stockQuantity) product.stockQuantity = Number(stockQuantity);
  if (isActive !== undefined) product.isActive = isActive;
  if (discount) product.discount = Number(discount);
  if (tags) {
    if (Array.isArray(tags)) {
      product.tags = tags;
    } else if (typeof tags === 'string') {
      product.tags = tags.split(",").map((tag) => tag.trim());
    }
  }

  // שמירת עדכון המוצר עם ולידציה מאובטחת
  const updatedProduct = await safeMongooseSave(product, res, 'עדכון מוצר');
  if (!updatedProduct) return;
  
  logger.info("Product updated", {
    productId: updatedProduct._id,
    name: updatedProduct.name,
    userId: req.user?._id
  });
  
  // Admin action logging
  if (req.user?.isAdmin) {
    logger.adminAction(req.user._id, 'update_product', {
      productId: updatedProduct._id,
      productName: updatedProduct.name
    });
  }

  res.json({
    success: true,
    data: updatedProduct,
  });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // מחיקת תמונה קשורה אם קיימת ושונה מברירת מחדל
  if (product.imageUrl && !product.imageUrl.includes("default.jpg")) {
    const imagePath = path.join(__dirname, "../..", product.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  // מחיקה מאובטחת עם findByIdAndDelete
  try {
    await Product.findByIdAndDelete(req.params.id);
  } catch (err) {
    logger.error("Error deleting product", { 
      error: err.message,
      stack: err.stack,
      productId: req.params.id,
      userId: req.user?._id
    });
    res.status(500);
    throw new Error(`Failed to delete product: ${err.message}`);
  }
  
  logger.info("Product deleted", {
    productId: req.params.id,
    productName: product.name,
    userId: req.user?._id
  });
  
  // Admin action logging
  if (req.user?.isAdmin) {
    logger.adminAction(req.user._id, 'delete_product', {
      productId: req.params.id,
      productName: product.name
    });
  }

  res.json({
    success: true,
    data: {},
  });
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  // שמירת ביקורת המוצר עם ולידציה מאובטחת
  const updatedProduct = await safeMongooseSave(product, res, 'הוספת ביקורת');
  if (!updatedProduct) return;
  
  logger.info("Product review added", {
    productId: product._id,
    productName: product.name,
    userId: req.user._id,
    rating
  });
  
  // User action logging
  logger.userAction(req.user._id, 'add_review', {
    productId: product._id,
    productName: product.name,
    rating
  });

  res.status(201).json({
    success: true,
    message: "Review added",
  });
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true })
    .sort({ rating: -1 })
    .limit(5);

  res.json({
    success: true,
    data: products,
  });
});

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private/Admin
export const updateProductStock = asyncHandler(async (req, res) => {
  const { quantity, operation = "add" } = req.body;

  if (!quantity || isNaN(quantity)) {
    res.status(400);
    throw new Error("Please provide a valid quantity");
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (operation === "add") {
    product.stockQuantity += Number(quantity);
  } else if (operation === "subtract") {
    if (product.stockQuantity < quantity) {
      res.status(400);
      throw new Error("Insufficient stock");
    }
    product.stockQuantity -= Number(quantity);
  } else {
    res.status(400);
    throw new Error("Invalid operation");
  }

  // שמירת עדכון המלאי עם ולידציה מאובטחת
  const updatedProduct = await safeMongooseSave(product, res, 'עדכון מלאי');
  if (!updatedProduct) return;
  
  logger.info("Product stock updated", {
    productId: updatedProduct._id,
    productName: updatedProduct.name,
    operation,
    quantity,
    newStock: updatedProduct.stockQuantity,
    userId: req.user?._id
  });
  
  // Admin action logging
  if (req.user?.isAdmin) {
    logger.adminAction(req.user._id, `${operation}_stock`, {
      productId: updatedProduct._id,
      productName: updatedProduct.name,
      quantity,
      newStock: updatedProduct.stockQuantity
    });
  }

  res.json({
    success: true,
    data: updatedProduct,
  });
});
