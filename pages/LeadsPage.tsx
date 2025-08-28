import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Button, Modal, Input, Select } from '../components/ui';
import { mockLeads, mockUsers } from '../data';
import { Lead, LeadStatus, UserRole } from '../types';
import { PlusCircle } from 'lucide-react';

const getStatusColor = (status: LeadStatus) => {
    switch (status) {
        case LeadStatus.New: return 'bg-info/20 text-info';
        case LeadStatus.Contacted: return 'bg-warning/20 text-warning';
        case LeadStatus.Qualified: return 'bg-success/20 text-success';
        case LeadStatus.Lost: return 'bg-danger/20 text-danger';
        default: return 'bg-gray-500/20 text-gray-300';
    }
}

const AddLeadForm: React.FC<{ onClose: () => void; onAdd: (lead: Lead) => void }> = ({ onClose, onAdd }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newLead: Lead = {
            id: `lead-${Date.now()}`,
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            source: formData.get('source') as string,
            status: formData.get('status') as LeadStatus,
            agentId: formData.get('agentId') as string,
            createdAt: new Date().toISOString(),
        };
        onAdd(newLead);
        onClose();
    }
    
    const agents = mockUsers.filter(u => u.role === UserRole.Agent);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <Input name="name" required placeholder="Enter lead's name"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <Input name="email" type="email" required placeholder="Enter lead's email"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                <Input name="phone" required placeholder="Enter lead's phone"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Lead Source</label>
                    <Input name="source" required placeholder="e.g., Website"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                    <Select name="status" defaultValue={LeadStatus.New}>
                       {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Assign Agent</label>
                <Select name="agentId" required>
                    <option value="">Select an agent</option>
                    {agents.map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
                </Select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                <Button type="submit">Add Lead</Button>
            </div>
        </form>
    )
}

const LeadsPage: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>(mockLeads);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddLead = (lead: Lead) => {
        setLeads(prev => [lead, ...prev]);
    }

    return (
        <div className="space-y-6">
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Lead">
                <AddLeadForm onClose={() => setIsModalOpen(false)} onAdd={handleAddLead} />
            </Modal>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-on-surface">Leads Management</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <PlusCircle size={18} className="mr-2"/>
                    Add Lead
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold">All Leads</h2>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Contact</th>
                                    <th className="p-4">Source</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Assigned Agent</th>
                                    <th className="p-4">Date Added</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map(lead => {
                                    const agent = mockUsers.find(u => u.id === lead.agentId);
                                    return (
                                    <tr key={lead.id} className="border-b border-border hover:bg-white/5">
                                        <td className="p-4 font-medium">{lead.name}</td>
                                        <td className="p-4">
                                            <p className="text-sm">{lead.email}</p>
                                            <p className="text-xs text-gray-400">{lead.phone}</p>
                                        </td>
                                        <td className="p-4">{lead.source}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="p-4">{agent?.name || 'N/A'}</td>
                                        <td className="p-4 text-sm text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LeadsPage;