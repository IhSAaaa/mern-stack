import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { 
  FiUser, 
  FiClock, 
  FiEye, 
  FiHeart, 
  FiMessageCircle,
  FiShare2,
  FiBookmark,
  FiMoreVertical,
  FiArrowLeft,
  FiSend,
  FiThumbsUp,
  FiThumbsDown
} from 'react-icons/fi';

const PostDetail = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    // Simulate loading post data
    setTimeout(() => {
      setPost({
        id: 1,
        title: "Getting Started with MERN Stack Development: A Comprehensive Guide",
        content: `
          <p>Building full-stack applications can be a daunting task, especially when you're just starting out. The MERN stack (MongoDB, Express.js, React.js, Node.js) has become one of the most popular choices for developers looking to create modern web applications.</p>
          
          <h2>What is the MERN Stack?</h2>
          <p>The MERN stack is a collection of technologies that work together to create a full-stack web application:</p>
          <ul>
            <li><strong>MongoDB:</strong> A NoSQL database that stores data in flexible, JSON-like documents</li>
            <li><strong>Express.js:</strong> A web application framework for Node.js that simplifies building APIs</li>
            <li><strong>React.js:</strong> A JavaScript library for building user interfaces</li>
            <li><strong>Node.js:</strong> A JavaScript runtime that allows you to run JavaScript on the server</li>
          </ul>
          
          <h2>Why Choose MERN?</h2>
          <p>There are several reasons why the MERN stack has gained popularity:</p>
          <ol>
            <li><strong>JavaScript Everywhere:</strong> You can use JavaScript for both frontend and backend development</li>
            <li><strong>Large Community:</strong> Each technology has a massive community and extensive documentation</li>
            <li><strong>Scalability:</strong> MERN applications can easily scale to handle large amounts of traffic</li>
            <li><strong>Flexibility:</strong> The stack is highly flexible and can be adapted to various project requirements</li>
          </ol>
          
          <h2>Getting Started</h2>
          <p>To get started with MERN stack development, you'll need to:</p>
          <ol>
            <li>Install Node.js and npm</li>
            <li>Set up MongoDB (local or cloud)</li>
            <li>Create your Express.js server</li>
            <li>Build your React.js frontend</li>
            <li>Connect everything together</li>
          </ol>
          
          <h2>Best Practices</h2>
          <p>When developing with MERN, consider these best practices:</p>
          <ul>
            <li>Use environment variables for sensitive data</li>
            <li>Implement proper error handling</li>
            <li>Follow RESTful API conventions</li>
            <li>Use middleware for authentication and validation</li>
            <li>Optimize your database queries</li>
            <li>Implement proper security measures</li>
          </ul>
          
          <p>The MERN stack provides a powerful foundation for building modern web applications. With its flexibility, scalability, and strong community support, it's an excellent choice for both beginners and experienced developers.</p>
        `,
        excerpt: "Learn how to build full-stack applications using MongoDB, Express.js, React.js, and Node.js with this comprehensive guide.",
        author: { 
          username: "john_doe", 
          firstName: "John", 
          lastName: "Doe", 
          avatar: "",
          bio: "Full-stack developer passionate about creating amazing web experiences."
        },
        category: "Technology",
        tags: ["MERN Stack", "JavaScript", "Web Development", "Full-stack"],
        readTime: 8,
        views: 1250,
        likes: 89,
        comments: 23,
        featuredImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z"
      });

      setComments([
        {
          id: 1,
          content: "Great article! This really helped me understand the MERN stack better. Looking forward to more content like this.",
          author: { username: "jane_smith", firstName: "Jane", lastName: "Smith", avatar: "" },
          createdAt: "2024-01-15T12:30:00Z",
          likes: 5,
          replies: []
        },
        {
          id: 2,
          content: "I've been using MERN for a while now, and this guide covers all the essential points. Well written!",
          author: { username: "mike_wilson", firstName: "Mike", lastName: "Wilson", avatar: "" },
          createdAt: "2024-01-15T14:15:00Z",
          likes: 3,
          replies: [
            {
              id: 1,
              content: "Agreed! The best practices section is particularly helpful.",
              author: { username: "sarah_jones", firstName: "Sarah", lastName: "Jones", avatar: "" },
              createdAt: "2024-01-15T15:00:00Z",
              likes: 1
            }
          ]
        }
      ]);

      setRelatedPosts([
        {
          id: 2,
          title: "Modern UI Design Principles for Web Applications",
          excerpt: "Discover the key principles of modern UI design that will make your web applications stand out...",
          author: { username: "jane_smith", firstName: "Jane", lastName: "Smith", avatar: "" },
          category: "Design",
          readTime: 6,
          views: 890,
          likes: 67,
          comments: 15,
          featuredImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
          createdAt: "2024-01-14T15:45:00Z",
          slug: "modern-ui-design-principles"
        },
        {
          id: 3,
          title: "Building Scalable APIs with Node.js and Express",
          excerpt: "Learn best practices for building robust and scalable APIs that can handle millions of requests...",
          author: { username: "mike_wilson", firstName: "Mike", lastName: "Wilson", avatar: "" },
          category: "Technology",
          readTime: 10,
          views: 2100,
          likes: 156,
          comments: 42,
          featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
          createdAt: "2024-01-13T09:20:00Z",
          slug: "building-scalable-apis"
        }
      ]);

      setLoading(false);
    }, 1000);
  }, [slug]);

  const handleLike = () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }
    setIsLiked(!isLiked);
    // Update like count
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      return;
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !isAuthenticated) return;

    const newComment = {
      id: Date.now(),
      content: commentText,
      author: user,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    setComments(prev => [newComment, ...prev]);
    setCommentText('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Post not found
          </h1>
          <Link to="/">
            <Button variant="primary">
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | BlogPlatform</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.featuredImage} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Back Button */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Posts
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Article Header */}
          <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
            {post.featuredImage && (
              <div className="relative h-64 md:h-96 overflow-hidden">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge variant="primary" size="sm" className="mb-2">
                    {post.category}
                  </Badge>
                </div>
              </div>
            )}

            <div className="p-6 md:p-8">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center space-x-2">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={`${post.author.firstName} ${post.author.lastName}`}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span>
                    {post.author.firstName} {post.author.lastName}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiClock className="w-4 h-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiClock className="w-4 h-4" />
                  <span>{post.readTime} min read</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6 mb-8">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      isLiked 
                        ? 'text-red-600 bg-red-50 dark:bg-red-900/20' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes + (isLiked ? 1 : 0)}</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                    <FiMessageCircle className="w-5 h-5" />
                    <span>{comments.length}</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                    <FiEye className="w-5 h-5" />
                    <span>{post.views}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleBookmark}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      isBookmarked 
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FiBookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <FiShare2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Tags:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Comments Section */}
          <Card className="mb-8">
            <Card.Header>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Comments ({comments.length})
              </h3>
            </Card.Header>
            <Card.Body>
              {/* Comment Form */}
              {isAuthenticated ? (
                <form onSubmit={handleComment} className="mb-6">
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="mb-3"
                      />
                      <Button type="submit" size="sm" disabled={!commentText.trim()}>
                        <FiSend className="w-4 h-4 mr-2" />
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Please sign in to leave a comment
                  </p>
                  <Link to="/login">
                    <Button variant="primary" size="sm">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        {comment.author.avatar ? (
                          <img
                            src={comment.author.avatar}
                            alt={`${comment.author.firstName} ${comment.author.lastName}`}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {comment.author.firstName} {comment.author.lastName}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          {comment.content}
                        </p>
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            <FiThumbsUp className="w-4 h-4" />
                            <span>{comment.likes}</span>
                          </button>
                          <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            Reply
                          </button>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 ml-6 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex space-x-3">
                                <div className="flex-shrink-0">
                                  {reply.author.avatar ? (
                                    <img
                                      src={reply.author.avatar}
                                      alt={`${reply.author.firstName} ${reply.author.lastName}`}
                                      className="w-8 h-8 rounded-full"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                      <FiUser className="w-4 h-4 text-white" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                                      {reply.author.firstName} {reply.author.lastName}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {formatRelativeTime(reply.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Related Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="group">
                    {relatedPost.featuredImage && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="primary" size="sm">
                            {relatedPost.category}
                          </Badge>
                        </div>
                      </div>
                    )}
                    <Card.Body>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <FiUser className="w-4 h-4" />
                        <span>{relatedPost.author.firstName} {relatedPost.author.lastName}</span>
                        <span>•</span>
                        <FiClock className="w-4 h-4" />
                        <span>{relatedPost.readTime} min read</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        <Link to={`/posts/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <FiEye className="w-4 h-4" />
                            <span>{relatedPost.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiHeart className="w-4 h-4" />
                            <span>{relatedPost.likes}</span>
                          </div>
                        </div>
                        
                        <Link to={`/posts/${relatedPost.slug}`}>
                          <Button variant="ghost" size="sm">
                            Read More
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PostDetail; 