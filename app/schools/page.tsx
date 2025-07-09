'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Star, 
  Users, 
  Eye, 
  Filter,
  Plus
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface School {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  totalStudents: number;
  programs: string[];
  image: string;
  verified: boolean;
  contact: {
    email: string;
    phone: string;
  };
  adminEmail: string;
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [allSchools, setAllSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState<{ open: boolean; school: School | null }>({ open: false, school: null });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    description: '',
    location: '',
    email: '',
    phone: '',
    adminEmail: '',
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Fetch schools from backend
  useEffect(() => {
    const fetchSchools = async () => {
      const res = await fetch('/api/schools');
      const data = await res.json();
      setSchools(data.schools || []);
      setAllSchools(data.schools || []);
    };
    fetchSchools();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterSchools(value, selectedLocation);
  };

  const filterSchools = (search: string, location: string) => {
    let filtered = allSchools;
    if (search) {
      filtered = filtered.filter(school =>
        school.name.toLowerCase().includes(search.toLowerCase()) ||
        school.description.toLowerCase().includes(search.toLowerCase()) ||
        school.location.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (location) {
      filtered = filtered.filter(school => school.location.toLowerCase().includes(location.toLowerCase()));
    }
    setSchools(filtered);
  };

  const handleRegisterSchool = async () => {
    setRegisterLoading(true);
    setRegisterError(null);
    try {
      const res = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setRegisterError(data.error || 'Registration failed.');
        setRegisterLoading(false);
        return;
      }
      setSchools([data.school, ...schools]);
      setShowRegisterModal(false);
      setRegisterForm({ name: '', description: '', location: '', email: '', phone: '', adminEmail: '' });
    } catch (err) {
      setRegisterError('Network error. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
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
        <span className="text-sm text-neutral-600 ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
            Robotics Schools
          </h1>
          <p className="text-neutral-600">
            Discover and connect with robotics education institutions
          </p>
        </div>
        <Button className="mt-4 sm:mt-0" onClick={() => setShowRegisterModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Register School
        </Button>
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
                placeholder="Search schools by name, location, or programs..."
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
            <select className="px-3 py-2 border border-neutral-200 rounded-lg text-sm">
              <option value="">All Locations</option>
              <option value="CA">California</option>
              <option value="TX">Texas</option>
              <option value="MA">Massachusetts</option>
            </select>
            <select className="px-3 py-2 border border-neutral-200 rounded-lg text-sm">
              <option value="">All Programs</option>
              <option value="first">FIRST Robotics</option>
              <option value="vex">VEX Robotics</option>
              <option value="programming">Programming</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters for Mobile */}
        {showFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t border-neutral-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select className="px-3 py-2 border border-neutral-200 rounded-lg text-sm">
                <option value="">All Locations</option>
                <option value="CA">California</option>
                <option value="TX">Texas</option>
                <option value="MA">Massachusetts</option>
              </select>
              <select className="px-3 py-2 border border-neutral-200 rounded-lg text-sm">
                <option value="">All Programs</option>
                <option value="first">FIRST Robotics</option>
                <option value="vex">VEX Robotics</option>
                <option value="programming">Programming</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-neutral-600">
          Showing {schools.length} school{schools.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => (
          <div
            key={school.id}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {/* School Image */}
            <div className="h-48 bg-neutral-200 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              {school.verified && (
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Verified
                </div>
              )}
            </div>

            {/* School Info */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1">
                  {school.name}
                </h3>
                <StarRating rating={school.rating} />
              </div>

              <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                {school.description}
              </p>

              {/* Location and Students */}
              <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {school.location}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {school.totalStudents} students
                </div>
              </div>

              {/* Programs */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {school.programs.slice(0, 3).map((program, index) => (
                    <span
                      key={index}
                      className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      {program}
                    </span>
                  ))}
                  {school.programs.length > 3 && (
                    <span className="text-neutral-500 text-xs px-2 py-1">
                      +{school.programs.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link href={`/schools/${school.id}`} className="flex-1">
                  <Button className="w-full" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => setShowContactModal({ open: true, school })}>
                  Contact
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {schools.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            No schools found
          </h3>
          <p className="text-neutral-600 mb-4">
            Try adjusting your search criteria or browse all schools.
          </p>
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setSelectedLocation('');
            setSchools(allSchools);
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Register School Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Register a New School</h3>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="School Name"
                value={registerForm.name}
                onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                disabled={registerLoading}
              />
              <Input
                type="text"
                placeholder="Description"
                value={registerForm.description}
                onChange={e => setRegisterForm({ ...registerForm, description: e.target.value })}
                disabled={registerLoading}
              />
              <Input
                type="text"
                placeholder="Location"
                value={registerForm.location}
                onChange={e => setRegisterForm({ ...registerForm, location: e.target.value })}
                disabled={registerLoading}
              />
              <Input
                type="email"
                placeholder="Contact Email"
                value={registerForm.email}
                onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                disabled={registerLoading}
              />
              <Input
                type="text"
                placeholder="Contact Phone"
                value={registerForm.phone}
                onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
                disabled={registerLoading}
              />
              <Input
                type="email"
                placeholder="Admin Email"
                value={registerForm.adminEmail}
                onChange={e => setRegisterForm({ ...registerForm, adminEmail: e.target.value })}
                disabled={registerLoading}
              />
              {registerError && <div className="text-red-600 text-sm">{registerError}</div>}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowRegisterModal(false)} className="flex-1" disabled={registerLoading}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleRegisterSchool} disabled={!registerForm.name || !registerForm.email || registerLoading}>
                {registerLoading ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Contact Modal */}
      {showContactModal.open && showContactModal.school && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Contact {showContactModal.school.name}</h3>
            <div className="space-y-3 mb-4">
              <div>
                <span className="font-medium">Email: </span>
                <a href={`mailto:${showContactModal.school.contact.email}`} className="text-primary-600 hover:underline">
                  {showContactModal.school.contact.email}
                </a>
              </div>
              <div>
                <span className="font-medium">Phone: </span>
                <a href={`tel:${showContactModal.school.contact.phone}`} className="text-primary-600 hover:underline">
                  {showContactModal.school.contact.phone}
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={() => setShowContactModal({ open: false, school: null })}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}