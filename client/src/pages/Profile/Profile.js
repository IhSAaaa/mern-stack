import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { 
  FiEdit, 
  FiSave, 
  FiX, 
  FiUser, 
  FiMail, 
  FiCalendar,
  FiMapPin,
  FiLink,
  FiBookOpen,
  FiEye,
  FiHeart,
  FiMessageCircle,
  FiSettings,
  FiCamera,
  FiTrash2,
  FiShare2,
  FiMoreVertical
} from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [stats, setStats] = useState({
    posts: 0,
    views: 0,
    likes: 0,
    comments: 0
  });

  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || ''
  });

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUserPosts([
        {
          id: 1,
          title: "Getting Started with MERN Stack Development",
          excerpt: "Learn how to build full-stack applications using MongoDB, Express.js, React.js, and Node.js...",
          category: "Technology",
          readTime: 5,
          views: 1250,
          likes: 89,
          comments: 23,
          featuredImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
          createdAt: "2024-01-15T10:30:00Z",
          slug: "getting-started-with-mern-stack"
        },
        {
          id: 2,
          title: "Modern UI Design Principles",
          excerpt: "Discover the key principles of modern UI design that will make your web applications stand out...",
          category: "Design",
          readTime: 8,
          views: 890,
          likes: 67,
          comments: 15,
          featuredImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
          createdAt: "2024-01-14T15:45:00Z",
          slug: "modern-ui-design-principles"
        }
      ]);

      setStats({
        posts: 12,
        views: 15420,
        likes: 892,
        comments: 234
      });
    }, 1000);
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'posts', label: 'Posts', count: userPosts.length },
    { id: 'drafts', label: 'Drafts', count: 3 },
    { id: 'liked', label: 'Liked', count: 45 },
    { id: 'settings', label: 'Settings', count: null }
  ];

  if (loading && userPosts.length === 0) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  return (
    <>
      <Helmet>
        <title>{user?.firstName} {user?.lastName} - Profile | BlogPlatform</title>
        <meta name="description" content={`View ${user?.firstName} ${user?.lastName}'s profile and posts on BlogPlatform.`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <FiUser className="w-16 h-16 text-white" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg text-blue-600 hover:bg-gray-50 transition-colors duration-200">
                  <FiCamera className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-blue-100 mb-4">@{user?.username}</p>
                {user?.bio && (
                  <p className="text-blue-100 mb-4 max-w-2xl">
                    {user.bio}
                  </p>
                )}
                
                {/* User Stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.posts}</div>
                    <div className="text-blue-100 text-sm">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.views.toLocaleString()}</div>
                    <div className="text-blue-100 text-sm">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.likes}</div>
                    <div className="text-blue-100 text-sm">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.comments}</div>
                    <div className="text-blue-100 text-sm">Comments</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <Button
                  variant="outline"
                  className="bg-white text-blue-600 hover:bg-blue-50 border-white"
                  onClick={() => setShowEditModal(true)}
                >
                  <FiEdit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="ghost"
                  className="text-white border-white hover:bg-white hover:text-blue-600"
                >
                  <FiShare2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }
                  `}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'posts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPosts.map((post) => (
                  <Card key={post.id} className="group">
                    {post.featuredImage && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="primary" size="sm">
                            {post.category}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-white bg-opacity-90 hover:bg-white"
                          >
                            <FiMoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <Card.Body>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <FiEye className="w-4 h-4" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiHeart className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiMessageCircle className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'drafts' && (
              <div className="text-center py-12">
                <FiBookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No drafts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start writing your next post and save it as a draft.
                </p>
                <Button variant="primary">
                  <FiEdit className="w-4 h-4 mr-2" />
                  Create New Post
                </Button>
              </div>
            )}

            {activeTab === 'liked' && (
              <div className="text-center py-12">
                <FiHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No liked posts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Posts you like will appear here.
                </p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-2xl">
                <Card>
                  <Card.Header>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Account Settings
                    </h3>
                  </Card.Header>
                  <Card.Body className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Notifications
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">New comments</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Post likes</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Weekly digest</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Privacy
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Public profile</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Show email</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button variant="danger" size="sm">
                        <FiTrash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
        size="lg"
      >
        <form onSubmit={handleEditSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              value={editForm.firstName}
              onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
              leftIcon={<FiUser className="w-5 h-5" />}
              required
            />
            <Input
              label="Last Name"
              type="text"
              value={editForm.lastName}
              onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
              leftIcon={<FiUser className="w-5 h-5" />}
              required
            />
          </div>
          
          <Input
            label="Bio"
            type="text"
            value={editForm.bio}
            onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself..."
          />
          
          <Input
            label="Location"
            type="text"
            value={editForm.location}
            onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
            leftIcon={<FiMapPin className="w-5 h-5" />}
            placeholder="City, Country"
          />
          
          <Input
            label="Website"
            type="url"
            value={editForm.website}
            onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
            leftIcon={<FiLink className="w-5 h-5" />}
            placeholder="https://yourwebsite.com"
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              <FiSave className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Profile; 