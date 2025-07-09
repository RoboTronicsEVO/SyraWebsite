'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MessageSquare, 
  ThumbsUp, 
  MessageCircle,
  Calendar,
  User,
  Tag,
  Plus,
  Filter,
  Clock
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useSession, signIn } from 'next-auth/react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: 'student' | 'teacher' | 'mentor' | 'admin';
  };
  created_at: string;
  category: string;
  tags: string[];
  likes: number;
  replies: number;
  views: number;
  featured: boolean;
  solved: boolean;
  last_activity: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Best programming language for robotics beginners?',
    content: 'I\'m just starting with robotics and wondering what programming language I should focus on first. I\'ve heard Python and C++ mentioned a lot...',
    author: {
      name: 'Alex Chen',
      avatar: '/api/placeholder/40/40',
      role: 'student'
    },
    created_at: '2024-01-15T10:30:00Z',
    category: 'Programming',
    tags: ['beginner', 'programming', 'python', 'c++'],
    likes: 24,
    replies: 12,
    views: 156,
    featured: false,
    solved: true,
    last_activity: '2024-01-16T14:20:00Z'
  },
  {
    id: '2',
    title: 'FIRST Robotics Competition 2024 - Team Strategies',
    content: 'With the new game announcement, what strategies is everyone considering? Our team is thinking about focusing on autonomous programming this year...',
    author: {
      name: 'Sarah Rodriguez',
      avatar: '/api/placeholder/40/40',
      role: 'mentor'
    },
    created_at: '2024-01-14T16:45:00Z',
    category: 'Competition',
    tags: ['FRC', 'strategy', '2024', 'autonomous'],
    likes: 38,
    replies: 23,
    views: 287,
    featured: true,
    solved: false,
    last_activity: '2024-01-16T09:15:00Z'
  },
  {
    id: '3',
    title: 'Troubleshooting servo motor issues',
    content: 'Our team is having problems with servo motors not responding correctly. We\'ve checked the wiring and power supply, but still having issues...',
    author: {
      name: 'Mike Johnson',
      avatar: '/api/placeholder/40/40',
      role: 'student'
    },
    created_at: '2024-01-13T08:20:00Z',
    category: 'Hardware',
    tags: ['servo', 'troubleshooting', 'motors', 'help'],
    likes: 15,
    replies: 8,
    views: 94,
    featured: false,
    solved: false,
    last_activity: '2024-01-15T11:30:00Z'
  },
  {
    id: '4',
    title: 'Robotics scholarship opportunities for 2024',
    content: 'Compiled a list of scholarships available for students pursuing robotics and STEM education. Hope this helps fellow students!',
    author: {
      name: 'Dr. Emily Watson',
      avatar: '/api/placeholder/40/40',
      role: 'teacher'
    },
    created_at: '2024-01-12T14:10:00Z',
    category: 'Education',
    tags: ['scholarships', 'education', 'funding', 'students'],
    likes: 67,
    replies: 19,
    views: 432,
    featured: true,
    solved: false,
    last_activity: '2024-01-16T13:45:00Z'
  }
];

const categories = [
  'All Categories',
  'Programming',
  'Hardware',
  'Competition',
  'Education',
  'General Discussion',
  'Project Showcase',
  'Help & Support'
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'admin';
  const isSchoolAdmin = (session?.user as any)?.role === 'school-admin';
  if (!isAdmin && !isSchoolAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-neutral-600">Community is only available to school admins and admins.</p>
        </div>
      </div>
    );
  }
  const isSchool = session?.user?.email?.endsWith('@school.com');

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/community');
      const data = await res.json();
      setPosts(data.posts || []);
      setAllPosts(data.posts || []);
    };
    fetchPosts();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterPosts(value, selectedCategory, sortBy);
  };

  const filterPosts = (search: string, category: string, sort: string) => {
    let filtered = allPosts;
    if (search) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (category && category !== 'All Categories') {
      filtered = filtered.filter(post => post.category === category);
    }
    // Sort posts
    switch (sort) {
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'replies':
        filtered.sort((a, b) => b.replies - a.replies);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      default: // recent
        filtered.sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime());
    }
    setPosts(filtered);
  };

  const getRoleBadge = (role: Post['author']['role']) => {
    const badges = {
      student: 'bg-blue-100 text-blue-800',
      teacher: 'bg-green-100 text-green-800',
      mentor: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badges[role]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Restrict community features to schools only */}
      {session && !isSchool && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4 mb-6">
          Community features are restricted to school accounts. Please sign in as a school to post or interact.
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
            Community Forum
          </h1>
          <p className="text-neutral-600">
            Connect, learn, and share with the robotics community
          </p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 text-primary-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-neutral-900">1,247</div>
              <div className="text-sm text-neutral-600">Total Posts</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center">
            <User className="w-8 h-8 text-primary-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-neutral-900">328</div>
              <div className="text-sm text-neutral-600">Active Members</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-primary-500 mr-3" />
            <div>
              <div className="text-2xl font-bold text-neutral-900">89</div>
              <div className="text-sm text-neutral-600">Posts This Week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search posts, topics, or tags..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>

          {/* Quick Filters */}
          <div className="hidden lg:flex gap-2">
            <select 
              className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                filterPosts(searchTerm, e.target.value, sortBy);
              }}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select 
              className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                filterPosts(searchTerm, selectedCategory, e.target.value);
              }}
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="replies">Most Replies</option>
              <option value="views">Most Views</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters for Mobile */}
        {showFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t border-neutral-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select 
                className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  filterPosts(searchTerm, e.target.value, sortBy);
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select 
                className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  filterPosts(searchTerm, selectedCategory, e.target.value);
                }}
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="replies">Most Replies</option>
                <option value="views">Most Views</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-neutral-600">
          Showing {posts.length} post{posts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Post Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {post.featured && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                          Featured
                        </span>
                      )}
                      {post.solved && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          Solved
                        </span>
                      )}
                      <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                    <Link href={`/community/post/${post.id}`}>
                      <h3 className="text-lg font-semibold text-neutral-900 hover:text-primary-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-neutral-600 text-sm mt-2 line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Author and Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-200 rounded-full"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-900 text-sm">
                          {post.author.name}
                        </span>
                        {getRoleBadge(post.author.role)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Clock className="w-3 h-3" />
                        {timeAgo(post.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="lg:w-32 flex lg:flex-col gap-4 lg:gap-2 text-center">
                <div className="flex lg:flex-col items-center gap-1">
                  <ThumbsUp className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-700">{post.likes}</span>
                  <span className="text-xs text-neutral-500 hidden lg:block">likes</span>
                </div>
                <div className="flex lg:flex-col items-center gap-1">
                  <MessageCircle className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-700">{post.replies}</span>
                  <span className="text-xs text-neutral-500 hidden lg:block">replies</span>
                </div>
                <div className="flex lg:flex-col items-center gap-1">
                  <span className="text-sm font-medium text-neutral-700">{post.views}</span>
                  <span className="text-xs text-neutral-500">views</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            No posts found
          </h3>
          <p className="text-neutral-600 mb-4">
            Try adjusting your search criteria or start a new discussion.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All Categories');
              setSortBy('recent');
              setPosts(allPosts);
            }}>
              Clear Filters
            </Button>
            <Button>
              Start Discussion
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}