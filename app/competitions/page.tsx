'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  Clock,
  Filter,
  Plus,
  Star,
  Target
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useSession, signIn } from 'next-auth/react';
import { Dialog } from '@headlessui/react';
import { showToast } from '@/components/ui/Toast';

interface Competition {
  _id?: string; // Added for backend compatibility
  id: string;
  title: string;
  description: string;
  type: 'tournament' | 'league' | 'challenge';
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  location: string;
  date: string;
  registration_deadline: string;
  max_teams: number;
  registered_teams: number;
  prize_pool: string;
  organizer: string;
  categories: string[];
  status: 'upcoming' | 'registration_open' | 'registration_closed' | 'in_progress' | 'completed';
}

const mockCompetitions: Competition[] = [
  {
    id: '1',
    title: 'Regional Robotics Championship 2024',
    description: 'Annual championship featuring the best high school robotics teams in the region.',
    type: 'tournament',
    skill_level: 'advanced',
    location: 'San Francisco Convention Center',
    date: '2024-04-15',
    registration_deadline: '2024-03-15',
    max_teams: 64,
    registered_teams: 45,
    prize_pool: '$25,000',
    organizer: 'Bay Area Robotics Alliance',
    categories: ['Autonomous Navigation', 'Object Manipulation', 'Team Presentation'],
    status: 'registration_open'
  },
  {
    id: '2',
    title: 'FIRST Tech Challenge - Spring Tournament',
    description: 'Official FIRST Tech Challenge tournament for middle and high school teams.',
    type: 'tournament',
    skill_level: 'all',
    location: 'Austin Tech Center',
    date: '2024-03-22',
    registration_deadline: '2024-02-22',
    max_teams: 48,
    registered_teams: 32,
    prize_pool: '$15,000',
    organizer: 'FIRST Texas',
    categories: ['Robot Game', 'Innovation Project', 'Robot Design'],
    status: 'registration_open'
  },
  {
    id: '3',
    title: 'Beginner Bot Battle',
    description: 'Perfect first competition for new robotics teams and students.',
    type: 'challenge',
    skill_level: 'beginner',
    location: 'Local Community Center',
    date: '2024-02-28',
    registration_deadline: '2024-02-20',
    max_teams: 24,
    registered_teams: 18,
    prize_pool: '$2,500',
    organizer: 'Robotics Education Foundation',
    categories: ['Line Following', 'Obstacle Course', 'Creative Design'],
    status: 'registration_open'
  }
];

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [allCompetitions, setAllCompetitions] = useState<Competition[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showNotSchoolModal, setShowNotSchoolModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registeringCompetition, setRegisteringCompetition] = useState<Competition | null>(null);
  const [registerStatus, setRegisterStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [schoolId, setSchoolId] = useState<string>('');
  const { data: session, status } = useSession();
  // Type guard for user
  const user = (session?.user ?? {}) as { id?: string; role?: string; email?: string };
  const isSchool = user?.role === 'school-admin' || user?.email?.endsWith('@school.com');

  // Fetch competitions from backend
  useEffect(() => {
    const fetchCompetitions = async () => {
      const res = await fetch('/api/competitions');
      const data = await res.json();
      setCompetitions(data.competitions || []);
      setAllCompetitions(data.competitions || []);
    };
    fetchCompetitions();
  }, []);

  // Fetch user's teams and schoolId
  useEffect(() => {
    if (!user?.email) return;
    const fetchTeamsAndSchool = async () => {
      // Get teams
      const res = await fetch('/api/teams');
      const data = await res.json();
      // Only teams where user is a member or captain
      const userId = user.id;
      const userTeams = (data.teams || []).filter((team: any) =>
        team.captainId === userId || (team.members && team.members.some((m: any) => m.userId === userId))
      );
      setTeams(userTeams);
      // Get schoolId from first team or from /api/schools (if admin)
      if (userTeams.length > 0) {
        setSchoolId(userTeams[0].schoolId);
      } else if (user?.role === 'school-admin') {
        // Try to get school by adminEmail
        const schoolsRes = await fetch('/api/schools');
        const schoolsData = await schoolsRes.json();
        const school = (schoolsData.schools || []).find((s: any) => s.adminEmail === user.email);
        if (school) setSchoolId(school._id);
      }
    };
    fetchTeamsAndSchool();
  }, [user]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterCompetitions(value, selectedSkillLevel, selectedType, selectedStatus);
  };

  const filterCompetitions = (search: string, skill: string, type: string, status: string) => {
    let filtered = allCompetitions;
    if (search) {
      filtered = filtered.filter(comp =>
        comp.title.toLowerCase().includes(search.toLowerCase()) ||
        comp.description.toLowerCase().includes(search.toLowerCase()) ||
        comp.organizer.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (skill) {
      filtered = filtered.filter(comp => comp.skill_level === skill || comp.skill_level === 'all');
    }
    if (type) {
      filtered = filtered.filter(comp => comp.type === type);
    }
    if (status) {
      filtered = filtered.filter(comp => comp.status === status);
    }
    setCompetitions(filtered);
  };

  const getStatusBadge = (status: Competition['status']) => {
    const badges = {
      upcoming: 'bg-blue-100 text-blue-800',
      registration_open: 'bg-green-100 text-green-800',
      registration_closed: 'bg-red-100 text-red-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      upcoming: 'Upcoming',
      registration_open: 'Registration Open',
      registration_closed: 'Registration Closed',
      in_progress: 'In Progress',
      completed: 'Completed'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getSkillLevelBadge = (level: Competition['skill_level']) => {
    const badges = {
      beginner: 'bg-green-50 text-green-700 border-green-200',
      intermediate: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      advanced: 'bg-red-50 text-red-700 border-red-200',
      all: 'bg-blue-50 text-blue-700 border-blue-200'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${badges[level]}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
            Robotics Competitions
          </h1>
          <p className="text-neutral-600">
            Compete, learn, and showcase your robotics skills
          </p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Create Competition
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
                placeholder="Search competitions by name, organizer, or location..."
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
              value={selectedSkillLevel}
              onChange={(e) => {
                setSelectedSkillLevel(e.target.value);
                filterCompetitions(searchTerm, e.target.value, selectedType, selectedStatus);
              }}
            >
              <option value="">All Skill Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select 
              className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                filterCompetitions(searchTerm, selectedSkillLevel, e.target.value, selectedStatus);
              }}
            >
              <option value="">All Types</option>
              <option value="tournament">Tournament</option>
              <option value="league">League</option>
              <option value="challenge">Challenge</option>
            </select>
            <select 
              className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                filterCompetitions(searchTerm, selectedSkillLevel, selectedType, e.target.value);
              }}
            >
              <option value="">All Status</option>
              <option value="registration_open">Registration Open</option>
              <option value="upcoming">Upcoming</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters for Mobile */}
        {showFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t border-neutral-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select 
                className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                value={selectedSkillLevel}
                onChange={(e) => {
                  setSelectedSkillLevel(e.target.value);
                  filterCompetitions(searchTerm, e.target.value, selectedType, selectedStatus);
                }}
              >
                <option value="">All Skill Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select 
                className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  filterCompetitions(searchTerm, selectedSkillLevel, e.target.value, selectedStatus);
                }}
              >
                <option value="">All Types</option>
                <option value="tournament">Tournament</option>
                <option value="league">League</option>
                <option value="challenge">Challenge</option>
              </select>
              <select 
                className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  filterCompetitions(searchTerm, selectedSkillLevel, selectedType, e.target.value);
                }}
              >
                <option value="">All Status</option>
                <option value="registration_open">Registration Open</option>
                <option value="upcoming">Upcoming</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-neutral-600">
          Showing {competitions.length} competition{competitions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {competitions.map((competition) => (
          <div
            key={competition._id || competition.id}
            className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {competition.title}
                  </h3>
                  {getStatusBadge(competition.status)}
                </div>
                <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
                  {competition.description}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-neutral-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(competition.date).toLocaleDateString()}
                </div>
                {getSkillLevelBadge(competition.skill_level)}
              </div>

              <div className="flex items-center text-sm text-neutral-600">
                <MapPin className="w-4 h-4 mr-2" />
                {competition.location}
              </div>

              <div className="flex items-center justify-between text-sm text-neutral-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {competition.registered_teams}/{competition.max_teams} teams
                </div>
                <div className="flex items-center">
                  <Trophy className="w-4 h-4 mr-2" />
                  {competition.prize_pool}
                </div>
              </div>

              <div className="flex items-center text-sm text-neutral-600">
                <Clock className="w-4 h-4 mr-2" />
                Registration closes: {new Date(competition.registration_deadline).toLocaleDateString()}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {competition.categories.slice(0, 3).map((category, index) => (
                  <span
                    key={index}
                    className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-medium"
                  >
                    {category}
                  </span>
                ))}
                {competition.categories.length > 3 && (
                  <span className="text-neutral-500 text-xs px-2 py-1">
                    +{competition.categories.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Organizer */}
            <div className="text-sm text-neutral-500 mb-4">
              Organized by {competition.organizer}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-neutral-600 mb-1">
                <span>Registration Progress</span>
                <span>{Math.round((competition.registered_teams / competition.max_teams) * 100)}%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((competition.registered_teams / competition.max_teams) * 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link href={`/competitions/${competition._id || competition.id}`} className="flex-1">
                <Button variant="outline" className="w-full" size="sm">
                  View Details
                </Button>
              </Link>
              {competition.status === 'registration_open' && (
                <Button
                  className="flex-1"
                  size="sm"
                  onClick={() => {
                    if (!session) {
                      signIn();
                    } else if (!isSchool) {
                      setShowNotSchoolModal(true);
                    } else {
                      setRegisteringCompetition(competition);
                      setShowRegisterModal(true);
                    }
                  }}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Register Team
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {competitions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            No competitions found
          </h3>
          <p className="text-neutral-600 mb-4">
            Try adjusting your search criteria or browse all competitions.
          </p>
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setSelectedSkillLevel('');
            setSelectedType('');
            setSelectedStatus('');
            setCompetitions(allCompetitions); // Reset to all competitions
          }}>
            Clear Filters
          </Button>
        </div>
      )}
      {/* Not School Modal */}
      {showNotSchoolModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Registration Restricted</h3>
            <p className="text-neutral-700 mb-4">You must be signed in as a <b>school</b> to register for competitions.</p>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={() => setShowNotSchoolModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Register Modal */}
      {showRegisterModal && registeringCompetition && (
        <Dialog open={showRegisterModal} onClose={() => setShowRegisterModal(false)} className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="bg-white rounded-lg max-w-md w-full p-6 z-10">
            <Dialog.Title className="text-lg font-semibold mb-4">Register Team for {registeringCompetition.title}</Dialog.Title>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Select Your Team</label>
              <select
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                value={selectedTeamId}
                onChange={e => setSelectedTeamId(e.target.value)}
              >
                <option value="">Select a team</option>
                {teams.map(team => (
                  <option key={team._id || team.id} value={team._id || team.id}>{team.name}</option>
                ))}
              </select>
            </div>
            {registerStatus === 'error' && <div className="text-red-600 mb-2">{registerError}</div>}
            {registerStatus === 'success' && <div className="text-green-600 mb-2">Registration successful!</div>}
            <div className="flex gap-3 mt-4">
              <Button className="flex-1" variant="outline" onClick={() => setShowRegisterModal(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={!selectedTeamId || registerStatus === 'loading'}
                onClick={async () => {
                  setRegisterStatus('loading');
                  setRegisterError(null);
                  try {
                    const res = await fetch('/api/competitions', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        competitionId: registeringCompetition._id || registeringCompetition.id,
                        teamId: selectedTeamId,
                        schoolId,
                      }),
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      setRegisterStatus('error');
                      setRegisterError(data.error || 'Registration failed.');
                      showToast.error('Registration failed', data.error || 'Could not register your team.');
                    } else {
                      setRegisterStatus('success');
                      showToast.success('Registration successful', 'Your team has been registered for the competition.');
                      // Optionally update competitions state to reflect registration
                    }
                  } catch (err) {
                    setRegisterStatus('error');
                    setRegisterError('Network error.');
                    showToast.error('Network error', 'Could not register your team.');
                  }
                }}
              >
                {registerStatus === 'loading' ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}