import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, Button, Modal, Input, Select } from '../components/ui';
import { mockCalls, mockUsers, mockLeads } from '../data';
import { Call, CallOutcome, Lead } from '../types';
import { Phone, PhoneOff, Mic, MicOff, Pause, PlusCircle, PhoneCall, User as UserIcon, Delete } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getOutcomeColor = (outcome: CallOutcome) => {
    switch (outcome) {
        case CallOutcome.Successful: return 'bg-success/20 text-success';
        case CallOutcome.Voicemail: return 'bg-info/20 text-info';
        case CallOutcome.Missed: return 'bg-warning/20 text-warning';
        case CallOutcome.NoAnswer: return 'bg-danger/20 text-danger';
        default: return 'bg-gray-500/20 text-gray-300';
    }
}

const AddCallForm: React.FC<{ 
    onClose: () => void; 
    onAdd: (call: Call) => void;
    initialData?: Partial<Call> 
}> = ({ onClose, onAdd, initialData }) => {
    const { user } = useAuth();
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const date = formData.get('date') as string;
        const time = formData.get('time') as string;

        const newCall: Call = {
            id: `call-${Date.now()}`,
            clientName: formData.get('clientName') as string,
            agentId: user!.id,
            dateTime: new Date(`${date}T${time}`).toISOString(),
            outcome: formData.get('outcome') as CallOutcome,
            notes: formData.get('notes') as string,
        };
        onAdd(newCall);
        onClose();
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Client Name</label>
                <Input name="clientName" required placeholder="Enter client's name" defaultValue={initialData?.clientName || ''}/>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                    <Input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]}/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Time</label>
                    <Input name="time" type="time" required defaultValue={new Date().toTimeString().substring(0,5)}/>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Outcome</label>
                <Select name="outcome" defaultValue={initialData?.outcome || CallOutcome.Successful}>
                   {Object.values(CallOutcome).map(o => <option key={o} value={o}>{o}</option>)}
                </Select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
                <textarea 
                    name="notes" 
                    rows={4}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-on-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Add call notes here..."
                    defaultValue={initialData?.notes || ''}
                ></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                <Button type="submit">Log Call</Button>
            </div>
        </form>
    )
}

const VoIPDialer: React.FC<{ onCallEnd: (clientName: string, duration: number) => void }> = ({ onCallEnd }) => {
    const [selectedClient, setSelectedClient] = useState<Lead | null>(null);
    const [dialedNumber, setDialedNumber] = useState('');
    const [callStatus, setCallStatus] = useState<'idle' | 'dialing' | 'connected'>('idle');
    const [callDuration, setCallDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isHeld, setIsHeld] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (callStatus === 'connected') {
            timerRef.current = window.setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [callStatus]);

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lead = mockLeads.find(l => l.id === e.target.value);
        if (lead) {
            setSelectedClient(lead);
            setDialedNumber(lead.phone);
        } else {
            setSelectedClient(null);
            setDialedNumber('');
        }
    };
    
    const handleKeypad = (key: string) => {
        if(callStatus === 'idle') setDialedNumber(prev => prev + key);
    }
    
    const handleBackspace = () => {
        if(callStatus === 'idle') setDialedNumber(prev => prev.slice(0,-1));
    }

    const handleCall = () => {
        if (!dialedNumber) return;
        setCallStatus('dialing');
        // Simulate connection
        setTimeout(() => setCallStatus('connected'), 2000);
    };

    const handleHangUp = () => {
        const clientName = selectedClient?.name || dialedNumber;
        onCallEnd(clientName, callDuration);
        setCallStatus('idle');
        setDialedNumber('');
        setSelectedClient(null);
        setCallDuration(0);
        setIsMuted(false);
        setIsHeld(false);
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const keypadKeys = ['1','2','3','4','5','6','7','8','9','*','0','#'];

    return (
        <Card>
            <CardHeader><h2 className="text-xl font-semibold">VoIP Dialer</h2></CardHeader>
            <CardContent className="space-y-4">
                <Select onChange={handleClientChange} value={selectedClient?.id || ''} disabled={callStatus !== 'idle'}>
                    <option value="">Select a lead to call...</option>
                    {mockLeads.map(lead => <option key={lead.id} value={lead.id}>{lead.name}</option>)}
                </Select>

                <div className="bg-background p-3 rounded-lg text-center">
                    <p className="text-2xl font-mono tracking-wider h-9">{dialedNumber}</p>
                    <p className={`text-sm h-5 ${callStatus === 'connected' ? 'text-success' : 'text-gray-400'}`}>
                        {callStatus === 'idle' && 'Ready to call'}
                        {callStatus === 'dialing' && 'Dialing...'}
                        {callStatus === 'connected' && `Connected: ${formatDuration(callDuration)}`}
                    </p>
                </div>
                
                { callStatus === 'connected' ? (
                     <div className="grid grid-cols-3 gap-2">
                        <Button variant="secondary" onClick={() => setIsMuted(!isMuted)} className="flex flex-col h-16">{isMuted ? <MicOff /> : <Mic />}<span className="text-xs">Mute</span></Button>
                        <Button variant="secondary" onClick={() => setIsHeld(!isHeld)} className="flex flex-col h-16">{isHeld ? <PhoneCall/> : <Pause />}<span className="text-xs">Hold</span></Button>
                        <Button variant="secondary" className="flex flex-col h-16"><PlusCircle /><span className="text-xs">Add</span></Button>
                     </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {keypadKeys.map(key => <Button variant="secondary" key={key} onClick={() => handleKeypad(key)} className="h-12 text-xl">{key}</Button>)}
                    </div>
                )}
               
                <div className="flex items-center justify-center gap-4">
                    {callStatus === 'idle' && dialedNumber && <Button onClick={handleBackspace} variant="secondary" className="w-16 h-16 rounded-full"><Delete /></Button>}
                    <Button 
                        onClick={callStatus === 'idle' ? handleCall : handleHangUp} 
                        className={`w-20 h-20 rounded-full text-white ${callStatus === 'idle' ? 'bg-success hover:bg-green-500' : 'bg-danger hover:bg-red-500'}`}
                        disabled={callStatus === 'idle' && !dialedNumber}
                    >
                       {callStatus === 'idle' ? <Phone size={32} /> : <PhoneOff size={32} />}
                    </Button>
                    {callStatus === 'idle' && dialedNumber && <div className="w-16"></div> }
                </div>

            </CardContent>
        </Card>
    );
};


