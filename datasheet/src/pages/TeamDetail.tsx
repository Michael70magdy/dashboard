import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Calendar, MessageSquare, TrendingUp, TrendingDown, User, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const TeamDetail: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { user } = useAuth();
  const { teams, getTeamGrades, getTeamTotalPoints } = useData();

  // Check if user has access to this team
  const hasAccess = user && (
    user.role === 'admin' || 
    (user.role === 'team' && user.teamId === teamId)
  );

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  const team = teams.find(t => t.id === teamId);
  const grades = getTeamGrades(teamId!);
  const totalPoints = getTeamTotalPoints(teamId!);

  if (!team) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Team Not Found</h3>
        <p className="text-gray-600">The requested team could not be found.</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPointsColor = (points: number) => {
    if (points > 0) return 'text-green-600 bg-green-50';
    if (points < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getPointsIcon = (points: number) => {
    if (points > 0) return <TrendingUp className="h-4 w-4" />;
    if (points < 0) return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className={`w-12 h-12 ${team.color} rounded-full shadow-sm`} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
            <p className="text-gray-600">Detailed grade history</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-2xl font-semibold text-gray-900">{totalPoints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-semibold text-gray-900">{grades.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Latest Entry</p>
              <p className="text-lg font-semibold text-gray-900">
                {grades.length > 0 ? formatDate(grades[0].timestamp).split(',')[0] : 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Grade History</h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete history of all grade entries and comments
          </p>
        </div>

        {grades.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No grades yet</h3>
            <p className="text-gray-600">Grade entries will appear here once they are added by an admin.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {grades.map((grade, index) => (
              <div key={grade.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getPointsColor(grade.points)}`}>
                        {getPointsIcon(grade.points)}
                        <span>{grade.points > 0 ? '+' : ''}{grade.points} points</span>
                      </span>
                      <div className="flex items-center text-sm text-gray-500 space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(grade.timestamp)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-md p-3 mb-2">
                      <p className="text-gray-800">{grade.comment}</p>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      <User className="h-3 w-3" />
                      <span>Added by {grade.addedBy}</span>
                    </div>
                  </div>
                  
                  <div className="ml-4 text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      Entry #{grades.length - index}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDetail;