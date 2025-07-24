import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { 
  FiSave, 
  FiEye, 
  FiUpload, 
  FiX, 
  FiImage,
  FiTag,
  FiBookOpen,
  FiAlertCircle,
  FiCheck,
  FiUser
} from 'react-icons/fi';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    featuredImage: null
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    'Technology',
    'Design',
    'Business',
    'Lifestyle',
    'Travel',
    'Food',
    'Health',
    'Education',
    'Entertainment',
    'Sports'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          featuredImage: 'Please select a valid image file'
        }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          featuredImage: 'Image size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        featuredImage: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.featuredImage) {
        setErrors(prev => ({
          ...prev,
          featuredImage: ''
        }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      featuredImage: null
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length < 50) {
      newErrors.excerpt = 'Excerpt must be at least 50 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 100) {
      newErrors.content = 'Content must be at least 100 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create FormData for file upload
      const postData = new FormData();
      postData.append('title', formData.title);
      postData.append('excerpt', formData.excerpt);
      postData.append('content', formData.content);
      postData.append('category', formData.category);
      postData.append('tags', formData.tags);
      if (formData.featuredImage) {
        postData.append('featuredImage', formData.featuredImage);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to the new post (you would get the post ID from the API response)
      navigate('/posts/sample-post-slug');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      // Save as draft logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Draft saved');
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create New Post - BlogPlatform</title>
        <meta name="description" content="Create and publish your next blog post on BlogPlatform." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Create New Post
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Share your thoughts with the world
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  loading={loading}
                >
                  <FiSave className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  variant={previewMode ? 'primary' : 'outline'}
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  <FiEye className="w-4 h-4 mr-2" />
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Editor Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <Card>
                  <Card.Body>
                    <Input
                      label="Post Title"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter your post title..."
                      leftIcon={<FiBookOpen className="w-5 h-5" />}
                      error={errors.title}
                      required
                    />
                  </Card.Body>
                </Card>

                {/* Excerpt */}
                <Card>
                  <Card.Body>
                    <Input
                      label="Excerpt"
                      type="text"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleChange}
                      placeholder="Brief description of your post..."
                      error={errors.excerpt}
                      required
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {formData.excerpt.length}/200 characters
                    </p>
                  </Card.Body>
                </Card>

                {/* Content */}
                <Card>
                  <Card.Body>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content
                      {errors.content && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows={15}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Write your post content here..."
                    />
                    {errors.content && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors.content}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {formData.content.length} characters
                    </p>
                  </Card.Body>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publish Card */}
                <Card>
                  <Card.Header>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Publish
                    </h3>
                  </Card.Header>
                  <Card.Body className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiUser className="w-4 h-4" />
                      <span>Author: {user?.firstName} {user?.lastName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiCheck className="w-4 h-4 text-green-500" />
                      <span>Ready to publish</span>
                    </div>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      loading={loading}
                    >
                      <FiSave className="w-4 h-4 mr-2" />
                      Publish Post
                    </Button>
                  </Card.Body>
                </Card>

                {/* Category */}
                <Card>
                  <Card.Header>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Category
                    </h3>
                  </Card.Header>
                  <Card.Body>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors.category}
                      </p>
                    )}
                  </Card.Body>
                </Card>

                {/* Tags */}
                <Card>
                  <Card.Header>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Tags
                    </h3>
                  </Card.Header>
                  <Card.Body>
                    <Input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="Enter tags separated by commas..."
                      leftIcon={<FiTag className="w-5 h-5" />}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Separate tags with commas
                    </p>
                  </Card.Body>
                </Card>

                {/* Featured Image */}
                <Card>
                  <Card.Header>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Featured Image
                    </h3>
                  </Card.Header>
                  <Card.Body>
                    {imagePreview ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          fullWidth
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <FiUpload className="w-4 h-4 mr-2" />
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                          <FiImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            No image selected
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          fullWidth
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <FiUpload className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    {errors.featuredImage && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {errors.featuredImage}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Recommended: 1200x630px, max 5MB
                    </p>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePost; 