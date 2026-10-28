import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SAMPLE_COURSES, INSTRUCTOR_MONTHLY_ANALYTICS } from '../../data/mockData';
import {
  Users,
  DollarSign,
  Star,
  BookOpen,
  PlusCircle,
  TrendingUp,
  ArrowRight,
  Clock,
  BarChart2,
  Calendar
} from 'lucide-react';

interface InstructorDashboardPageProps {
  navigate: (path: string) => void;
}

export const InstructorDashboardPage: React.FC<InstructorDashboardPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const myCourses = SAMPLE_COURSES.filter((c) => c.instructorId === 'inst_01');
  const [activeMetric, setActiveMetric] = useState<'earnings' | 'students'>('earnings');
  const [hoveredPoint, setHoveredPoint] = useState<{ month: string; value: number } | null>(null);

  // Calculate SVG points for interactive chart
  const data = INSTRUCTOR_MONTHLY_ANALYTICS;
  const maxVal = Math.max(...data.map((d) => (activeMetric === 'earnings' ? d.earnings : d.students)));
  const svgWidth = 600;
  const svgHeight = 160;

  const points = data.map((d, idx) => {
    const x = (idx / (data.length - 1)) * (svgWidth - 60) + 30;
    const val = activeMetric === 'earnings' ? d.earnings : d.students;
    const y = svgHeight - (val / maxVal) * (svgHeight - 40) - 20;
    return { x, y, month: d.month, val };
  });

  const pathD = points.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Instructor Performance Dashboard
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Welcome, {user?.name || 'Dr. Sarah Chen'}. Your curriculum has reached over <strong className="text-slate-900 dark:text-white font-mono tabular-nums">38,420 engineers</strong> globally.
          </p>
        </div>
        <button
          onClick={() => navigate('/instructor/courses/new')}
          className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Launch New Course</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Enrolled Students</span>
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            38,420
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% this quarter</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Gross Royalties Earned</span>
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            ₹1,34,42,000
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            ₹8,45,000 available for payout
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Instructor Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            4.95
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Based on 1,420 reviews
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Curriculum</span>
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums">
            {myCourses.length}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            100% SLA adherence
          </div>
        </div>

      </div>

      {/* Interactive Telemetry Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold">Revenue & Enrollment Growth Trajectory</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monthly breakdown for {new Date().getFullYear()} fiscal cycle
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveMetric('earnings')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeMetric === 'earnings'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Royalties (₹)
            </button>
            <button
              onClick={() => setActiveMetric('students')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeMetric === 'students'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Students Enrolled
            </button>
          </div>
        </div>

        {/* SVG Graphic with Gradient Fill */}
        <div className="relative pt-2">
          {hoveredPoint && (
            <div className="absolute top-2 right-4 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-mono shadow-lg border border-slate-700">
              {hoveredPoint.month}: <strong className="text-indigo-400 font-bold">{activeMetric === 'earnings' ? `₹${hoveredPoint.value.toLocaleString('en-IN')}` : `${hoveredPoint.value.toLocaleString()} learners`}</strong>
            </div>
          )}

          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 overflow-visible">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0.25, 0.5, 0.75].map((ratio) => (
              <line
                key={ratio}
                x1="30"
                y1={svgHeight * ratio}
                x2={svgWidth - 30}
                y2={svgHeight * ratio}
                stroke="currentColor"
                className="text-slate-100 dark:text-slate-800/80"
                strokeDasharray="4 4"
              />
            ))}

            {/* Area */}
            <path d={areaD} fill="url(#chartGradient)" />

            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#4F46E5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Circles */}
            {points.map((p, idx) => (
              <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredPoint({ month: p.month, value: p.val })}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4.5"
                  className="fill-indigo-600 stroke-white dark:stroke-slate-900 stroke-2 hover:r-6 transition-all"
                />
                <text
                  x={p.x}
                  y={svgHeight - 2}
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-slate-400"
                >
                  {p.month}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Courses Managed Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold">Your Masterclasses</h2>
          <button
            onClick={() => navigate('/instructor/courses')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Manage Curriculum
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {myCourses.map((course) => (
            <div
              key={course.id}
              className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  referrerPolicy="no-referrer"
                  className="w-24 aspect-video rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                />
                <div>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block">
                    {course.category}
                  </span>
                  <h3 className="text-sm font-bold">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums mt-1">
                    <span>{course.enrolledCount.toLocaleString()} students</span>
                    <span aria-hidden="true">·</span>
                    <span>₹{course.price.toLocaleString('en-IN')} price</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">Published</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => navigate('/instructor/courses/new')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Edit Curriculum
                </button>
                <button
                  onClick={() => navigate('/instructor/students')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg transition-colors"
                >
                  View Students
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
