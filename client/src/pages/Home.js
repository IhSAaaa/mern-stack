import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiGrid, FiList, FiAlertTriangle } from 'react-icons/fi';

// Components
import PostCard from '../components/Posts/PostCard';
import Skeleton from '../components/UI/Skeleton';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { useToastContext } from '../components/UI/Toast';
import useApi from '../hooks/useApi';

// Hooks
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const { toast } = useToastContext();
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  // API hooks
  const {
    data: posts,
    loading: postsLoading,
    error: postsError,
    refetch: refetchPosts
  } = useApi('/api/posts', {
    cache: true,
    onError: (error) => {
      toast.error('Failed to load posts. Please try again.');
    }
  });

  const {
    data: categories,
    loading: categoriesLoading
  } = useApi('/api/categories', {
    cache: true
  });

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Filter and sort posts
  const filteredPosts = React.useMemo(() => {
    if (!posts) return [];
    
    let filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort posts
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [posts, searchTerm, selectedCategory, sortBy]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category filter
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle sort change
  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Loading skeleton
  if (postsLoading && !posts) {
    return (
      <>
        <Helmet>
          <title>Blog Platform - Home</title>
          <meta name="description" content="Discover amazing blog posts on our platform" />
        </Helmet>
        
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Skeleton */}
            <div className="mb-8">
              <Skeleton variant="heading" className="w-1/3 mb-4" />
              <Skeleton variant="text" className="w-1/2" />
            </div>

            {/* Search and Filter Skeleton */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton variant="rectangle" className="h-12 flex-1" />
                <Skeleton variant="button" className="w-32" />
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} variant="button" className="w-20" />
                ))}
              </div>
            </div>

            {/* Posts Grid Skeleton */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton.PostCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog Platform - Home</title>
        <meta name="description" content="Discover amazing blog posts on our platform" />
        <meta property="og:title" content="Blog Platform - Home" />
        <meta property="og:description" content="Discover amazing blog posts on our platform" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Discover Amazing Stories
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore thought-provoking articles, tutorials, and insights from our community of writers
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 space-y-6"
          >
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={handleSearch}
                  leftIcon={<FiSearch className="w-5 h-5" />}
                  clearable
                  className="w-full"
                />
              </div>
              {user && (
                <Link to="/create-post">
                  <Button variant="primary" className="w-full sm:w-auto">
                    <FiPlus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </Link>
              )}
            </div>

            {/* Categories */}
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange('all')}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category._id}
                    variant={selectedCategory === category.name ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryChange(category.name)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            )}

            {/* Sort and View Options */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="popular">Popular</option>
                  <option value="title">Title</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <FiGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <FiList className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Posts Grid */}
          {postsError ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-red-600 dark:text-red-400 mb-4">
                <FiAlertTriangle className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Failed to load posts
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Something went wrong while loading the posts.
              </p>
              <Button onClick={refetchPosts} variant="primary">
                Try Again
              </Button>
            </motion.div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <FiSearch className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No posts found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Be the first to create a post!'
                }
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}
            >
              {filteredPosts.map((post) => (
                <motion.div key={post._id} variants={itemVariants}>
                  <PostCard post={post} viewMode={viewMode} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Load More Trigger */}
          <div ref={loadMoreRef} className="h-10" />
        </div>
      </div>
    </>
  );
};

export default Home; 