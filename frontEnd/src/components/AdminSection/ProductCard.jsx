import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Save, X, ChevronDown } from 'lucide-react';
import { toast } from "react-toastify";
import axios from 'axios';

const baseurl = import.meta.env.VITE_BASE_URL;

const ProductCard = ({ product, onUpdate, onDelete, categories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({...product});
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(product.category || '');
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    setEditedProduct({...product});
    setSelectedCategory(product.category || '');
    if (product.category && categories[product.category]) {
      setSubcategories(categories[product.category]);
    }
  }, [product, categories]);

  useEffect(() => {
    if (isEditing) setIsExpanded(true);
  }, [isEditing]);

  useEffect(() => {
    if (selectedCategory) {
      setSubcategories(categories[selectedCategory] || []);
      if (!categories[selectedCategory]?.includes(editedProduct.subcategory)) {
        setEditedProduct(prev => ({...prev, subcategory: ''}));
      }
    }
  }, [selectedCategory, categories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value
    }));
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setEditedProduct(prev => ({ ...prev, category, subcategory: '' }));
  };

  const handleSubcategoryChange = (e) => {
    setEditedProduct(prev => ({ ...prev, subcategory: e.target.value }));
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setIsExpanded(true);
  };

  const handleUpdate = async () => {
    if (!validateProduct(editedProduct)) return;
    
    setLoading(true);
    try {
      const response = await axios.put(
        `${baseurl}update-product/${product._id}`,
        editedProduct,
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

      if (response.data.message === "Product updated successfully") {
        toast.success('Product updated successfully!');
        onUpdate(editedProduct);
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    setLoading(true);
    try {
      const response = await axios.delete(
        `${baseurl}/delete-product/${product._id}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success('Product deleted successfully!');
        onDelete(product._id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting product');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProduct({...product});
    setSelectedCategory(product.category || '');
  };

  const handleHeaderClick = () => {
    if (!isEditing) setIsExpanded(!isExpanded);
  };

  const validateProduct = (product) => {
    const requiredFields = ['title', 'description', 'price', 'category', 'subcategory', 'quantity', 'seller'];
    for (const field of requiredFields) {
      if (!product[field]) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    return true;
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="backdrop-blur-sm bg-white/10 rounded-lg shadow-lg overflow-hidden hover:bg-white/20 transition-all"
    >
      <div 
        onClick={handleHeaderClick}
        className="flex justify-between items-center px-6 py-4 cursor-pointer"
      >
        <div className="flex items-center space-x-4">
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
            <ChevronDown className="w-5 h-5 text-blue-400" />
          </motion.div>
          <h2 className="text-lg font-medium text-white">{product.title}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-blue-400 font-bold">${product.price}</span>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="p-2 rounded-full hover:bg-black/30 transition-colors"
              >
                <Edit2 className="w-4 h-4 text-blue-400" />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10"
          >
            <div className="p-6">
              <div className="flex space-x-6">
                <motion.div 
                  className="w-48 h-48 flex-shrink-0 overflow-hidden rounded-lg bg-black/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <div className="flex-1 space-y-4">
                  {isEditing ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Title</label>
                          <input
                            type="text"
                            name="title"
                            value={editedProduct.title}
                            onChange={handleInputChange}
                            className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Price</label>
                          <input
                            type="number"
                            name="price"
                            value={editedProduct.price}
                            onChange={handleInputChange}
                            className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm text-gray-300 mb-1">Description</label>
                          <textarea
                            name="description"
                            value={editedProduct.description}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Category</label>
                          <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                          >
                            <option value="">Select Category</option>
                            {Object.keys(categories).map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Subcategory</label>
                          <select
                            value={editedProduct.subcategory || ''}
                            onChange={handleSubcategoryChange}
                            className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            disabled={!selectedCategory}
                          >
                            <option value="">Select Subcategory</option>
                            {subcategories.map(subcategory => (
                              <option key={subcategory} value={subcategory}>{subcategory}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Quantity</label>
                          <input
                            type="number"
                            name="quantity"
                            value={editedProduct.quantity}
                            onChange={handleInputChange}
                            className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCancel}
                          className="flex items-center px-4 py-2 rounded bg-black/30 hover:bg-black/50 transition-colors text-white"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleUpdate}
                          disabled={loading}
                          className="flex items-center px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {loading ? 'Saving...' : 'Save Changes'}
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 text-white">
                      <p className="text-gray-300">
                        <span className="text-blue-400">Description:</span> {product.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <p>
                          <span className="text-blue-400">Category:</span> {product.category}
                        </p>
                        <p>
                          <span className="text-blue-400">Subcategory:</span> {product.subcategory}
                        </p>
                        <p>
                          <span className="text-blue-400">Quantity:</span> {product.quantity}
                        </p>
                        <p>
                          <span className="text-blue-400">Seller:</span> {product.seller}
                        </p>
                      </div>

                      <motion.div className="flex justify-end mt-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleDelete}
                          disabled={loading}
                          className="flex items-center px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {loading ? 'Deleting...' : 'Delete Product'}
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;