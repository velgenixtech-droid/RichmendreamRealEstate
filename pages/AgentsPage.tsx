import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, Button, Modal, Input } from '../components/ui';
import { mockUsers, mockDeals } from '../data';
import { UserRole, DealStage, User } from '../types';
import { Award, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AgentStats {
    id: string;
    name: string;
    avatar: string;
    dealsClosed: number;
    salesVolume: number;
    commission: number;
}

const AddAgentForm: React.FC<{ onClose: () => void; onAdd: (agent: User) => void }> = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;

        const newAgent: User = {
            id: `user-${Date.now()}`,
            name,
            email,
            role: UserRole.Agent,
            lastLogin: new Date().toISOString(),
            avatar: `https://picsum.photos/seed/user${Date.now()}/100/100`,
        };

        onAdd(newAgent);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter agent's name" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter agent's email" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                <Button type="submit">Add Agent</Button>
            </div>
        </form>
    );
};


const AgentsPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();

    const leaderboardData = useMemo<AgentStats[]>(() => {
        const agents = users.filter(u => u.role === UserRole.Agent);
        const stats = agents.map(agent => {
            const closedDeals = mockDeals.filter(d => d.agentId === agent.id && d.stage === DealStage.Closed);
            const salesVolume = closedDeals.reduce((sum, deal) => sum + deal.valueAED, 0);
            const commission = closedDeals.reduce((sum, deal) => sum + (deal.valueAED * deal.commissionRate), 0);
            return {
                id: agent.id,
                name: agent.name,
                avatar: agent.avatar,
                dealsClosed: closedDeals.length,
                salesVolume,
                commission,
            };
        });
        return stats.sort((a, b) => b.commission - a.commission);
    }, [users]);

    const handleAddAgent = (agent: User) => {
        setUsers(prevUsers => [...prevUsers, agent]);
    };

    const getRankColor = (rank: number) => {
        if (rank === 0) return 'text-primary'; // Gold
        if (rank === 1) return 'text-gray-400'; // Silver
        if (rank === 2) return 'text-yellow-700'; // Bronze
        return 'text-gray-500';
    }

    return (
        <div className="space-y-6">
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Agent">
                <AddAgentForm onClose={() => setIsModalOpen(false)} onAdd={handleAddAgent} />
            </Modal>

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-on-surface">Agents Leaderboard</h1>
                {user?.role === UserRole.Admin && (
                    <Button onClick={() => setIsModalOpen(true)}>
                        <PlusCircle size={18} className="mr-2"/>
                        Add Agent
                    </Button>
                )}
            </div>
            
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold">Top Performing Agents</h2>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="p-4 text-center">Rank</th>
                                    <th className="p-4">Agent</th>
                                    <th className="p-4 text-center">Deals Closed</th>
                                    <th className="p-4">Sales Volume (AED)</th>
                                    <th className="p-4">Commission Earned (AED)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboardData.map((agent, index) => (
                                    <tr key={agent.id} className="border-b border-border hover:bg-white/5">
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {index < 3 && <Award size={20} className={getRankColor(index)}/>}
                                                <span className="font-bold text-lg">{index + 1}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 flex items-center gap-3">
                                            <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full" />
                                            <span className="font-medium">{agent.name}</span>
                                        </td>
                                        <td className="p-4 text-center font-semibold text-lg">{agent.dealsClosed}</td>
                                        <td className="p-4">{agent.salesVolume.toLocaleString()}</td>
                                        <td className="p-4 font-bold text-lg text-success">{agent.commission.toLocaleString()}</td>
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

export default AgentsPage;