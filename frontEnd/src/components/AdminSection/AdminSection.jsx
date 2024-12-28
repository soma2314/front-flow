import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import ProductCard from "./ProductCard";

const baseurl = import.meta.env.VITE_BASE_URL;

const AdminSection = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const role = useSelector((state) => state.user.role);

  const [activeTab, setActiveTab] = useState("add");
  const categories = {
    "Electronics": ["Smartphones", "Laptops", "Tablets", "Smartwatches", "Headphones"],
    "Fashion": ["Men's Clothing", "Women's Clothing", "Kids' Clothing", "Shoes", "Accessories"],
    "Home & Living": ["Furniture", "Kitchen Appliances", "Home Decor", "Bedding", "Storage"],
    "Toys & Games": ["Educational Toys", "Board Games", "Outdoor Toys", "Action Figures", "Building Sets"],
    "Books": ["Fiction", "Non-Fiction", "Children's Books", "Academic", "Comics"],
    "Sports": ["Exercise Equipment", "Sports Gear", "Outdoor Sports", "Indoor Sports", "Fitness Accessories"]
  };

  // State management (preserved from original)
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
    category: "",
    subcategory: "",
    quantity: "",
    seller: "",
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // All handlers remain the same as in original code
  const handleCategoryChange = (e) => {
    const mainCategory = e.target.value;
    setSelectedMainCategory(mainCategory);
    setSelectedSubCategory("");
    setFormValues(prev => ({
      ...prev,
      category: mainCategory,
      subcategory: ""
    }));
  };

  const handleSubCategoryChange = (e) => {
    const subCategory = e.target.value;
    setSelectedSubCategory(subCategory);
    setFormValues(prev => ({
      ...prev,
      subcategory: subCategory
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files[0]) {
      setFormValues(prev => ({ ...prev, [name]: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormValues(prev => ({ ...prev, [name]: value }));
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseurl}/admin-products-list`, {
        withCredentials: true,
        credentials: 'include',
      });
      setProducts(response.data.products);
    } catch (error) {
      toast.error("Failed to fetch products!");
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          setFormValues(prev => ({ ...prev, image: file }));
          setImagePreview(URL.createObjectURL(file));
          break;
        }
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Object.values(formValues).every(value => value)) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      formData.append(key, formValues[key]);
    });

    try {
      await axios.post(`${baseurl}/createProduct`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        credentials: 'include',
      });
      toast.success("Product added successfully!");
      
      // Preserve category and subcategory while resetting other fields
      const preservedCategory = formValues.category;
      const preservedSubcategory = formValues.subcategory;
      
      setFormValues({
        title: "",
        description: "",
        price: "",
        image: null,
        category: preservedCategory, // Preserve category
        subcategory: preservedSubcategory, // Preserve subcategory
        quantity: "",
        seller: "",
      });
      
      // Keep the selected categories in their respective state variables
      setSelectedMainCategory(preservedCategory);
      setSelectedSubCategory(preservedSubcategory);
      
      setImagePreview(null);
      if (activeTab === "view") fetchProducts();
    } catch (error) {
      toast.error("Failed to add product!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "view") {
      fetchProducts();
    }
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [activeTab, handlePaste]);




  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300">Please log in to access the admin section.</p>
        </div>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-4">Unauthorized Access</h1>
          <p className="text-gray-300">You don't have permission to view this section.</p>
        </div>
      </div>
    );
  }

  const ImageUploadSection = () => {
    const [isHovering, setIsHovering] = useState(false);

    const handleLocalPaste = useCallback((e) => {
      if (!isHovering) return;
      
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            setFormValues(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
            break;
          }
        }
      }
    }, [isHovering]);

    useEffect(() => {
      if (isHovering) {
        document.addEventListener('paste', handleLocalPaste);
        return () => {
          document.removeEventListener('paste', handleLocalPaste);
        };
      }
    }, [isHovering, handleLocalPaste]);

    return (
      <div>
        <label
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add('border-blue-500', 'bg-gray-800/50');
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('border-blue-500', 'bg-gray-800/50');
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('border-blue-500', 'bg-gray-800/50');
            const files = e.dataTransfer.files;
            if (files && files[0]) {
              setFormValues((prev) => ({ ...prev, image: files[0] }));
              setImagePreview(URL.createObjectURL(files[0]));
            }
          }}
          className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all group
            ${isHovering ? 'border-blue-500 bg-gray-800/50' : 'border-gray-600 bg-gray-900/50 hover:border-blue-500 hover:bg-gray-800/50'}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.currentTarget.querySelector('input[type="file"]').click();
            }
          }}
        >
          {imagePreview ? (
            <div className="relative w-full h-full group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-contain p-2 rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-sm">Click or drag to change image</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
              <svg
                className="w-10 h-10 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <p className="text-sm text-gray-400 mb-2">
                Click to upload, drag and drop
              </p>
              {isHovering && (
                <p className="text-sm text-blue-400 animate-pulse">
                  Press Ctrl+V to paste image
                </p>
              )}
            </div>
          )}
          <input
            type="file"
            name="image"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFormValues((prev) => ({ ...prev, image: e.target.files[0] }));
                setImagePreview(URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="hidden"
            accept="image/*"
          />
        </label>
        {imagePreview && (
          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                setFormValues(prev => ({ ...prev, image: null }));
              }}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Remove image
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 py-8 px-4">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="p-4 rounded-full bg-blue-500/20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Admin Dashboard
        </h1>

        <div className="flex justify-center space-x-4 mb-8">
          {["add", "view"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {tab === "add" ? "Add New Product" : "View Products"}
            </button>
          ))}
        </div>

        {activeTab === "add" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700">
              <h2 className="text-3xl font-bold text-center mb-8 text-white">Add New Product</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Left column inputs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formValues.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter product title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formValues.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-32"
                      placeholder="Product description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={formValues.price}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Price"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        value={formValues.quantity}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Stock"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Right column inputs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Main Category</label>
                    <select
                      name="category"
                      value={selectedMainCategory}
                      onChange={handleCategoryChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Category</option>
                      {Object.keys(categories).map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sub Category</label>
                    <select
                      name="subcategory"
                      value={selectedSubCategory}
                      onChange={handleSubCategoryChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={!selectedMainCategory}
                    >
                      <option value="">Select Sub Category</option>
                      {selectedMainCategory &&
                        categories[selectedMainCategory].map((subCategory) => (
                          <option key={subCategory} value={subCategory}>{subCategory}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Seller Name</label>
                    <input
                      type="text"
                      name="seller"
                      value={formValues.seller}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Seller name"
                    />
                  </div>

                  <ImageUploadSection/>

                      </div>

                      <div className="col-span-full">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02]"
                        >
                          {loading ? "Adding Product..." : "Add Product"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {activeTab === "view" && (
              <div className="max-w-6xl mx-auto grid gap-6">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                  </div>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      categories={categories}
                      onUpdate={(updatedProduct) => {
                        setProducts(prev =>
                          prev.map(p => p._id === updatedProduct._id ? updatedProduct : p)
                        );
                      }}
                      onDelete={(productId) => {
                        setProducts(prev =>
                          prev.filter(p => p._id !== productId)
                        );
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center p-12 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700">
                    <div className="mb-4">
                      <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-300 mb-2">No Products Found</h3>
                    <p className="text-gray-400">Start by adding some products to your inventory.</p>
                  </div>
                )}
              </div>
            )}
          </div>
    </div>
  );
};

export default AdminSection;