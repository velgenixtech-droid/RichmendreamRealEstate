import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui';
import { mockProperties } from '../data';
import { Property, PropertyStatus } from '../types';

const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
        case PropertyStatus.Available: return 'bg-success/20 text-success';
        case PropertyStatus.Sold: return 'bg-danger/20 text-danger';
        case PropertyStatus.Rented: return 'bg-info/20 text-info';
        default: return 'bg-gray-500/20 text-gray-300';
    }
}

const PropertiesPage: React.FC = () => {
    const [properties] = useState<Property[]>(mockProperties);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-on-surface">Properties</h1>
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold">All Properties</h2>
                    {/* Add filters here in a real app */}
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="p-4">Property</th>
                                    <th className="p-4">Location</th>
                                    <th className="p-4">Price (AED)</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map(prop => (
                                    <tr key={prop.id} className="border-b border-border hover:bg-white/5">
                                        <td className="p-4 flex items-center gap-4">
                                            <img src={prop.imageUrl} alt={prop.title} className="w-20 h-14 rounded-md object-cover"/>
                                            <div>
                                                <p className="font-semibold text-on-surface">{prop.title}</p>
                                                <p className="text-xs text-gray-400">{prop.bedrooms} Bed | {prop.bathrooms} Bath | {prop.areaSqFt} sqft</p>
                                            </div>
                                        </td>
                                        <td className="p-4">{prop.location}</td>
                                        <td className="p-4 font-semibold">{prop.priceAED.toLocaleString('en-AE')}</td>
                                        <td className="p-4">{prop.type}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(prop.status)}`}>
                                                {prop.status}
                                            </span>
                                        </td>
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

export default PropertiesPage;
