export enum UserRole {
  Admin = 'Admin',
  Agent = 'Agent',
  Viewer = 'Viewer',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLogin: string;
  avatar: string;
}

export enum PropertyType {
    Apartment = 'Apartment',
    Villa = 'Villa',
    Commercial = 'Commercial',
    Land = 'Land',
}

export enum PropertyStatus {
    Available = 'Available',
    Sold = 'Sold',
    Rented = 'Rented',
}

export interface Property {
    id: string;
    title: string;
    location: string;
    priceAED: number;
    type: PropertyType;
    status: PropertyStatus;
    agentId: string;
    imageUrl: string;
    bedrooms: number;
    bathrooms: number;
    areaSqFt: number;
}

export enum DealStage {
    Negotiation = 'Negotiation',
    Offer = 'Offer',
    Closed = 'Closed',
    Lost = 'Lost',
}

export interface Deal {
    id: string;
    propertyId: string;
    agentId: string;
    clientId: string; 
    stage: DealStage;
    valueAED: number;
    commissionRate: number; // e.g., 0.02 for 2%
    closeDate: string;
}

export enum LeadStatus {
    New = 'New',
    Contacted = 'Contacted',
    Qualified = 'Qualified',
    Lost = 'Lost',
}

export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    source: string;
    status: LeadStatus;
    agentId: string;
    createdAt: string;
}

export interface Document {
    id: string;
    name: string;
    type: 'PDF' | 'DOCX' | 'JPG' | 'PNG';
    sizeKB: number;
    uploadDate: string;
    uploadedById: string;
    relatedToId: string; // Property or Deal ID
}

export interface Reminder {
    id: string;
    title: string;
    dueDate: string;
    relatedTo: string; // e.g., 'Lead: John Doe'
    isCompleted: boolean;
    agentId: string;
}

export enum CallOutcome {
    Successful = 'Successful',
    Missed = 'Missed',
    Voicemail = 'Voicemail',
    NoAnswer = 'No Answer',
}

export interface Call {
    id: string;
    clientName: string;
    agentId: string;
    dateTime: string;
    outcome: CallOutcome;
    notes: string;
}

export enum EmailFolder {
    Inbox = 'Inbox',
    Sent = 'Sent',
    Drafts = 'Drafts',
    Trash = 'Trash',
}

export interface Email {
    id: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    date: string; // ISO string
    isRead: boolean;
    folder: EmailFolder;
}


// Data for charts
export interface MonthlySales {
    month: string;
    sales: number;
}

export interface AgentPerformance {
    agentName: string;
    dealsClosed: number;
    commission: number;
}

export interface PropertyTypeDistribution {
    name: string;
    value: number;
}