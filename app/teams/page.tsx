'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Users, 
  MapPin, 
  Calendar,
  Award,
  Plus,
  Filter,
  Star,
  User,
  Target
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Dialog } from '@headlessui/react';
import { showToast } from '@/components/ui/Toast';
import { useSession } from 'next-auth/react';

interface Team {
  id: string;
  name: string;
  description: string;
  school: string;
  location: string;
  members: number;
  max_members: number;
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  founded: string;
  achievements: string[];
  categories: string[];
  looking_for_members: boolean;
  captain: {
    name: string;
    avatar: string;
  };
  status: 'active' | 'recruiting' | 'inactive';
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: session } = useSession();
  const user = (session?.user ?? {}) as { id?: string; role?: string; email?: string };
  const isSchoolAdmin = user?.role === 'school-admin';
  // Modal state for registration
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registeringTeam, setRegisteringTeam] = useState<any>(null);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState('');
  const [registerStatus, setRegisterStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<string>('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  // Fetch competitions when modal opens
  useEffect(() => {
    if (!showRegisterModal) return;
    const fetchCompetitions = async () => {
      const res = await fetch('/api/competitions');
      const data = await res.json();
      setCompetitions((data.competitions || []).filter((c: any) => c.status === 'registration_open'));
    };
    fetchCompetitions();
  }, [showRegisterModal]);

  // Get schoolId from team when opening modal
  const openRegisterModal = (team: any) => {
    setRegisteringTeam(team);
    setSchoolId(team.schoolId || '');
    setShowRegisterModal(true);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/teams');
        const data = await res.json();
        setTeams(data.teams || []);
        setAllTeams(data.teams || []);
      } catch (err) {
        setError('Failed to load teams.');
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterTeams(value, selectedSkillLevel, selectedStatus);
  };

  const filterTeams = (search: string, skill: string, status: string) => {
    let filtered = allTeams;
    if (search) {
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(search.toLowerCase()) ||
        team.description.toLowerCase().includes(search.toLowerCase()) ||
        team.school.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (skill) {
      filtered = filtered.filter(team => team.skill_level === skill);
    }
    if (status) {
      filtered = filtered.filter(team => team.status === status);
    }
    setTeams(filtered);
  };

  const getStatusBadge = (status: Team['status']) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      recruiting: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      active: 'Active',
      recruiting: 'Recruiting',
      inactive: 'Inactive'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getSkillLevelBadge = (level: Team['skill_level']) => {
    const badges = {
      beginner: 'bg-green-50 text-green-700 border-green-200',
      intermediate: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      advanced: 'bg-red-50 text-red-700 border-red-200'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${badges[level]}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  const handleEditTeam = async (teamId: string, name: string, competitionId?: string) => {
    try {
      const res = await fetch('/api/teams', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, name, competitionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        return;
      }
      setTeams(teams.map(t => t.id === teamId ? data.team : t));
    } catch (err) {
      // No-op
    }
  };

  // Place handleCreateTeam here so it is in scope for the modal
  const handleCreateTeam = async (form: any) => {
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        return;
      }
      setTeams([data.team, ...teams]);
      setShowCreateForm(false);
    } catch (err) {
      // No-op
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
            Robotics Teams
          </h1>
          <p className="text-neutral-600">
            Join a team or create your own to compete and learn together
          </p>
        </div>
        <Button 
          className="mt-4 sm:mt-0"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Team
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
                placeholder="Search teams by name, school, or location..."
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
                filterTeams(searchTerm, e.target.value, selectedStatus);
              }}
            >
              <option value="">All Skill Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select 
              className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                filterTeams(searchTerm, selectedSkillLevel, e.target.value);
              }}
            >
              <option value="">All Status</option>
              <option value="recruiting">Recruiting</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters for Mobile */}
        {showFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t border-neutral-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select 
                className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                value={selectedSkillLevel}
                onChange={(e) => {
                  setSelectedSkillLevel(e.target.value);
                  filterTeams(searchTerm, e.target.value, selectedStatus);
                }}
              >
                <option value="">All Skill Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select 
                className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  filterTeams(searchTerm, selectedSkillLevel, e.target.value);
                }}
              >
                <option value="">All Status</option>
                <option value="recruiting">Recruiting</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-neutral-600">
          Showing {teams.length} team{teams.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <svg className="w-8 h-8 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-neutral-600">Loading teams...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {error}
            </h3>
            <p className="text-neutral-600 mb-4">
              Please try again later.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </div>
        ) : teams.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No teams found
            </h3>
            <p className="text-neutral-600 mb-4">
              Try adjusting your search criteria or create a new team.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setSelectedSkillLevel('');
                setSelectedStatus('');
                setTeams(allTeams);
              }}>
                Clear Filters
              </Button>
              <Button onClick={() => setShowCreateForm(true)}>
                Create Team
              </Button>
            </div>
          </div>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {team.name}
                    </h3>
                    {getStatusBadge(team.status)}
                  </div>
                  <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
                    {team.description}
                  </p>
                </div>
              </div>

              {/* Team Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-neutral-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {team.school}
                  </div>
                  {getSkillLevelBadge(team.skill_level)}
                </div>

                <div className="flex items-center text-sm text-neutral-600">
                  <Users className="w-4 h-4 mr-2" />
                  {team.members}/{team.max_members} members
                </div>

                <div className="flex items-center text-sm text-neutral-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Founded {new Date(team.founded).getFullYear()}
                </div>

                <div className="flex items-center text-sm text-neutral-600">
                  <Star className="w-4 h-4 mr-2" />
                  Captain: {team.captain.name}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {team.categories.slice(0, 3).map((category, index) => (
                    <span
                      key={index}
                      className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      {category}
                    </span>
                  ))}
                  {team.categories.length > 3 && (
                    <span className="text-neutral-500 text-xs px-2 py-1">
                      +{team.categories.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Achievements */}
              {team.achievements.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Award className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-sm font-medium text-neutral-700">Recent Achievements</span>
                  </div>
                  <div className="space-y-1">
                    {team.achievements.slice(0, 2).map((achievement, index) => (
                      <div key={index} className="text-xs text-neutral-600">
                        • {achievement}
                      </div>
                    ))}
                    {team.achievements.length > 2 && (
                      <div className="text-xs text-neutral-500">
                        +{team.achievements.length - 2} more achievements
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Member Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span>Team Size</span>
                  <span>{Math.round((team.members / team.max_members) * 100)}% full</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((team.members / team.max_members) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link href={`/teams/${team.id}`} className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    View Team
                  </Button>
                </Link>
                {team.looking_for_members && team.status === 'recruiting' && (
                  <Button className="flex-1" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Join Team
                  </Button>
                )}
                {isSchoolAdmin && (
                  <Button className="flex-1" size="sm" onClick={() => openRegisterModal(team)}>
                    <Target className="w-4 h-4 mr-2" />
                    Register for Competition
                  </Button>
                )}
                <Button className="flex-1" size="sm" variant="outline" onClick={() => { setEditingTeam(team); setShowEditForm(true); }}>
                  Edit
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Empty State */}
      {/* This section is now handled by the loading/error states */}

      {/* Create Team Modal */}
      {showCreateForm && (
        <Dialog open={showCreateForm} onClose={() => setShowCreateForm(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Create New Team</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = Object.fromEntries(new FormData(e.currentTarget));
                await handleCreateTeam(form);
                setShowCreateForm(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Team Name</label>
                <Input name="name" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input name="description" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">School</label>
                <Input name="school" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input name="location" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Skill Level</label>
                <select name="skill_level" className="w-full border rounded px-2 py-1" required>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="flex gap-2 mt-6">
                <Button type="submit" variant="primary">Create</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </Dialog>
      )}
      {/* Register Modal */}
      {showRegisterModal && registeringTeam && (
        <Dialog open={showRegisterModal} onClose={() => setShowRegisterModal(false)} className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="bg-white rounded-lg max-w-md w-full p-6 z-10">
            <Dialog.Title className="text-lg font-semibold mb-4">Register {registeringTeam.name} for Competition</Dialog.Title>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Select Competition</label>
              <select
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm"
                value={selectedCompetitionId}
                onChange={e => setSelectedCompetitionId(e.target.value)}
              >
                <option value="">Select a competition</option>
                {competitions.map(comp => (
                  <option key={comp._id || comp.id} value={comp._id || comp.id}>{comp.title}</option>
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
                disabled={!selectedCompetitionId || registerStatus === 'loading'}
                onClick={async () => {
                  setRegisterStatus('loading');
                  setRegisterError(null);
                  try {
                    const res = await fetch('/api/competitions', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        competitionId: selectedCompetitionId,
                        teamId: registeringTeam._id || registeringTeam.id,
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
      {/* Edit Team Modal */}
      {showEditForm && editingTeam && (
        <Dialog open={showEditForm} onClose={() => setShowEditForm(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Edit Team</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = Object.fromEntries(new FormData(e.currentTarget));
                await handleEditTeam(editingTeam.id, form.name as string, form.competitionId as string);
                setShowEditForm(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Team Name</label>
                <Input name="name" defaultValue={editingTeam.name} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input name="description" defaultValue={editingTeam.description} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">School</label>
                <Input name="school" defaultValue={editingTeam.school} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input name="location" defaultValue={editingTeam.location} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Skill Level</label>
                <select name="skill_level" className="w-full border rounded px-2 py-1" defaultValue={editingTeam.skill_level} required>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="flex gap-2 mt-6">
                <Button type="submit" variant="primary">Save</Button>
                <Button type="button" variant="outline" onClick={() => setShowEditForm(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </Dialog>
      )}
    </div>
  );
}