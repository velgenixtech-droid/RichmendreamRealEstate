import React, { useState, useMemo } from 'react';
import { mockEmails, mockLeads, mockUsers } from '../data';
import { Email, EmailFolder, Lead } from '../types';
import { Inbox, Send, Edit3, Trash2, Mail, Plus, Reply, CornerUpRight, Trash } from 'lucide-react';
import { Button, Modal, Input, Select } from '../components/ui';
import { useAuth } from '../context/AuthContext';

const ComposeEmailForm: React.FC<{
    onClose: () => void;
    onSend: (newEmail: Email) => void;
}> = ({ onClose, onSend }) => {
    const { user } = useAuth();
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const toLeadId = formData.get('to') as string;
        const toLead = mockLeads.find(l => l.id === toLeadId);

        if (!toLead || !user) {
            alert('Please select a valid recipient.');
            return;
        }

        const newEmail: Email = {
            id: `email-${Date.now()}`,
            from: user.name,
            to: toLead.name,
            subject: formData.get('subject') as string,
            body: formData.get('body') as string,
            date: new Date().toISOString(),
            isRead: true,
            folder: EmailFolder.Sent,
        };
        onSend(newEmail);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">To</label>
                <Select name="to" required>
                    <option value="">Select a lead...</option>
                    {mockLeads.map(lead => (
                        <option key={lead.id} value={lead.id}>{lead.name} ({lead.email})</option>
                    ))}
                </Select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                <Input name="subject" required placeholder="Email subject" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                <textarea 
                    name="body" 
                    rows={8}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-on-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Compose your email..."
                ></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                <Button type="submit">
                    <Send size={16} className="mr-2" /> Send
                </Button>
            </div>
        </form>
    );
};

const EmailsPage: React.FC = () => {
    const [emails, setEmails] = useState<Email[]>(mockEmails);
    const [activeFolder, setActiveFolder] = useState<EmailFolder>(EmailFolder.Inbox);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [isComposeOpen, setIsComposeOpen] = useState(false);

    const folderIcons = {
        [EmailFolder.Inbox]: Inbox,
        [EmailFolder.Sent]: Send,
        [EmailFolder.Drafts]: Edit3,
        [EmailFolder.Trash]: Trash2,
    };
    
    const folders = Object.values(EmailFolder);

    const filteredEmails = useMemo(() => {
        return emails
            .filter(e => e.folder === activeFolder)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [emails, activeFolder]);

    const handleSelectEmail = (email: Email) => {
        setSelectedEmail(email);
        if (!email.isRead) {
            setEmails(prev => prev.map(e => e.id === email.id ? { ...e, isRead: true } : e));
        }
    };
    
    const handleSendEmail = (newEmail: Email) => {
        setEmails(prev => [newEmail, ...prev]);
    };
    
    const handleDeleteEmail = () => {
        if (selectedEmail) {
            if (selectedEmail.folder === EmailFolder.Trash) {
                setEmails(prev => prev.filter(e => e.id !== selectedEmail.id));
            } else {
                setEmails(prev => prev.map(e => e.id === selectedEmail.id ? { ...e, folder: EmailFolder.Trash } : e));
            }
            setSelectedEmail(null);
        }
    };

    return (
        <div className="space-y-6">
            <Modal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} title="Compose New Email">
                <ComposeEmailForm onClose={() => setIsComposeOpen(false)} onSend={handleSendEmail} />
            </Modal>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-on-surface">Emails</h1>
                <Button onClick={() => setIsComposeOpen(true)}>
                    <Plus size={18} className="mr-2"/> Compose
                </Button>
            </div>

            <div className="flex h-[calc(100vh-160px)] bg-surface border border-border rounded-xl overflow-hidden">
                {/* Folders List */}
                <div className="w-1/5 border-r border-border p-4">
                    <h2 className="text-lg font-semibold mb-4 px-2">Folders</h2>
                    <nav className="space-y-1">
                        {folders.map(folder => {
                            const Icon = folderIcons[folder];
                            const isActive = activeFolder === folder;
                            const unreadCount = emails.filter(e => e.folder === folder && !e.isRead).length;
                            return (
                                <button 
                                    key={folder}
                                    onClick={() => { setActiveFolder(folder); setSelectedEmail(null); }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'hover:bg-gray-700/50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={18} />
                                        <span>{folder}</span>
                                    </div>
                                    {unreadCount > 0 && <span className="text-xs bg-primary text-on-primary font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Email List */}
                <div className="w-2/5 border-r border-border overflow-y-auto">
                    <div className="p-4 border-b border-border sticky top-0 bg-surface">
                        <h2 className="text-xl font-semibold capitalize">{activeFolder} ({filteredEmails.length})</h2>
                    </div>
                    <ul className="divide-y divide-border">
                        {filteredEmails.map(email => (
                            <li 
                                key={email.id} 
                                onClick={() => handleSelectEmail(email)}
                                className={`p-4 cursor-pointer hover:bg-gray-700/50 ${selectedEmail?.id === email.id ? 'bg-primary/10' : ''}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        {!email.isRead && <div className="w-2 h-2 rounded-full bg-info flex-shrink-0"></div>}
                                        <p className={`font-semibold truncate ${email.isRead ? 'text-on-surface/80' : 'text-on-surface'}`}>{email.from}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 flex-shrink-0">{new Date(email.date).toLocaleDateString()}</span>
                                </div>
                                <p className={`truncate text-sm ${email.isRead ? 'font-normal text-on-surface/80' : 'font-bold text-on-surface'}`}>{email.subject}</p>
                                <p className="text-xs text-gray-400 truncate">{email.body}</p>
                            </li>
                        ))}
                         {filteredEmails.length === 0 && <p className="p-4 text-center text-gray-500">No emails in this folder.</p>}
                    </ul>
                </div>
                
                {/* Email Content */}
                <div className="w-2/5 flex flex-col overflow-y-auto">
                    {selectedEmail ? (
                        <>
                            <div className="p-4 border-b border-border">
                                <h2 className="text-xl font-bold mb-2">{selectedEmail.subject}</h2>
                                <div className="flex items-center gap-3">
                                    {/* Placeholder for avatar */}
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-lg">
                                        {selectedEmail.from.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{selectedEmail.from}</p>
                                        <p className="text-xs text-gray-400">To: {selectedEmail.to}</p>
                                    </div>
                                    <span className="ml-auto text-xs text-gray-400">{new Date(selectedEmail.date).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="p-4 flex-grow whitespace-pre-wrap text-on-surface/90">
                                {selectedEmail.body}
                            </div>
                             <div className="p-4 border-t border-border flex items-center gap-2">
                                <Button variant="secondary"><Reply size={16} className="mr-2"/> Reply</Button>
                                <Button variant="secondary"><CornerUpRight size={16} className="mr-2"/> Forward</Button>
                                <Button variant="secondary" onClick={handleDeleteEmail} className="ml-auto text-danger hover:bg-danger/20 hover:text-danger">
                                    <Trash size={16}/>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                            <Mail size={48} />
                            <p className="mt-4 text-lg">Select an email to read</p>
                            <p className="text-sm">No message selected</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailsPage;