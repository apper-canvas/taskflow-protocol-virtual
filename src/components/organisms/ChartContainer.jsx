import React from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';

const ChartContainer = ({ title, chartOptions, series, type, height, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay }}
      className="bg-white rounded-card p-6 shadow-card"
    >
      <h3 className="text-lg font-semibold text-surface-900 mb-4">{title}</h3>
      {series && (
        <Chart
          options={chartOptions}
          series={series}
          type={type}
          height={height}
        />
      )}
    </motion.div>
  );
};

export default ChartContainer;