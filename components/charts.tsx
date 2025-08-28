import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { AgentPerformance, MonthlySales, PropertyTypeDistribution } from '../types';

const CHART_TEXT_COLOR = "#a0a0a0";

interface MonthlySalesChartProps {
  data: MonthlySales[];
}
export const MonthlySalesChart: React.FC<MonthlySalesChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
      <XAxis dataKey="month" stroke={CHART_TEXT_COLOR} />
      <YAxis stroke={CHART_TEXT_COLOR} tickFormatter={(value) => `${Number(value) / 1000000}M`} />
      <Tooltip contentStyle={{ backgroundColor: '#1c1c1c', border: '1px solid #333' }} />
      <Legend />
      <Line type="monotone" dataKey="sales" name="Sales (AED)" stroke="#D4AF37" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }}/>
    </LineChart>
  </ResponsiveContainer>
);

interface AgentPerformanceChartProps {
  data: AgentPerformance[];
}
export const AgentPerformanceChart: React.FC<AgentPerformanceChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
      <XAxis dataKey="agentName" stroke={CHART_TEXT_COLOR} />
      <YAxis yAxisId="left" orientation="left" stroke={CHART_TEXT_COLOR} />
      <YAxis yAxisId="right" orientation="right" stroke={CHART_TEXT_COLOR} tickFormatter={(value) => `${Number(value) / 1000}k`} />
      <Tooltip contentStyle={{ backgroundColor: '#1c1c1c', border: '1px solid #333' }} />
      <Legend />
      <Bar yAxisId="left" dataKey="dealsClosed" name="Deals Closed" fill="#D4AF37" />
      <Bar yAxisId="right" dataKey="commission" name="Commission (AED)" fill="#82ca9d" />
    </BarChart>
  </ResponsiveContainer>
);

interface PropertyDistributionPieChartProps {
  data: PropertyTypeDistribution[];
}
const COLORS = ['#D4AF37', '#E5C100', '#8884d8', '#82ca9d'];
export const PropertyDistributionPieChart: React.FC<PropertyDistributionPieChartProps> = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1c1c1c', border: '1px solid #333' }}/>
            <Legend />
        </PieChart>
    </ResponsiveContainer>
);
