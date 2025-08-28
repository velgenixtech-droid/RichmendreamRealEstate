import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, Button } from '../components/ui';
import { mockProperties, mockDeals, mockLeads, mockUsers } from '../data';
import { PropertyStatus, DealStage, LeadStatus, UserRole } from '../types';
import { Download } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <Card className="text-center">
        <CardContent className="p-4">
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-on-surface">{value}</p>
        </CardContent>
    </Card>
);

const ReportsPage: React.FC = () => {
    const reportData = useMemo(() => {
        const totalCommission = mockDeals
            .filter(d => d.stage === DealStage.Closed)
            .reduce((sum, deal) => sum + (deal.valueAED * deal.commissionRate), 0);

        const propertyStatusCounts = mockProperties.reduce((acc, prop) => {
            acc[prop.status] = (acc[prop.status] || 0) + 1;
            return acc;
        }, {} as Record<PropertyStatus, number>);
        
        const dealStageCounts = mockDeals.reduce((acc, deal) => {
            acc[deal.stage] = (acc[deal.stage] || 0) + 1;
            return acc;
        }, {} as Record<DealStage, number>);

        const leadStatusCounts = mockLeads.reduce((acc, lead) => {
            acc[lead.status] = (acc[lead.status] || 0) + 1;
            return acc;
        }, {} as Record<LeadStatus, number>);

        const leadConversionRate = ((dealStageCounts.Closed || 0) / mockLeads.length) * 100;

        const agentPerformance = mockUsers
            .filter(u => u.role === UserRole.Agent)
            .map(agent => {
                const closedDeals = mockDeals.filter(d => d.agentId === agent.id && d.stage === DealStage.Closed);
                const salesVolume = closedDeals.reduce((sum, deal) => sum + deal.valueAED, 0);
                const commission = closedDeals.reduce((sum, deal) => sum + (deal.valueAED * deal.commissionRate), 0);
                return {
                    name: agent.name,
                    dealsClosed: closedDeals.length,
                    salesVolume,
                    commission,
                };
            })
            .sort((a, b) => b.commission - a.commission);

        return {
            totalCommission,
            propertyStatusCounts,
            dealStageCounts,
            leadStatusCounts,
            leadConversionRate,
            agentPerformance,
        };
    }, []);

    const handleDownloadCsv = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Helper to format numbers
        const formatNum = (num: number) => num.toLocaleString('en-US');

        // General Stats
        csvContent += "Rich Men Dream CRM - Full Report\n";
        csvContent += `Generated on,${new Date().toLocaleString()}\n\n`;

        csvContent += "Key Metrics\n";
        csvContent += "Metric,Value\n";
        csvContent += `Total Properties,${mockProperties.length}\n`;
        csvContent += `Total Deals,${mockDeals.length}\n`;
        csvContent += `Total Leads,${mockLeads.length}\n`;
        csvContent += `Total Commission (AED),${formatNum(reportData.totalCommission)}\n\n`;

        // Property Status
        csvContent += "Property Status Breakdown\n";
        csvContent += "Status,Count\n";
        Object.entries(reportData.propertyStatusCounts).forEach(([status, count]) => {
            csvContent += `${status},${count}\n`;
        });
        csvContent += "\n";

        // Deal Stages
        csvContent += "Deals Pipeline\n";
        csvContent += "Stage,Count\n";
        Object.entries(reportData.dealStageCounts).forEach(([stage, count]) => {
            csvContent += `${stage},${count}\n`;
        });
        csvContent += "\n";
        
        // Lead Status
        csvContent += "Leads Funnel\n";
        csvContent += "Status,Count\n";
        Object.entries(reportData.leadStatusCounts).forEach(([status, count]) => {
            csvContent += `${status},${count}\n`;
        });
        csvContent += `Conversion Rate (%),${reportData.leadConversionRate.toFixed(2)}\n\n`;

        // Agent Performance
        csvContent += "Agent Performance\n";
        csvContent += "Agent Name,Deals Closed,Sales Volume (AED),Commission Earned (AED)\n";
        reportData.agentPerformance.forEach(agent => {
            csvContent += `${agent.name},${agent.dealsClosed},${formatNum(agent.salesVolume)},${formatNum(agent.commission)}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `rich_men_dream_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-on-surface">Reports</h1>
                <Button onClick={handleDownloadCsv}>
                    <Download size={18} className="mr-2" />
                    Download Report (CSV)
                </Button>
            </div>
            
            <Card>
                <CardHeader><h2 className="text-xl font-semibold">Key Metrics</h2></CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard title="Total Properties" value={mockProperties.length} />
                    <StatCard title="Total Deals" value={mockDeals.length} />
                    <StatCard title="Total Leads" value={mockLeads.length} />
                    <StatCard title="Total Commission" value={`AED ${reportData.totalCommission.toLocaleString('en-AE', { notation: 'compact' })}`} />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader><h2 className="text-xl font-semibold">Properties by Status</h2></CardHeader>
                    <CardContent className="space-y-2">
                        {Object.entries(reportData.propertyStatusCounts).map(([status, count]) => (
                             <div key={status} className="flex justify-between items-center text-sm">
                                <span>{status}</span>
                                <span className="font-bold bg-background px-2 py-0.5 rounded">{count}</span>
                             </div>
                        ))}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><h2 className="text-xl font-semibold">Deals Pipeline</h2></CardHeader>
                    <CardContent className="space-y-2">
                        {Object.entries(reportData.dealStageCounts).map(([stage, count]) => (
                             <div key={stage} className="flex justify-between items-center text-sm">
                                <span>{stage}</span>
                                <span className="font-bold bg-background px-2 py-0.5 rounded">{count}</span>
                             </div>
                        ))}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><h2 className="text-xl font-semibold">Leads Funnel</h2></CardHeader>
                    <CardContent className="space-y-2">
                        {Object.entries(reportData.leadStatusCounts).map(([status, count]) => (
                             <div key={status} className="flex justify-between items-center text-sm">
                                <span>{status}</span>
                                <span className="font-bold bg-background px-2 py-0.5 rounded">{count}</span>
                             </div>
                        ))}
                        <div className="pt-2 border-t border-border flex justify-between items-center font-semibold">
                            <span>Conversion Rate</span>
                            <span className="text-success">{reportData.leadConversionRate.toFixed(2)}%</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><h2 className="text-xl font-semibold">Agent Performance Summary</h2></CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="p-4">Agent</th>
                                    <th className="p-4 text-center">Deals Closed</th>
                                    <th className="p-4">Sales Volume (AED)</th>
                                    <th className="p-4">Commission Earned (AED)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.agentPerformance.map((agent) => (
                                    <tr key={agent.name} className="border-b border-border hover:bg-white/5 last:border-0">
                                        <td className="p-4 font-medium">{agent.name}</td>
                                        <td className="p-4 text-center font-semibold">{agent.dealsClosed}</td>
                                        <td className="p-4">{agent.salesVolume.toLocaleString()}</td>
                                        <td className="p-4 font-semibold text-success">{agent.commission.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default ReportsPage;
