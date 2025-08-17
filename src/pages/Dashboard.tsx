import React from 'react';
import { Trophy, TrendingUp, Users } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { teams } = useData();
  const { setShowLoginModal, setLoginType, setSelectedTeamId } = useAuth();
  const navigate = useNavigate();

  const sortedTeams = [...teams].sort((a, b) => b.totalPoints - a.totalPoints);

  const handleTeamClick = (teamId: string) => {
    setSelectedTeamId(teamId);
    setLoginType('team');
    setShowLoginModal(true);
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Trophy className="h-5 w-5 text-orange-600" />;
    return <span className="h-5 w-5 flex items-center justify-center text-sm font-semibold text-gray-600">#{index + 1}</span>;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Leaderboard</h1>
        <p className="text-gray-600">Current standings and team performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Teams</p>
              <p className="text-2xl font-semibold text-gray-900">{teams.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Highest Score</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.max(...teams.map(t => t.totalPoints), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Leading Team</p>
              <p className="text-lg font-semibold text-gray-900">
                {sortedTeams[0]?.name || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Team Rankings</h2>
          <p className="text-sm text-gray-600 mt-1">Click on any team to view detailed grades (requires team login)</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {sortedTeams.map((team, index) => (
            <div
              key={team.id}
              onClick={() => handleTeamClick(team.id)}
              className="p-6 hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getRankIcon(index)}
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${team.color} rounded-full shadow-sm`} />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {team.name}
                      </h3>
                      <p className="text-sm text-gray-500">Click to view details</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {team.totalPoints}
                  </div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {teams.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
          <p className="text-gray-600">Teams will appear here once they're added to the system.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;