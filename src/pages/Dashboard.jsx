import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { dashboardService, taskService } from '../services';
import Chart from 'react-apexcharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsData, chartsData, todayTasks] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getChartData(),
          taskService.getDueToday()
        ]);
        setStats(statsData);
        setChartData(chartsData);
        setUpcomingTasks(todayTasks);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const handleTaskToggle = async (taskId) => {
    try {
      await taskService.toggleComplete(taskId);
      // Reload data to reflect changes
      const [statsData, todayTasks] = await Promise.all([
        dashboardService.getStats(),
        taskService.getDueToday()
      ]);
      setStats(statsData);
      setUpcomingTasks(todayTasks);
      toast.success('Task updated successfully');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-red-50 border-red-200';
      case 'medium': return 'text-warning bg-amber-50 border-amber-200';
      case 'low': return 'text-success bg-green-50 border-green-200';
      default: return 'text-surface-600 bg-surface-100 border-surface-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-card p-6 shadow-card">
                <div className="h-4 bg-surface-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-surface-200 rounded w-16"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-card p-6 shadow-card">
              <div className="h-6 bg-surface-200 rounded w-32 mb-4"></div>
              <div className="h-64 bg-surface-100 rounded"></div>
            </div>
            <div className="bg-white rounded-card p-6 shadow-card">
              <div className="h-6 bg-surface-200 rounded w-40 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-surface-100 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Failed to load dashboard</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const completionChartOptions = {
    chart: {
      type: 'donut',
      height: 280
    },
    colors: ['#10B981', '#F59E0B'],
    labels: chartData?.completionChart.labels || [],
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 240
        }
      }
    }]
  };

  const priorityChartOptions = {
    chart: {
      type: 'bar',
      height: 280
    },
    colors: ['#EF4444', '#F59E0B', '#10B981'],
    xaxis: {
      categories: chartData?.priorityChart.labels || []
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 240
        }
      }
    }]
  };

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-surface-900">Dashboard</h1>
            <p className="text-surface-600">Track your productivity and task completion</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-600 transition-colors flex items-center space-x-2 shadow-sm"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Add Task</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Tasks',
              value: stats?.totalTasks || 0,
              icon: 'CheckSquare',
              color: 'text-primary',
              bg: 'bg-primary/10'
            },
            {
              title: 'Completed',
              value: stats?.completedTasks || 0,
              icon: 'CheckCircle',
              color: 'text-success',
              bg: 'bg-green-50'
            },
            {
              title: 'Pending',
              value: stats?.pendingTasks || 0,
              icon: 'Clock',
              color: 'text-warning',
              bg: 'bg-amber-50'
            },
            {
              title: 'Overdue',
              value: stats?.overdueTasks || 0,
              icon: 'AlertTriangle',
              color: 'text-error',
              bg: 'bg-red-50'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
              className="bg-white rounded-card p-6 shadow-card cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-surface-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-card ${stat.bg}`}>
                  <ApperIcon name={stat.icon} size={24} className={stat.color} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts and Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completion Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-card p-6 shadow-card"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Task Completion</h3>
            {chartData?.completionChart && (
              <Chart
                options={completionChartOptions}
                series={chartData.completionChart.series}
                type="donut"
                height={280}
              />
            )}
          </motion.div>

          {/* Today's Tasks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-card p-6 shadow-card"
          >
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Due Today</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Calendar" size={32} className="text-surface-300 mx-auto mb-2" />
                  <p className="text-surface-500">No tasks due today</p>
                </div>
              ) : (
                upcomingTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-surface-50 rounded-button hover:bg-surface-100 transition-colors"
                  >
                    <button
                      onClick={() => handleTaskToggle(task.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-success border-success text-white'
                          : 'border-surface-300 hover:border-success'
                      }`}
                    >
                      {task.completed && (
                        <ApperIcon name="Check" size={12} className="animate-check" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium break-words ${
                        task.completed ? 'line-through text-surface-500' : 'text-surface-900'
                      }`}>
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-surface-500">
                          {new Date(task.deadline).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Priority Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-card p-6 shadow-card"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Tasks by Priority</h3>
          {chartData?.priorityChart && (
            <Chart
              options={priorityChartOptions}
              series={[{ data: chartData.priorityChart.series }]}
              type="bar"
              height={280}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;