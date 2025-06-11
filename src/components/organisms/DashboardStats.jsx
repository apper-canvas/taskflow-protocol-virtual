import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const DashboardStats = ({ stats }) => {
  const statData = [
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
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statData.map((stat, index) => (
        <StatCard key={stat.title} stat={stat} index={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;