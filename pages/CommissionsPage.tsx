import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Input } from '../components/ui';
import { mockDeals, mockUsers, mockProperties } from '../data';
import { DealStage, UserRole } from '../types';
import { Calculator } from 'lucide-react';

const CommissionCalculator: React.FC = () => {
    const [propertyValue, setPropertyValue] = useState('');
    const [commissionRate, setCommissionRate] = useState('2'); // Default to 2%
    const [calculatedCommission, setCalculatedCommission] = useState<number>(0);

    useEffect(() => {
        const val = parseFloat(propertyValue);
        const rate = parseFloat(commissionRate);
        if (!isNaN(val) && !isNaN(rate) && val > 0 && rate > 0) {
            setCalculatedCommission((val * rate) / 100);
        } else {
            setCalculatedCommission(0);
        }
    }, [propertyValue, commissionRate]);

    return (
        <Card>
            <CardHeader className="flex items-center gap-3">
                <Calculator className="text-primary"/>
                <h2 className="text-xl font-semibold">Commission Calculator</h2>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label htmlFor="propertyValue" className="block text-sm font-medium text-gray-400 mb-1">Property Value (AED)</label>
                        <Input 
                            id="propertyValue"
                            type="number" 
                            placeholder="e.g., 3500000" 
                            value={propertyValue}
                            onChange={(e) => setPropertyValue(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-400 mb-1">Commission Rate (%)</label>
                        <Input 
                            id="commissionRate"
                            type="number" 
                            placeholder="e.g., 2" 
                            value={commissionRate}
                            onChange={(e) => setCommissionRate(e.target.value)}
                        />
                    </div>
                    <div className="bg-background p-4 rounded-lg text-center md:col-span-1">
                        <p className="text-sm text-gray-400">Calculated Commission</p>
                        <p className="text-2xl font-bold text-success">
                            AED {calculatedCommission.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


const CommissionsPage: React.FC = () => {
    const commissionsByAgent = useMemo(() => {
        const agents = mockUsers.filter(u => u.role === UserRole.Agent);
        return agents.map(agent => {
            const closedDeals = mockDeals.filter(deal => deal.agentId === agent.id && deal.stage === DealStage.Closed);
            const totalCommission = closedDeals.reduce((sum, deal) => sum + (deal.valueAED * deal.commissionRate), 0);
            return {
                agent,
                deals: closedDeals,
                totalCommission,
            };
        }).sort((a,b) => b.totalCommission - a.totalCommission);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-on-surface">Commissions</h1>
            
            <CommissionCalculator />
            
            <div className="pt-4 border-t border-border">
              <h2 className="text-2xl font-bold text-on-surface">Agent Commission Reports</h2>
            </div>
            
            {commissionsByAgent.map(({ agent, deals, totalCommission }) => (
                <Card key={agent.id}>
                    <CardHeader className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <h2 className="text-xl font-semibold text-on-surface">{agent.name}</h2>
                                <p className="text-sm text-gray-400">{deals.length} Closed Deals</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Earned</p>
                            <p className="text-2xl font-bold text-success">AED {totalCommission.toLocaleString()}</p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="p-3">Property</th>
                                        <th className="p-3">Deal Value (AED)</th>
                                        <th className="p-3">Commission Rate</th>
                                        <th className="p-3">Commission Earned (AED)</th>
                                        <th className="p-3">Close Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deals.map(deal => {
                                        const property = mockProperties.find(p => p.id === deal.propertyId);
                                        const commission = deal.valueAED * deal.commissionRate;
                                        return (
                                            <tr key={deal.id} className="border-b border-border last:border-0 hover:bg-white/5">
                                                <td className="p-3 font-medium">{property?.title || 'N/A'}</td>
                                                <td className="p-3">{deal.valueAED.toLocaleString()}</td>
                                                <td className="p-3">{(deal.commissionRate * 100).toFixed(1)}%</td>
                                                <td className="p-3 font-semibold text-success">{commission.toLocaleString()}</td>
                                                <td className="p-3">{new Date(deal.closeDate).toLocaleDateString()}</td>
                                            </tr>
                                        );
                                    })}
                                    {deals.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center p-4 text-gray-500">No closed deals for this period.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CommissionsPage;