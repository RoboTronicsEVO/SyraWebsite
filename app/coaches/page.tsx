'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  User, 
  MapPin, 
  Star,
  Calendar,
  Clock,
  Award,
  MessageCircle,
  Plus,
  Filter
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useSession } from 'next-auth/react';
import { getSessionUser } from '@/lib/session';

interface Coach {
  id: string;
  name: string;
  title: string;
  bio: string;
  location: string;
  specialties: string[];
  experience_years: number;
  rating: number;
  total_reviews: number;
  hourly_rate: number;
  availability: 'available' | 'busy' | 'unavailable';
  response_time: string;
  languages: string[];
  education: string;
  achievements: string[];
  avatar: string;
  verified: boolean;
}

const mockCoaches: Coach[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Senior Robotics Engineer & FIRST Mentor',
    bio: 'Former NASA engineer with 15+ years in robotics. Specializing in autonomous systems and competition strategy. Mentored 20+ championship teams.',
    location: 'San Francisco, CA',
    specialties: ['Autonomous Programming', 'Competition Strategy', 'Team Leadership', 'C++/Python'],
    experience_years: 15,
    rating: 4.9,
    total_reviews: 47,
    hourly_rate: 85,
    availability: 'available',
    response_time: '< 2 hours',
    languages: ['English', 'Mandarin'],
    education: 'PhD Robotics Engineering, MIT',
    achievements: ['NASA Innovation Award', 'FIRST Dean\'s List Award', '5x Regional Championship Mentor'],
    avatar: '/api/placeholder/80/80',
    verified: true
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    title: 'Mechanical Design Expert & VEX Champion',
    bio: 'Professional mechanical engineer with expertise in CAD design and manufacturing. Led multiple teams to VEX World Championships.',
    location: 'Austin, TX',
    specialties: ['Mechanical Design', 'CAD/SolidWorks', 'Manufacturing', 'VEX Robotics'],
    experience_years: 8,
    rating: 4.8,
    total_reviews: 32,
    hourly_rate: 65,
    availability: 'available',
    response_time: '< 4 hours',
    languages: ['English', 'Spanish'],
    education: 'MS Mechanical Engineering, UT Austin',
    achievements: ['VEX World Championship Mentor', 'Design Award Winner', 'Industry Expert'],
    avatar: '/api/placeholder/80/80',
    verified: true
  },
  {
    id: '3',
    name: 'Emily Watson',
    title: 'Programming Instructor & AI Specialist',
    bio: 'Computer science educator with passion for teaching robotics programming. Specialized in machine learning applications in robotics.',
    location: 'Boston, MA',
    specialties: ['Python Programming', 'AI/Machine Learning', 'Computer Vision', 'Education'],
    experience_years: 6,
    rating: 4.7,
    total_reviews: 28,
    hourly_rate: 55,
    availability: 'busy',
    response_time: '< 6 hours',
    languages: ['English'],
    education: 'MS Computer Science, Harvard',
    achievements: ['Educator of the Year', 'AI Research Published', 'Youth Mentor Award'],
    avatar: '/api/placeholder/80/80',
    verified: false
  }
];

