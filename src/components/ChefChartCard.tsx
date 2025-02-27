import { Bar } from 'react-chartjs-2';
import { Chef } from '@/utils/types';
import { ROLES } from '@/utils/constants';

interface ChefChartCardProps {
  chef: Chef;
  counts: Record<string, number>;
}

export default function ChefChartCard({ chef, counts }: ChefChartCardProps) {
  const chartData = {
    labels: ROLES.map(role => role.label),
    datasets: [
      {
        label: 'Votes',
        data: ROLES.map(role => counts[role.id] || 0),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="card">
      <h3 className="text-lg font-medium mb-4">{chef.name}</h3>
      <div className="h-64">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}