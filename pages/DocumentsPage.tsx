import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, Button, Modal, Select } from '../components/ui';
import { mockDocuments, mockUsers, mockProperties, mockDeals } from '../data';
import { Document } from '../types';
import { Upload, Download, Trash2, FileText, FileType, FileImage } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getFileIcon = (type: Document['type']) => {
    switch(type) {
        case 'PDF': return <FileText className="text-danger" />;
        case 'DOCX': return <FileType className="text-info" />;
        case 'JPG':
        case 'PNG': return <FileImage className="text-success" />;
        default: return <FileText className="text-gray-400" />;
    }
}

const UploadDocumentForm: React.FC<{ onClose: () => void; onUpload: (doc: Document) => void }> = ({ onClose, onUpload }) => {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [relatedTo, setRelatedTo] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const getDocType = (fileName: string): Document['type'] => {
        const ext = fileName.split('.').pop()?.toUpperCase();
        if (ext === 'PDF') return 'PDF';
        if (ext === 'DOCX') return 'DOCX';
        if (ext === 'JPG' || ext === 'JPEG') return 'JPG';
        if (ext === 'PNG') return 'PNG';
        return 'PDF'; // Default for unknown types
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !relatedTo || !user) {
            alert("Please select a file and link it to a property or deal.");
            return;
        }
        const newDoc: Document = {
            id: `doc-${Date.now()}`,
            name: file.name,
            type: getDocType(file.name),
            sizeKB: Math.round(file.size / 1024),
            uploadDate: new Date().toISOString(),
            uploadedById: user.id,
            relatedToId: relatedTo,
        };
        onUpload(newDoc);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">File</label>
                <div 
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="space-y-1 text-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm justify-center">
                          <p className="text-primary font-semibold">
                            {file ? `Selected: ${file.name}` : 'Click to select a file'}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG up to 10MB</p>
                    </div>
                </div>
                <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
            </div>
            
            <div>
                <label htmlFor="linkTo" className="block text-sm font-medium text-gray-400 mb-1">Link to</label>
                <Select id="linkTo" value={relatedTo} onChange={e => setRelatedTo(e.target.value)} required>
                    <option value="">Select a Property or Deal</option>
                    <optgroup label="Properties">
                        {mockProperties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </optgroup>
                    <optgroup label="Deals">
                        {mockDeals.map(d => {
                            const prop = mockProperties.find(p => p.id === d.propertyId);
                            return <option key={d.id} value={d.id}>Deal for {prop?.title || 'N/A'}</option>
                        })}
                    </optgroup>
                </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={!file || !relatedTo}>Upload Document</Button>
            </div>
        </form>
    );
}

const DocumentsPage: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>(mockDocuments);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDocumentUpload = (doc: Document) => {
        setDocuments(prev => [doc, ...prev]);
        setIsModalOpen(false);
    }

    return (
        <div className="space-y-6">
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload a New Document">
                <UploadDocumentForm onClose={() => setIsModalOpen(false)} onUpload={handleDocumentUpload} />
            </Modal>

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-on-surface">Document Center</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Upload size={18} className="mr-2"/>
                    Upload Document
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold">All Documents</h2>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Size</th>
                                    <th className="p-4">Uploaded By</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map(doc => {
                                    const user = mockUsers.find(u => u.id === doc.uploadedById);
                                    return (
                                        <tr key={doc.id} className="border-b border-border hover:bg-white/5">
                                            <td className="p-4 flex items-center gap-3">
                                                {getFileIcon(doc.type)}
                                                <span className="font-medium">{doc.name}</span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-400">{doc.sizeKB} KB</td>
                                            <td className="p-4">{user?.name || 'N/A'}</td>
                                            <td className="p-4 text-sm text-gray-400">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <button className="text-gray-400 hover:text-primary transition-colors"><Download size={18}/></button>
                                                    <button className="text-gray-400 hover:text-danger transition-colors"><Trash2 size={18}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DocumentsPage;