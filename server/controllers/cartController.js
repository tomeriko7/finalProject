// controllers/cartController.js
import User from "../models/User.js";
import Product from "../models/Product.js";
import logger from "../utils/logger.js";

// Retrieve the user's shopping cart
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("cart.product")
      .select("cart");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Calculate cart summaries
    const cartItems = user.cart.map((item) => ({
      _id: item._id,
      product: item.product,
      quantity: item.quantity,
      addedAt: item.addedAt,
      subtotal: item.product.price * item.quantity,
    }));

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({
      success: true,
      data: {
        items: cartItems,
        summary: {
          totalItems,
          totalPrice,
          itemCount: cartItems.length,
        },
      },
    });
  } catch (error) {
    logger.error("Error getting cart:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving shopping cart",
      error: error.message,
    });
  }
};

// Add a product to the shopping cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Quantity validation
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    // Check if the product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Remaining: ${product.stockQuantity}`,
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the product is already in the cart
    const existingCartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingCartItem) {
      // Update quantity of existing product
      const newQuantity = existingCartItem.quantity + quantity;

      if (product.stockQuantity < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Remaining: ${product.stockQuantity}, currently in cart: ${existingCartItem.quantity}`,
        });
      }

      existingCartItem.quantity = newQuantity;
    } else {
      // Add new product to cart
      user.cart.push({
        product: productId,
        quantity,
        addedAt: new Date(),
      });
    }

    await user.save();

    // Return updated cart with product details
    const updatedUser = await User.findById(req.user.id)
      .populate("cart.product")
      .select("cart");

    res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
      data: updatedUser.cart,
    });
  } catch (error) {
    logger.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Error adding product to cart",
      error: error.message,
    });
  }
};

// Update quantity of a product in the cart
export const updateCartQuantity = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    // Quantity validation
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const user = await User.findById(req.user.id).populate("cart.product");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find item in cart
    const cartItem = user.cart.id(cartItemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Stock check
    if (cartItem.product.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Remaining: ${cartItem.product.stockQuantity}`,
      });
    }

    // Update quantity
    cartItem.quantity = quantity;
    await user.save();

    res.json({
      success: true,
      message: "Product quantity updated successfully",
      data: user.cart,
    });
  } catch (error) {
    logger.error("Error updating cart quantity:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product quantity",
      error: error.message,
    });
  }
};

// Remove a product from the cart
export const removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove item from cart
    const cartItem = user.cart.id(cartItemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cartItem.deleteOne();
    await user.save();

    // Return updated cart
    const updatedUser = await User.findById(req.user.id)
      .populate("cart.product")
      .select("cart");

    res.json({
      success: true,
      message: "Product removed from cart successfully",
      data: updatedUser.cart,
    });
  } catch (error) {
    logger.error("Error removing from cart:", error);
    res.status(500).json({
      success: false,
      message: "Error removing product from cart",
      error: error.message,
    });
  }
};

// Clear the entire shopping cart
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: "Cart cleared successfully",
      data: [],
    });
  } catch (error) {
    logger.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing cart",
      error: error.message,
    });
  }
};

// Sync shopping cart from localStorage (e.g. client update)
export const syncCart = async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!Array.isArray(cartItems)) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart items format",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate that all products exist and have stock
    const validCartItems = [];
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (product && product.stockQuantity >= item.quantity) {
        validCartItems.push({
          product: item.productId,
          quantity: item.quantity,
          addedAt: new Date(),
        });
      }
    }

    user.cart = validCartItems;
    await user.save();

    // Return updated cart
    const updatedUser = await User.findById(req.user.id)
      .populate("cart.product")
      .select("cart");

    res.json({
      success: true,
      message: "Cart synced successfully",
      data: updatedUser.cart,
    });
  } catch (error) {
    logger.error("Error syncing cart:", error);
    res.status(500).json({
      success: false,
      message: "Error syncing cart",
      error: error.message,
    });
  }
};
