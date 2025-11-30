import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import LessonView from './components/LessonView';
import { User, SubjectType, ProgressData, Branch } from './types';
import { SUBJECTS } from './constants';
import * as LucideIcons from 'lucide-react';

// --- Auth Component (Internal for simplicity) ---
const AuthScreen = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    onLogin({
      id: 'user-123',
      username: username || email.split('@')[0] || 'Learner',
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'Felix'}`,
      xp: 0,
      streak: 1
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-2">OmniLearn 3D</h1>
          <p className="text-gray-500">Master the universe, one lesson at a time.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            onClick={() => setIsLogin(true)} 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${isLogin ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
          >
            Log In
          </button>
          <button 
            onClick={() => setIsLogin(false)} 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!isLogin ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="FutureScientist"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="einstein@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 mt-2">
            {isLogin ? 'Start Learning' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main App Logic ---

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<ProgressData>({
    completedLessons: [],
    quizScores: {},
    timeSpentMinutes: 0,
    mastery: {}
  });

  // Load user from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('omniUser');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedProgress = localStorage.getItem('omniProgress');
    if (savedProgress) setProgress(JSON.parse(savedProgress));
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('omniUser', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('omniUser');
  };

  const updateProgress = (lessonId: string, score: number) => {
    if (!user) return;
    
    const newProgress = { ...progress };
    if (!newProgress.completedLessons.includes(lessonId)) {
      newProgress.completedLessons.push(lessonId);
      // Award XP
      const newUser = { ...user, xp: user.xp + 100 }; // 100 XP per lesson
      setUser(newUser);
      localStorage.setItem('omniUser', JSON.stringify(newUser));
    }
    
    newProgress.quizScores[lessonId] = score;
    newProgress.timeSpentMinutes += 15; // Assume 15 mins per lesson
    
    setProgress(newProgress);
    localStorage.setItem('omniProgress', JSON.stringify(newProgress));
  };

  const navigate = useNavigate();

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <Layout user={user} onLogout={handleLogout} currentPage={window.location.hash} onNavigate={(p) => navigate(p === 'home' ? '/' : `/${p}`)}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard progress={progress} user={user} />} />
        <Route path="/subject/:subjectId" element={<SubjectView />} />
        <Route path="/branch/:subjectId/:branchId" element={<BranchView progress={progress} />} />
        <Route 
          path="/lesson/:subjectId/:branchId/:lessonNum" 
          element={<LessonContainer onComplete={updateProgress} />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

// --- Page Components ---

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Choose a Subject</h1>
      <p className="text-gray-500 mb-8">Select a domain to begin your journey.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUBJECTS.map((sub) => {
          // Dynamic Icon loading
          const Icon = (LucideIcons as any)[sub.icon] || LucideIcons.Book;
          return (
            <button 
              key={sub.id}
              onClick={() => navigate(`/subject/${sub.id}`)}
              className="group relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all text-left"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${sub.color} opacity-10 rounded-bl-[100px] transition-transform group-hover:scale-150`}></div>
              <div className={`w-12 h-12 ${sub.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{sub.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{sub.description}</p>
              <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-indigo-600 transition-colors">
                <span>{sub.branches.length} Branches</span>
                <LucideIcons.ChevronRight size={16} className="ml-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const SubjectView = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const subject = SUBJECTS.find(s => s.id === subjectId);

  if (!subject) return <div>Subject not found</div>;

  return (
    <div>
      <button onClick={() => navigate('/')} className="mb-6 text-gray-500 hover:text-indigo-600 flex items-center text-sm">
        <LucideIcons.ArrowLeft size={16} className="mr-1" /> Back to Subjects
      </button>
      
      <div className="flex items-center space-x-4 mb-8">
        <div className={`w-16 h-16 ${subject.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
          {React.createElement((LucideIcons as any)[subject.icon], { size: 32 })}
        </div>
        <div>
           <h1 className="text-3xl font-bold">{subject.name}</h1>
           <p className="text-gray-500">{subject.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subject.branches.map((branch) => (
           <button
             key={branch.id}
             onClick={() => navigate(`/branch/${subjectId}/${branch.id}`)}
             className="bg-white p-5 rounded-xl border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all text-left flex justify-between items-center group"
           >
             <div>
               <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-700">{branch.name}</h3>
               <p className="text-xs text-gray-400 mt-1">{branch.totalLessons} Lessons</p>
             </div>
             <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
               <LucideIcons.Play size={14} fill="currentColor" />
             </div>
           </button>
        ))}
      </div>
    </div>
  );
};

