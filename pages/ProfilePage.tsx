import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardContent, Input, Button } from '../components/ui';
import { User as UserIcon, LogOut, Lock, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const theme = localStorage.getItem('theme');
        if (theme) return theme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if(user) {
            updateUser({ name, email });
            alert('Profile updated successfully!');
        }
    };
    
    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New passwords don't match!");
            return;
        }
        if (!newPassword || !currentPassword) {
            alert("Please fill all password fields.");
            return;
        }
        alert('Password updated successfully! (This is a mock action)');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    if (!user) return null;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-on-surface">Profile & Settings</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <UserIcon size={22} className="text-primary" /> Profile Information
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                             <div className="flex items-center gap-4">
                                <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover"/>
                                <div>
                                    <h3 className="text-2xl font-bold">{user.name}</h3>
                                    <p className="text-gray-400">{user.role}</p>
                                </div>
                             </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                <Input value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="pt-2">
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                     <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Sun size={22} className="text-primary" /> Display Settings
                            </h2>
                        </CardHeader>
                        <CardContent>
                             <div className="flex justify-between items-center">
                                <span className="font-medium">Theme</span>
                                <button onClick={toggleTheme} className="p-2 rounded-full bg-background hover:bg-gray-700/50">
                                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                                </button>
                             </div>
                             <p className="text-xs text-gray-500 mt-1">Switch between light and dark mode.</p>
                        </CardContent>
                    </Card>
                    <Button onClick={handleLogout} variant="secondary" className="w-full bg-danger/10 border-danger/20 text-danger hover:bg-danger/20">
                        <LogOut size={18} className="mr-2"/>
                        Logout
                    </Button>
                </div>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Lock size={22} className="text-primary" /> Change Password
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                                <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                            </div>
                             <div className="pt-2">
                                <Button type="submit">Update Password</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProfilePage;
