import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEnrollment } from '../../context/EnrollmentContext';
import { Course } from '../../types';
import {
  SAMPLE_COURSES,
  STUDENT_UPCOMING_DEADLINES,
  STUDENT_RECENT_ACTIVITIES
} from '../../data/mockData';
import {
  GraduationCap,
  Clock,
  Flame,
  Award,
  PlayCircle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Calendar,
  Sparkles,
  Zap,
  TrendingUp,
  FileQuestion
} from 'lucide-react';

interface StudentDashboardPageProps {
  navigate: (path: string) => void;
  onStartLearning: (course: Course) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  navigate,
  onStartLearning,
}) => {
  const { user } = useAuth();
  const { enrollments } = useEnrollment();

  const totalCompleted = enrollments.filter((e) => e.progressPercentage === 100).length;
  const inProgressCourses = enrollments.filter((e) => e.progressPercentage < 100);
  const activeCourse = inProgressCourses[0] || enrollments[0];

  // Recommendations: courses not yet enrolled in
  const enrolledIds = enrollments.map((e) => e.courseId);
  const recommendations = SAMPLE_COURSES.filter((c) => !enrolledIds.includes(c.id)).slice(0, 2);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {user?.name || 'Engineer'}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            You are currently on a <strong className="text-amber-600 dark:text-amber-400 font-mono tabular-nums">{user?.learningStreakDays || 14}-day streak</strong>. Keep progressing through your active specializations.
          </p>
        </div>
        <button
          onClick={() => navigate('/courses')}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          Explore More Programs
        </button>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Enrolled Courses</span>
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            {enrollments.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalCompleted} finished
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Learning Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            {user?.learningStreakDays || 14} days
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
            Active today
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Points</span>
            <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            {(user?.totalPoints || 2450).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Level 4 Architect
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Certificates</span>
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            {totalCompleted}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Verified credentials
          </div>
        </div>

      </div>

      {/* Continue Learning Spotlight Card */}
      {activeCourse && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
            <img
              src={activeCourse.course.thumbnail}
              alt={activeCourse.course.title}
              referrerPolicy="no-referrer"
              className="w-full sm:w-48 aspect-video rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
            />
            <div className="space-y-2 text-left w-full">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                Continue Where You Left Off
              </span>
              <h3 className="text-base font-bold leading-tight">
                {activeCourse.course.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                <span>Progress: {activeCourse.progressPercentage}%</span>
                <span aria-hidden="true">·</span>
                <span>Instructor: {activeCourse.course.instructor.name}</span>
              </div>
              <div className="w-full sm:w-64 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${activeCourse.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => onStartLearning(activeCourse.course)}
            className="w-full md:w-auto px-5 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Resume Lecture</span>
          </button>
        </div>
      )}

      {/* Split Section: Enrolled Courses & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Active Courses (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Enrolled Masterclasses</h2>
            <button
              onClick={() => navigate('/student/my-learning')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View all enrolled</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enrollments.map((enr) => (
              <div
                key={enr.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
              >
                <div className="flex items-start gap-3.5 mb-4">
                  <img
                    src={enr.course.thumbnail}
                    alt={enr.course.title}
                    referrerPolicy="no-referrer"
                    className="w-20 aspect-video rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                  />
                  <div className="truncate">
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 block">
                      {enr.course.category}
                    </span>
                    <h4 className="text-xs font-bold truncate">
                      {enr.course.title}
                    </h4>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-0.5">
                      {enr.completedLectureIds.length} / {enr.course.lecturesCount} done
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    <span>Progress</span>
                    <span className="font-bold text-slate-900 dark:text-white">{enr.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        enr.progressPercentage === 100 ? 'bg-emerald-600' : 'bg-indigo-600 dark:bg-indigo-500'
                      }`}
                      style={{ width: `${enr.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  {enr.progressPercentage === 100 ? (
                    <button
                      onClick={() => navigate('/student/certificates')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>View Credential</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onStartLearning(enr.course)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Continue Lecture</span>
                    </button>
                  )}

                  <button
                    onClick={() => navigate('/student/quizzes')}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <FileQuestion className="w-3.5 h-3.5" />
                    <span>Quiz</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Next Specializations */}
          <div className="pt-4">
            <h3 className="text-base font-bold mb-3">Recommended for Your Architecture Track</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => navigate(`/courses/${rec.slug}`)}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer flex items-center gap-4"
                >
                  <img
                    src={rec.thumbnail}
                    alt={rec.title}
                    referrerPolicy="no-referrer"
                    className="w-20 aspect-video rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                  />
                  <div className="truncate">
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold block">{rec.category}</span>
                    <h4 className="text-xs font-bold truncate">{rec.title}</h4>
                    <span className="text-xs font-mono tabular-nums font-bold text-slate-700 dark:text-slate-300">
                      ₹{rec.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Deadlines, Gamification Badges, Activities (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Upcoming Deadlines & Live Sessions */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Upcoming Deadlines
              </h3>
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="space-y-3">
              {STUDENT_UPCOMING_DEADLINES.map((dl) => (
                <div key={dl.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">{dl.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{dl.course}</div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">{dl.dueDate}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Gamification Badges */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Earned Badges
              </h3>
              <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="flex flex-wrap gap-2">
              {(user?.badges || ['Early Adopter', '14-Day Streak', 'Quiz Master']).map((badge) => (
                <span
                  key={badge}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Recent Activity
              </h3>
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="space-y-3">
              {STUDENT_RECENT_ACTIVITIES.map((act) => (
                <div key={act.id} className="text-xs space-y-0.5 border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0 last:pb-0">
                  <div className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{act.text}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{act.time}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{act.points}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