const specialtyOptions = [
  'All Specialties',
  'Programming',
  'Mechanical Design',
  'Electronics',
  'Competition Strategy',
  'Team Leadership',
  'AI/Machine Learning',
  'CAD Design',
  'Manufacturing'
];

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>(mockCoaches);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { data: session } = useSession();
  const user = getSessionUser(session);
  const isAdmin = user?.role === 'admin';
  const isSchoolAdmin = user?.role === 'school-admin';
  if (!isAdmin && !isSchoolAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-neutral-600">Coaches is only available to school admins and admins.</p>
        </div>
      </div>
    );
  }
  const isSyraRoboAdmin = session?.user?.email === 'admin@syrarobo.com';

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterCoaches(value, selectedSpecialty, selectedAvailability, maxRate);
  };

  const filterCoaches = (search: string, specialty: string, availability: string, rate: string) => {
    let filtered = mockCoaches;

    if (search) {
      filtered = filtered.filter(coach =>
        coach.name.toLowerCase().includes(search.toLowerCase()) ||
        coach.title.toLowerCase().includes(search.toLowerCase()) ||
        coach.bio.toLowerCase().includes(search.toLowerCase()) ||
        coach.specialties.some(spec => spec.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (specialty && specialty !== 'All Specialties') {
      filtered = filtered.filter(coach => 
        coach.specialties.some(spec => spec.includes(specialty))
      );
    }

    if (availability) {
      filtered = filtered.filter(coach => coach.availability === availability);
    }

    if (rate) {
      const maxRateNum = parseInt(rate);
      filtered = filtered.filter(coach => coach.hourly_rate <= maxRateNum);
    }

    setCoaches(filtered);
  };

  const getAvailabilityBadge = (availability: Coach['availability']) => {
    const badges = {
      available: 'bg-green-100 text-green-800',
      busy: 'bg-yellow-100 text-yellow-800',
      unavailable: 'bg-red-100 text-red-800'
    };

    const labels = {
      available: 'Available',
      busy: 'Busy',
      unavailable: 'Unavailable'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[availability]}`}>
        {labels[availability]}
      </span>
    );
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-neutral-300'
            }`}
          />
        ))}
        <span className="text-sm font-medium text-neutral-700 ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
            Robotics Coaches & Mentors
          </h1>
          <p className="text-neutral-600">
            Find and connect with expert robotics coaches and mentors
          </p>
        </div>
        {isSyraRoboAdmin ? (
          <Button className="mt-4 sm:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Add Coach
          </Button>
        ) : (
          <div className="mt-4 sm:mt-0 text-sm text-red-600">Only SyraRobo school admin can add coaches.</div>
        )}
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
                placeholder="Search coaches by name, specialty, or expertise..."
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
              value={selectedSpecialty}
              onChange={(e) => {
                setSelectedSpecialty(e.target.value);
                filterCoaches(searchTerm, e.target.value, selectedAvailability, maxRate);
              }}
            >
              {specialtyOptions.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
            <select 
              className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
              value={selectedAvailability}
              onChange={(e) => {
                setSelectedAvailability(e.target.value);
                filterCoaches(searchTerm, selectedSpecialty, e.target.value, maxRate);
              }}
            >
              <option value="">All Availability</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <Input
              placeholder="Max Rate ($)"
              value={maxRate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setMaxRate(e.target.value);
                filterCoaches(searchTerm, selectedSpecialty, selectedAvailability, e.target.value);
              }}
              className="w-32"
            />
          </div>
        </div>

        {/* Expanded Filters for Mobile */}
        {showFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t border-neutral-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select 
                className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                value={selectedSpecialty}
                onChange={(e) => {
                  setSelectedSpecialty(e.target.value);
                  filterCoaches(searchTerm, e.target.value, selectedAvailability, maxRate);
                }}
              >
                {specialtyOptions.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
              <select 
                className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                value={selectedAvailability}
                onChange={(e) => {
                  setSelectedAvailability(e.target.value);
                  filterCoaches(searchTerm, selectedSpecialty, e.target.value, maxRate);
                }}
              >
                <option value="">All Availability</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <Input
                placeholder="Max Rate ($)"
                value={maxRate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setMaxRate(e.target.value);
                  filterCoaches(searchTerm, selectedSpecialty, selectedAvailability, e.target.value);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-neutral-600">
          Showing {coaches.length} coach{coaches.length !== 1 ? 'es' : ''}
        </p>
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-neutral-200 rounded-full flex-shrink-0">
                {/* Avatar placeholder */}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {coach.name}
                  </h3>
                  {coach.verified && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      Verified
                    </span>
                  )}
                  {getAvailabilityBadge(coach.availability)}
                </div>
                <p className="text-sm text-neutral-600 mb-2">{coach.title}</p>
                <div className="flex items-center gap-4 text-sm">
                  <StarRating rating={coach.rating} />
                  <span className="text-neutral-600">({coach.total_reviews} reviews)</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-lg font-bold text-neutral-900">
                  ${coach.hourly_rate}/hr
                </div>
                <p className="text-xs text-neutral-500">Response: {coach.response_time}</p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-neutral-700 text-sm mb-4 line-clamp-3">
              {coach.bio}
            </p>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-neutral-600">
                <MapPin className="w-4 h-4 mr-2" />
                {coach.location}
              </div>
              <div className="flex items-center text-sm text-neutral-600">
                <Award className="w-4 h-4 mr-2" />
                {coach.experience_years} years experience
              </div>
              <div className="flex items-center text-sm text-neutral-600">
                <Calendar className="w-4 h-4 mr-2" />
                {coach.education}
              </div>
            </div>

            {/* Specialties */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {coach.specialties.slice(0, 4).map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-medium"
                  >
                    {specialty}
                  </span>
                ))}
                {coach.specialties.length > 4 && (
                  <span className="text-neutral-500 text-xs px-2 py-1">
                    +{coach.specialties.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Achievements */}
            {coach.achievements.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-neutral-700 mb-2">Recent Achievements</h4>
                <div className="space-y-1">
                  {coach.achievements.slice(0, 2).map((achievement, index) => (
                    <div key={index} className="text-xs text-neutral-600">
                      • {achievement}
                    </div>
                  ))}
                  {coach.achievements.length > 2 && (
                    <div className="text-xs text-neutral-500">
                      +{coach.achievements.length - 2} more achievements
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Languages */}
            <div className="mb-4">
              <div className="flex items-center text-sm text-neutral-600">
                <MessageCircle className="w-4 h-4 mr-2" />
                Languages: {coach.languages.join(', ')}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link href={`/coaches/${coach.id}`} className="flex-1">
                <Button variant="outline" className="w-full" size="sm">
                  View Profile
                </Button>
              </Link>
              {coach.availability === 'available' && (
                <Button className="flex-1" size="sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Book Session
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {coaches.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            No coaches found
          </h3>
          <p className="text-neutral-600 mb-4">
            Try adjusting your search criteria or browse all coaches.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedSpecialty('All Specialties');
              setSelectedAvailability('');
              setMaxRate('');
              setCoaches(mockCoaches);
            }}>
              Clear Filters
            </Button>
            <Button>
              Become a Mentor
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}