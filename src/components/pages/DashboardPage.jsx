import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';

import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import DashboardHeader from '@/components/organisms/DashboardHeader';
import DashboardStats from '@/components/organisms/DashboardStats';
import ChartContainer from '@/components/organisms/ChartContainer';
import TodaysTasksList from '@/components/organisms/TodaysTasksList';

import { dashboardService, taskService } from '@/services';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadDashboardData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleTaskToggle = async (taskId) => {
    try {
      await taskService.toggleComplete(taskId);
      await loadDashboardData(); // Reload data to reflect changes
      toast.success('Task updated successfully');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const getPriorityColor = useCallback((priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-red-50 border-red-200';
      case 'medium': return 'text-warning bg-amber-50 border-amber-200';
      case 'low': return 'text-success bg-green-50 border-green-200';
      default: return 'text-surface-600 bg-surface-100 border-surface-200';
    }
  }, []);

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
          <Button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-600 transition-colors"
          >
            Try Again
          </Button>
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
        <DashboardHeader onAddTask={() => navigate('/tasks')} />
        
        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer 
            title="Task Completion"
            chartOptions={completionChartOptions}
            series={chartData?.completionChart.series}
            type="donut"
            height={280}
            delay={0.3}
          />
          
          <TodaysTasksList 
            upcomingTasks={upcomingTasks} 
            onTaskToggle={handleTaskToggle} 
            getPriorityColor={getPriorityColor} 
          />
        </div>

        <ChartContainer 
          title="Tasks by Priority"
          chartOptions={priorityChartOptions}
          series={[{ data: chartData?.priorityChart.series || [] }]}
          type="bar"
          height={280}
          delay={0.5}
        />
      </motion.div>
    </div>
  );
};

export default DashboardPage;