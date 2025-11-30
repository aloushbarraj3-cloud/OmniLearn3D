import React, { useState, useEffect } from 'react';
import { SubjectType, Branch, LessonContent, QuizQuestion, ProgressData } from '../types';
import { generateLessonContent, generateQuiz } from '../services/geminiService';
import Visualizer from './Visualizer';
import ReactMarkdown from 'react-markdown'; // Wait, standard libraries only. I'll use simple rendering or a basic parser.
import { ChevronRight, Play, CheckCircle, RotateCcw, Award } from 'lucide-react';

interface LessonViewProps {
  subjectId: SubjectType;
  branch: Branch;
  lessonNumber: number; // 1 to 100
  onComplete: (score: number) => void;
  goBack: () => void;
}

const LessonView: React.FC<LessonViewProps> = ({ subjectId, branch, lessonNumber, onComplete, goBack }) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'visualize' | 'quiz'>('learn');
  const [content, setContent] = useState<LessonContent | null>(null);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const lessonData = await generateLessonContent(subjectId, branch.name, lessonNumber);
        setContent(lessonData);
        
        // Prefetch quiz
        const quizData = await generateQuiz(subjectId, branch.name, lessonData.title);
        setQuiz(quizData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectId, branch, lessonNumber]);

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
  };

  const nextQuestion = () => {
    if (selectedOption === quiz[currentQuestion].correctAnswer) {
      setQuizScore(s => s + 1);
    }
    
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(curr => curr + 1);
      setSelectedOption(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    // Calculate final score adding the last question check
    let finalScore = quizScore;
    if (selectedOption === quiz[currentQuestion].correctAnswer) {
      finalScore += 1;
    }
    setQuizScore(finalScore);
    setQuizCompleted(true);
    onComplete((finalScore / quiz.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 animate-pulse">Generating your personalized lesson...</p>
      </div>
    );
  }

  if (!content) return <div>Error loading content.</div>;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-h-[600px]">
      {/* Header */}
      <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
        <div>
          <button onClick={goBack} className="text-indigo-200 hover:text-white text-sm mb-1 flex items-center">
             &larr; Back to {branch.name}
          </button>
          <h2 className="text-2xl font-bold">{content.title}</h2>
          <p className="text-indigo-200 text-sm">Lesson {lessonNumber} • {branch.name}</p>
        </div>
        <div className="flex space-x-1 bg-indigo-700/50 p-1 rounded-lg">
          {(['learn', 'visualize', 'quiz'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-indigo-200 hover:bg-indigo-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 md:p-8">
        {activeTab === 'learn' && (
          <div className="prose prose-lg max-w-none text-gray-700">
             <div className="whitespace-pre-wrap">{content.content}</div>
             
             <div className="mt-8 flex justify-end">
               <button 
                onClick={() => setActiveTab('visualize')}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-200"
               >
                 <span>View 3D Model</span>
                 <ChevronRight size={18} />
               </button>
             </div>
          </div>
        )}

        {activeTab === 'visualize' && (
          <div className="flex flex-col items-center space-y-6">
            <Visualizer subjectId={subjectId} prompt={content.visualPrompt} />
            <div className="max-w-2xl text-center text-gray-600">
              <p className="italic">"{content.visualPrompt}"</p>
              <p className="mt-4 text-sm bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-100">
                Interact with the visualization above to understand the spatial relationships in this topic.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('quiz')}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-colors shadow-lg shadow-emerald-200"
            >
              <span>Start Practice Quiz</span>
              <Play size={18} />
            </button>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="max-w-2xl mx-auto">
            {!quizCompleted ? (
              <>
                 <div className="mb-6 flex justify-between items-center text-sm text-gray-500">
                    <span>Question {currentQuestion + 1} of {quiz.length}</span>
                    <span>Progress: {Math.round(((currentQuestion) / quiz.length) * 100)}%</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                    <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentQuestion) / quiz.length) * 100}%` }}></div>
                 </div>

                 <h3 className="text-xl font-bold mb-6 text-gray-900">{quiz[currentQuestion].question}</h3>

                 <div className="space-y-3">
                   {quiz[currentQuestion].options.map((option, idx) => {
                     let btnClass = "w-full p-4 text-left rounded-xl border-2 transition-all ";
                     if (selectedOption === null) {
                        btnClass += "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50";
                     } else if (idx === quiz[currentQuestion].correctAnswer) {
                        btnClass += "border-green-500 bg-green-50 text-green-700";
                     } else if (idx === selectedOption) {
                        btnClass += "border-red-500 bg-red-50 text-red-700";
                     } else {
                        btnClass += "border-gray-100 opacity-50";
                     }

                     return (
                       <button
                         key={idx}
                         onClick={() => handleOptionSelect(idx)}
                         disabled={selectedOption !== null}
                         className={btnClass}
                       >
                         <div className="flex items-center">
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-bold ${selectedOption !== null && idx === quiz[currentQuestion].correctAnswer ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                                {String.fromCharCode(65 + idx)}
                            </span>
                            {option}
                         </div>
                       </button>
                     );
                   })}
                 </div>

                 {selectedOption !== null && (
                   <div className="mt-6 animate-in fade-in slide-in-from-bottom-4">
                     <div className={`p-4 rounded-lg mb-4 ${selectedOption === quiz[currentQuestion].correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        <p className="font-bold mb-1">{selectedOption === quiz[currentQuestion].correctAnswer ? 'Correct!' : 'Incorrect'}</p>
                        <p className="text-sm">{quiz[currentQuestion].explanation}</p>
                     </div>
                     <button 
                       onClick={nextQuestion}
                       className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700"
                     >
                       {currentQuestion < quiz.length - 1 ? 'Next Question' : 'See Results'}
                     </button>
                   </div>
                 )}
              </>
            ) : (
              <div className="text-center py-10">
                <div className="inline-block p-4 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <Award size={48} />
                </div>
                <h3 className="text-3xl font-bold mb-2">Quiz Complete!</h3>
                <p className="text-gray-500 mb-8">You scored</p>
                <div className="text-6xl font-black text-indigo-600 mb-8">
                  {Math.round((quizScore / quiz.length) * 100)}%
                </div>
                
                <div className="flex space-x-4 justify-center">
                  <button onClick={goBack} className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50">
                    Return to Branch
                  </button>
                  <button onClick={() => {
                    setQuizCompleted(false);
                    setCurrentQuestion(0);
                    setQuizScore(0);
                    setSelectedOption(null);
                  }} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center space-x-2">
                    <RotateCcw size={18} />
                    <span>Retry Quiz</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonView;