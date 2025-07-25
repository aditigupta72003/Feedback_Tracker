import React from 'react';
import { MessageCircle, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { FeedbackItem } from './FeedbackItem';

export function FeedbackList({ feedback, onVote, onDelete, isLoading }) {
  if (feedback.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No feedback yet</h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Be the first to share your thoughts! Your feedback helps us create better experiences.
        </p>
      </div>
    );
  }

  const totalVotes = feedback.reduce((sum, item) => sum + item.votes, 0);
  const averageVotes = feedback.length > 0 ? (totalVotes / feedback.length).toFixed(1) : '0.0';
  const positiveVotes = feedback.filter(item => item.votes > 0).length;
  const engagementRate = feedback.length > 0 ? ((positiveVotes / feedback.length) * 100).toFixed(0) : '0';

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Feedback Overview</h2>
            <p className="text-slate-600 dark:text-slate-400">Summary of all feedback and ratings</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{feedback.length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Reviews</div>
          </div>
          
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalVotes}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Votes</div>
          </div>
          
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{averageVotes}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Avg. Rating</div>
          </div>
          
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{engagementRate}%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Positive Rate</div>
          </div>
        </div>
        
        {positiveVotes > 0 && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm text-emerald-700 dark:text-emerald-400 text-center">
              {positiveVotes} out of {feedback.length} reviews are positive - Great job!
            </p>
          </div>
        )}
      </div>

      {/* Feedback Items */}
      <div className="space-y-4">
        {feedback.map((item) => (
          <FeedbackItem
            key={item.id}
            feedback={item}
            onVote={onVote}
            onDelete={onDelete}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}