const CallsPage: React.FC = () => {
    const [calls, setCalls] = useState<Call[]>(() => [...mockCalls].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialCallData, setInitialCallData] = useState<Partial<Call> | undefined>(undefined);

    const handleAddCall = (call: Call) => {
        setCalls(prev => [call, ...prev]);
        setInitialCallData(undefined);
    };
    
    const handleCallEnd = (clientName: string, duration: number) => {
        setInitialCallData({
            clientName,
            outcome: duration > 5 ? CallOutcome.Successful : CallOutcome.NoAnswer,
            notes: `Call duration: ${Math.floor(duration / 60)}m ${duration % 60}s.`
        });
        setIsModalOpen(true);
    };

    const handleManualLogOpen = () => {
        setInitialCallData(undefined); // Clear any previous data
        setIsModalOpen(true);
    }

    return (
        <div className="space-y-6">
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log a New Call">
                <AddCallForm 
                    onClose={() => setIsModalOpen(false)} 
                    onAdd={handleAddCall} 
                    initialData={initialCallData} 
                />
            </Modal>

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-on-surface">Calls</h1>
                <Button onClick={handleManualLogOpen} variant="secondary">
                    <PlusCircle size={18} className="mr-2"/>
                    Log Manual Call
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <VoIPDialer onCallEnd={handleCallEnd} />
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Call History</h2>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto max-h-[calc(100vh-20rem)] overflow-y-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border sticky top-0 bg-surface">
                                            <th className="p-4">Client</th>
                                            <th className="p-4">Date & Time</th>
                                            <th className="p-4">Agent</th>
                                            <th className="p-4">Outcome</th>
                                            <th className="p-4">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {calls.map(call => {
                                            const agent = mockUsers.find(u => u.id === call.agentId);
                                            return (
                                            <tr key={call.id} className="border-b border-border hover:bg-white/5">
                                                <td className="p-4 font-medium">{call.clientName}</td>
                                                <td className="p-4 text-sm text-gray-400">{new Date(call.dateTime).toLocaleString()}</td>
                                                <td className="p-4">{agent?.name || 'N/A'}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOutcomeColor(call.outcome)}`}>
                                                        {call.outcome}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm max-w-sm">{call.notes}</td>
                                            </tr>
                                        )})}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CallsPage;
