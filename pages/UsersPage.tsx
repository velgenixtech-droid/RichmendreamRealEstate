import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui';
import { mockUsers } from '../data';
import { User, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const getRoleColor = (role: UserRole) => {
    switch (role) {
        case UserRole.Admin: return 'bg-primary/20 text-primary';
        case UserRole.Agent: return 'bg-info/20 text-info';
        case UserRole.Viewer: return 'bg-gray-500/20 text-gray-300';
    }
};

const UsersPage: React.FC = () => {
    const { user } = useAuth();

    if (user?.role !== UserRole.Admin) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <ShieldAlert className="w-16 h-16 text-danger mb-4" />
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-gray-400">You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-on-surface">User Management</h1>
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold">All Users</h2>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Last Login</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockUsers.map(u => (
                                    <tr key={u.id} className="border-b border-border hover:bg-white/5">
                                        <td className="p-4 flex items-center gap-3">
                                            <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full"/>
                                            <span className="font-medium">{u.name}</span>
                                        </td>
                                        <td className="p-4">{u.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(u.role)}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4">{new Date(u.lastLogin).toLocaleString()}</td>
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

export default UsersPage;
