import React from 'react';
import { Card, CardContent } from '../components/ui';
import { mockDeals, mockProperties, mockUsers } from '../data';
import { Deal, DealStage } from '../types';
import { Handshake, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

const getStageIcon = (stage: DealStage) => {
    switch (stage) {
        case DealStage.Negotiation: return <Handshake className="text-info" />;
        case DealStage.Offer: return <ChevronRight className="text-warning" />;
        case DealStage.Closed: return <CheckCircle className="text-success" />;
        case DealStage.Lost: return <XCircle className="text-danger" />;
    }
};

const getStageColor = (stage: DealStage) => {
    switch (stage) {
        case DealStage.Negotiation: return 'border-info';
        case DealStage.Offer: return 'border-warning';
        case DealStage.Closed: return 'border-success';
        case DealStage.Lost: return 'border-danger';
    }
};

const DealCard: React.FC<{ deal: Deal }> = ({ deal }) => {
    const property = mockProperties.find(p => p.id === deal.propertyId);
    const agent = mockUsers.find(u => u.id === deal.agentId);

    if (!property || !agent) return null;

    return (
        <Card className={`border-l-4 ${getStageColor(deal.stage)} mb-4`}>
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-on-surface">{property.title}</p>
                        <p className="text-sm text-gray-400">{property.location}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        {getStageIcon(deal.stage)}
                        <span>{deal.stage}</span>
                    </div>
                </div>
                <div className="mt-4 flex justify-between items-end">
                    <div>
                        <p className="text-sm text-gray-400">Value</p>
                        <p className="font-semibold text-lg text-primary">AED {deal.valueAED.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400">Agent</p>
                        <p className="font-medium text-on-surface">{agent.name}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const DealsPage: React.FC = () => {
    const stages = Object.values(DealStage);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-on-surface">Deals Pipeline</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stages.map(stage => (
                    <div key={stage} className="bg-surface p-4 rounded-xl">
                        <h2 className="font-bold text-lg mb-4 text-on-surface capitalize">{stage}</h2>
                        <div className="space-y-4">
                           {mockDeals.filter(d => d.stage === stage).map(deal => (
                                <DealCard key={deal.id} deal={deal} />
                           ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DealsPage;
