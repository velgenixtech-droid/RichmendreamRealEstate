import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui';
import { mockProperties, mockDeals, mockUsers, mockReminders } from '../data';
import { PropertyStatus, DealStage, AgentPerformance, MonthlySales, Property, PropertyType, UserRole, PropertyTypeDistribution, Reminder } from '../types';
import { DollarSign, Building2, Handshake, Users, Bell } from 'lucide-react';
import { MonthlySalesChart, AgentPerformanceChart, PropertyDistributionPieChart } from '../components/charts';
import { useAuth } from '../context/AuthContext';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; subtext?: string }> = ({ title, value, icon, subtext }) => (
    <Card>
        <CardContent className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-on-surface">{value}</p>
                {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
            </div>
            <div className="p-3 rounded-full bg-primary/20 text-primary">
                {icon}
            </div>
        </CardContent>
    </Card>
);

const RemindersWidget: React.FC = () => {
    const { user } = useAuth();
    const [reminders, setReminders] = useState<Reminder[]>(() => {
        if (!user) return [];
        if (user.role === UserRole.Admin) return mockReminders;
        return mockReminders.filter(r => r.agentId === user.id);
    });

    const toggleReminder = (id: string) => {
        setReminders(prev => prev.map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r));
    };

    const upcomingReminders = reminders.filter(r => !r.isCompleted).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return (
        <Card className="lg:col-span-2">
            <CardHeader className="flex items-center gap-3">
                <Bell className="text-primary"/>
                <h2 className="text-xl font-semibold">Upcoming Reminders</h2>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {upcomingReminders.length > 0 ? upcomingReminders.map(r => {
                        const isOverdue = new Date(r.dueDate) < new Date();
                        return (
                        <div key={r.id} className="flex items-center gap-3">
                            <input 
                                type="checkbox" 
                                checked={r.isCompleted} 
                                onChange={() => toggleReminder(r.id)} 
                                className="form-checkbox h-5 w-5 rounded bg-surface border-border text-primary focus:ring-primary"
                            />
                            <div>
                                <p className={`font-medium ${r.isCompleted ? 'line-through text-gray-500' : 'text-on-surface'}`}>{r.title}</p>
                                <p className={`text-xs ${isOverdue && !r.isCompleted ? 'text-danger font-semibold' : 'text-gray-400'}`}>
                                    Due: {new Date(r.dueDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    )}) : <p className="text-gray-400 text-sm">No upcoming reminders.</p>}
                </div>
            </CardContent>
        </Card>
    );
};

const DashboardPage: React.FC = () => {
    const kpis = useMemo(() => {
        const totalValue = mockProperties.reduce((sum, prop) => sum + prop.priceAED, 0);
        const activeDeals = mockDeals.filter(d => d.stage === DealStage.Negotiation || d.stage === DealStage.Offer).length;
        const closedDeals = mockDeals.filter(d => d.stage === DealStage.Closed).length;
        const totalCommissions = mockDeals
            .filter(d => d.stage === DealStage.Closed)
            .reduce((sum, deal) => sum + (deal.valueAED * deal.commissionRate), 0);

        return {
            totalProperties: mockProperties.length,
            totalValue,
            activeDeals,
            closedDeals,
            totalCommissions,
        };
    }, []);

    const monthlySalesData: MonthlySales[] = [
        { month: 'Jan', sales: 4000000 }, { month: 'Feb', sales: 3000000 },
        { month: 'Mar', sales: 5000000 }, { month: 'Apr', sales: 4500000 },
        { month: 'May', sales: 6000000 }, { month: 'Jun', sales: 12000000 },
        { month: 'Jul', sales: 8000000 },
    ];
    
    const agentPerformanceData: AgentPerformance[] = mockUsers
      .filter(u => u.role === UserRole.Agent)
      .map(agent => {
        const agentDeals = mockDeals.filter(d => d.agentId === agent.id && d.stage === DealStage.Closed);
        return {
          agentName: agent.name,
          dealsClosed: agentDeals.length,
          commission: agentDeals.reduce((sum, deal) => sum + (deal.valueAED * deal.commissionRate), 0),
        };
      });

    const propertyDistributionData: PropertyTypeDistribution[] = Object.values(PropertyType).map(type => ({
      name: type,
      value: mockProperties.filter(p => p.type === type).length
    }));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-on-surface">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Properties Value" value={`AED ${Intl.NumberFormat('en-AE', { notation: 'compact' }).format(kpis.totalValue)}`} icon={<DollarSign />} />
                <StatCard title="Properties on Market" value={String(kpis.totalProperties)} icon={<Building2 />} />
                <StatCard title="Active Deals" value={String(kpis.activeDeals)} icon={<Handshake />} />
                <StatCard title="Total Commissions" value={`AED ${Intl.NumberFormat('en-AE', { notation: 'compact' }).format(kpis.totalCommissions)}`} icon={<Users />} subtext="from closed deals" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader><h2 className="text-xl font-semibold">Monthly Sales Trend (AED)</h2></CardHeader>
                    <CardContent>
                        <MonthlySalesChart data={monthlySalesData} />
                    </CardContent>
                </Card>
                <RemindersWidget />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                 <Card className="lg:col-span-3">
                    <CardHeader><h2 className="text-xl font-semibold">Agent Performance</h2></CardHeader>
                    <CardContent>
                        <AgentPerformanceChart data={agentPerformanceData} />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader><h2 className="text-xl font-semibold">Property Type Distribution</h2></CardHeader>
                    <CardContent>
                        <PropertyDistributionPieChart data={propertyDistributionData} />
                    </CardContent>
                </Card>
            </div>

        </div>
    );
};

export default DashboardPage;