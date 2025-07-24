import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiHeart, FiMessageCircle, FiClock, FiUser } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post, viewMode = 'grid' }) => {
  const isGrid = viewMode === 'grid';

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
        isGrid ? 'h-full' : ''
      }`}
    >
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {post.category}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <Link to={`/post/${post.slug || post._id}`}>
          <h3 className={`font-semibold text-gray-900 hover:text-blue-600 transition-colors ${
            isGrid ? 'text-lg mb-2' : 'text-xl mb-3'
          }`}>
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
          <div className="flex items-center">
            <FiUser className="mr-1" />
            <span>{post.author?.firstName} {post.author?.lastName}</span>
          </div>
          <div className="flex items-center">
            <FiClock className="mr-1" />
            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-gray-400 text-xs">+{post.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FiEye className="mr-1" />
              <span>{post.views || 0}</span>
            </div>
            <div className="flex items-center">
              <FiHeart className="mr-1" />
              <span>{post.likes?.length || 0}</span>
            </div>
            <div className="flex items-center">
              <FiMessageCircle className="mr-1" />
              <span>{post.commentsCount || 0}</span>
            </div>
          </div>
          
          {post.readTime && (
            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
              {post.readTime} min read
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard; 