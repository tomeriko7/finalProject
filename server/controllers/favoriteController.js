// controllers/favoriteController.js
import User from '../models/User.js';
import Product from '../models/Product.js';
import logger from '../utils/logger.js';

// Get the user's favorites list
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favorites.product')
      .select('favorites');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    logger.error('Error getting favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving favorites',
      error: error.message
    });
  }
};

// Add product to favorites
export const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if product is already in favorites
    const existingFavorite = user.favorites.find(
      fav => fav.product.toString() === productId
    );

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Product is already in favorites'
      });
    }

    // Add product to favorites
    user.favorites.push({
      product: productId,
      addedAt: new Date()
    });

    await user.save();

    // Return updated favorites list with product details
    const updatedUser = await User.findById(req.user.id)
      .populate('favorites.product')
      .select('favorites');

    res.status(201).json({
      success: true,
      message: 'Product successfully added to favorites',
      data: updatedUser.favorites
    });
  } catch (error) {
    logger.error('Error adding to favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding product to favorites',
      error: error.message
    });
  }
};

// Remove product from favorites
export const removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove product from favorites
    const initialLength = user.favorites.length;
    user.favorites = user.favorites.filter(
      fav => fav.product.toString() !== productId
    );

    if (user.favorites.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in favorites'
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Product successfully removed from favorites',
      data: user.favorites
    });
  } catch (error) {
    logger.error('Error removing from favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing product from favorites',
      error: error.message
    });
  }
};

// Toggle favorite status
export const toggleFavorite = async (req, res) => {
  try {
    logger.debug('toggleFavorite controller called', {
      userId: req.user?.id,
      body: req.body
    });
    
    const { productId } = req.body;

    if (!productId) {
      logger.warn('toggleFavorite: No productId provided', { userId: req.user?.id });
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      logger.warn('toggleFavorite: Product not found', { productId, userId: req.user?.id });
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      logger.error('toggleFavorite: User not found', { userId: req.user?.id });
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    logger.debug('toggleFavorite: User and product found', {
      userId: user._id,
      productId,
      currentFavoritesCount: user.favorites.length
    });

    // Check if product is already in favorites
    const existingFavoriteIndex = user.favorites.findIndex(
      fav => fav.product.toString() === productId
    );

    logger.debug('toggleFavorite: Checking existing favorite', {
      existingFavoriteIndex,
      isInFavorites: existingFavoriteIndex !== -1
    });

    let message;
    if (existingFavoriteIndex > -1) {
      // Remove from favorites
      user.favorites.splice(existingFavoriteIndex, 1);
      message = 'Product removed from favorites';
      logger.info('toggleFavorite: Removed from favorites', { userId: user._id, productId });
    } else {
      // Add to favorites
      user.favorites.push({
        product: productId,
        addedAt: new Date()
      });
      message = 'Product added to favorites';
      logger.info('toggleFavorite: Added to favorites', { userId: user._id, productId });
    }

    await user.save();
    logger.debug('toggleFavorite: User saved successfully', { userId: user._id });

    // Return updated favorites list with product details
    const updatedUser = await User.findById(req.user.id)
      .populate('favorites.product')
      .select('favorites');

    logger.debug('toggleFavorite: Retrieved updated favorites', {
      userId: user._id,
      favoritesCount: updatedUser.favorites.length
    });

    res.json({
      success: true,
      message,
      data: updatedUser.favorites,
      isFavorite: existingFavoriteIndex === -1
    });
  } catch (error) {
    logger.error('toggleFavorite: Error toggling favorite', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      productId: req.body?.productId
    });
    logger.error('Error toggling favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating favorites',
      error: error.message
    });
  }
};

// Clear all favorites
export const clearFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.favorites = [];
    await user.save();

    res.json({
      success: true,
      message: 'All favorites cleared successfully',
      data: []
    });
  } catch (error) {
    logger.error('Error clearing favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing favorites',
      error: error.message
    });
  }
};
