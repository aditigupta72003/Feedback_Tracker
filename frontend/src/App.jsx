import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, CheckCircle, Users, BarChart3 } from 'lucide-react';
import { FeedbackForm } from './components/FeedbackForm';
import { FeedbackList } from './components/FeedbackList';
import { feedbackApi } from './services/api';

function App() {
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadFeedback = async () => {
    try {
      setError(null);
      console.log('Loading feedback...');
      const data = await feedbackApi.getAllFeedback();
      console.log('Feedback loaded:', data);
      setFeedback(data);
    } catch (err) {
      console.error('Error loading feedback:', err);
      setError(`Failed to load feedback: ${err.message}. Please make sure the server is running on http://localhost:3001`);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    console.log('App mounted! Calling loadFeedback...');
    loadFeedback();
  }, []);

  const handleSubmitFeedback = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const newFeedback = await feedbackApi.createFeedback(data);
      setFeedback(prev => [newFeedback, ...prev]);
      setSuccess('Thank you for your feedback! Your thoughts help us improve.');
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (id, action) => {
    try {
      setError(null);
      const updatedFeedback = await feedbackApi.voteFeedback(id, action);
      setFeedback(prev =>
        prev.map(item => item.id === id ? updatedFeedback : item)
      );
    } catch (err) {
      console.error('Error voting on feedback:', err);
      setError(err.message || 'Failed to vote. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await feedbackApi.deleteFeedback(id);
      setFeedback(prev => prev.filter(item => item.id !== id));
      setSuccess('Feedback deleted successfully.');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError(err.message || 'Failed to delete feedback. Please try again.');
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-600 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Loading Feedback System</h3>
          <p className="text-slate-600 dark:text-slate-400">Please wait while we prepare your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 backdrop-blur-sm bg-white/95 dark:bg-slate-800/95">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-xl shadow-sm">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Feedback System
                </h1>
                <p className="text-slate-600 dark:text-slate-400">Collect and manage user feedback efficiently</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">{feedback.length} Reviews</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {feedback.reduce((sum, item) => sum + item.votes, 0)} Votes
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">Error</h4>
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-800/30 rounded text-red-600 dark:text-red-400"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-emerald-800 dark:text-emerald-300 mb-1">Success</h4>
              <p className="text-emerald-700 dark:text-emerald-400 text-sm">{success}</p>
            </div>
            <button
              onClick={() => setSuccess(null)}
              className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-800/30 rounded text-emerald-600 dark:text-emerald-400"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Share Your Feedback</h2>
              <p className="text-slate-600 dark:text-slate-400">Help us improve by sharing your valuable thoughts and suggestions</p>
            </div>
            <FeedbackForm onSubmit={handleSubmitFeedback} isLoading={isLoading} />
          </div>

          {/* Feedback List */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Community Feedback</h2>
              <p className="text-slate-600 dark:text-slate-400">See what others are saying and engage with the community</p>
            </div>
            <FeedbackList
              feedback={feedback}
              onVote={handleVote}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;