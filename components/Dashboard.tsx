import React from 'react';
import { ProgressData, User } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SUBJECTS } from '../constants';

interface DashboardProps {
  progress: ProgressData;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ progress, user }) => {
  const COLORS = ['#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#F59E0B'];

  const masteryData = SUBJECTS.map((sub, index) => {
    // Calculate mastery based on total branches/lessons vs completed
    // This is a simulation based on mock progress data
    const subjectPrefix = sub.branches[0].id.split('-')[0];
    const completedInSubject = progress.completedLessons.filter(l => l.startsWith(subjectPrefix)).length;
    return {
      name: sub.name,
      completed: completedInSubject,
      total: sub.branches.reduce((acc, b) => acc + b.totalLessons, 0) / 20 // Scaling down for visual
    };
  });

  const quizPerformanceData = Object.entries(progress.quizScores).map(([key, score]) => ({
      name: `Quiz ${key.split('-').pop()}`,
      score: score
  })).slice(-10); // Last 10 quizzes

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-4">Welcome back, {user.username}! 👋</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 p-4 rounded-xl">
            <p className="text-indigo-600 font-medium text-sm">Total XP</p>
            <p className="text-3xl font-bold text-indigo-900">{user.xp}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl">
            <p className="text-emerald-600 font-medium text-sm">Completed Lessons</p>
            <p className="text-3xl font-bold text-emerald-900">{progress.completedLessons.length}</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl">
            <p className="text-amber-600 font-medium text-sm">Learning Time</p>
            <p className="text-3xl font-bold text-amber-900">{Math.floor(progress.timeSpentMinutes / 60)}h {progress.timeSpentMinutes % 60}m</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px]">
          <h3 className="text-lg font-bold mb-6">Subject Mastery</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={masteryData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px]">
           <h3 className="text-lg font-bold mb-6">Recent Quiz Performance</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={quizPerformanceData}>
                 <XAxis dataKey="name" fontSize={10} hide />
                 <YAxis domain={[0, 100]} fontSize={12} />
                 <Tooltip />
                 <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]}>
                    {quizPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={(entry.score as number) >= 80 ? '#10b981' : (entry.score as number) >= 50 ? '#f59e0b' : '#ef4444'} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;