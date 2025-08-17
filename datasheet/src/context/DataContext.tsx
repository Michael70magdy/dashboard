import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Team {
  id: string;
  name: string;
  color: string;
  totalPoints: number;
}

export interface GradeEntry {
  id: string;
  teamId: string;
  points: number;
  comment: string;
  timestamp: Date;
  addedBy: string;
}

interface DataContextType {
  teams: Team[];
  gradeEntries: GradeEntry[];
  addGradeEntry: (teamId: string, points: number, comment: string, addedBy: string) => void;
  getTeamGrades: (teamId: string) => GradeEntry[];
  getTeamTotalPoints: (teamId: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialTeams: Team[] = [
  { id: 'red', name: 'Team Red', color: 'bg-red-500', totalPoints: 0 },
  { id: 'blue', name: 'Team Blue', color: 'bg-blue-500', totalPoints: 0 },
  { id: 'green', name: 'Team Green', color: 'bg-green-500', totalPoints: 0 },
  { id: 'yellow', name: 'Team Yellow', color: 'bg-yellow-500', totalPoints: 0 }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [gradeEntries, setGradeEntries] = useState<GradeEntry[]>([]);

  const addGradeEntry = (teamId: string, points: number, comment: string, addedBy: string) => {
    const newEntry: GradeEntry = {
      id: Date.now().toString(),
      teamId,
      points,
      comment,
      timestamp: new Date(),
      addedBy
    };

    setGradeEntries(prev => [...prev, newEntry]);
    
    // Update team total points
    setTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { ...team, totalPoints: team.totalPoints + points }
        : team
    ));
  };

  const getTeamGrades = (teamId: string): GradeEntry[] => {
    return gradeEntries.filter(entry => entry.teamId === teamId).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  const getTeamTotalPoints = (teamId: string): number => {
    const team = teams.find(t => t.id === teamId);
    return team?.totalPoints || 0;
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTeams = localStorage.getItem('teams');
    const savedGrades = localStorage.getItem('gradeEntries');
    
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
    if (savedGrades) {
      const parsedGrades = JSON.parse(savedGrades);
      // Convert timestamp strings back to Date objects
      const gradesWithDates = parsedGrades.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
      setGradeEntries(gradesWithDates);
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('gradeEntries', JSON.stringify(gradeEntries));
  }, [gradeEntries]);

  return (
    <DataContext.Provider value={{
      teams,
      gradeEntries,
      addGradeEntry,
      getTeamGrades,
      getTeamTotalPoints
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};