const BranchView = ({ progress }: { progress: ProgressData }) => {
  const { subjectId, branchId } = useParams();
  const navigate = useNavigate();
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const branch = subject?.branches.find(b => b.id === branchId);

  if (!subject || !branch) return <div>Branch not found</div>;

  // Simulate lesson list (In a real app, this would be data-driven)
  const lessons = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `${branch.name} - Topic ${i + 1}`
  }));

  return (
    <div>
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <span className="cursor-pointer hover:text-indigo-600" onClick={() => navigate('/')}>Subjects</span>
        <LucideIcons.ChevronRight size={14} />
        <span className="cursor-pointer hover:text-indigo-600" onClick={() => navigate(`/subject/${subjectId}`)}>{subject.name}</span>
        <LucideIcons.ChevronRight size={14} />
        <span className="text-gray-900 font-medium">{branch.name}</span>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{branch.name}</h1>
          <p className="text-indigo-100 max-w-xl">{branch.description}</p>
        </div>
        <LucideIcons.Boxes className="absolute right-[-20px] bottom-[-40px] w-64 h-64 text-white opacity-10" />
      </div>

      <h2 className="text-xl font-bold mb-4">Course Content</h2>
      <div className="space-y-3">
        {lessons.map((lesson) => {
           const uniqueId = `${branch.id}-L${lesson.id}`;
           const isCompleted = progress.completedLessons.includes(uniqueId);
           const score = progress.quizScores[uniqueId];

           return (
            <button
              key={lesson.id}
              onClick={() => navigate(`/lesson/${subjectId}/${branchId}/${lesson.id}`)}
              className={`w-full flex items-center p-4 rounded-xl border transition-all ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-indigo-300'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 font-bold ${isCompleted ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {isCompleted ? <LucideIcons.Check size={20} /> : lesson.id}
              </div>
              <div className="flex-1 text-left">
                <h4 className={`font-semibold ${isCompleted ? 'text-green-900' : 'text-gray-800'}`}>Lesson {lesson.id}</h4>
                <p className="text-xs text-gray-500">Tap to start learning</p>
              </div>
              {isCompleted && (
                <div className="text-right">
                  <div className="text-xs font-bold uppercase text-green-600">Completed</div>
                  {score && <div className="text-xs text-green-700">Score: {Math.round(score)}%</div>}
                </div>
              )}
              {!isCompleted && <LucideIcons.PlayCircle className="text-gray-300" />}
            </button>
           );
        })}
        <div className="p-4 text-center text-gray-400 text-sm border-t border-dashed border-gray-300 mt-4">
          + 90 more lessons available in Premium
        </div>
      </div>
    </div>
  );
};

const LessonContainer = ({ onComplete }: { onComplete: (id: string, score: number) => void }) => {
  const { subjectId, branchId, lessonNum } = useParams();
  const navigate = useNavigate();
  
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const branch = subject?.branches.find(b => b.id === branchId);

  if (!subject || !branch || !lessonNum) return <div>Error</div>;

  return (
    <LessonView 
      subjectId={subject.id} 
      branch={branch} 
      lessonNumber={parseInt(lessonNum)} 
      onComplete={(score) => onComplete(`${branchId}-L${lessonNum}`, score)}
      goBack={() => navigate(`/branch/${subjectId}/${branchId}`)}
    />
  );
};

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}