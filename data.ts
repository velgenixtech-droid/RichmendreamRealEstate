import { User, UserRole, Property, PropertyType, PropertyStatus, Deal, DealStage, Lead, LeadStatus, Document, Reminder, Call, CallOutcome, Email, EmailFolder } from './types';

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Admin Ali', email: 'admin@dream.ae', role: UserRole.Admin, lastLogin: '2024-07-28T10:00:00Z', avatar: 'https://picsum.photos/seed/user1/100/100' },
  { id: 'user-2', name: 'Agent Ahmed', email: 'ahmed@dream.ae', role: UserRole.Agent, lastLogin: '2024-07-28T12:30:00Z', avatar: 'https://picsum.photos/seed/user2/100/100' },
  { id: 'user-3', name: 'Agent Fatima', email: 'fatima@dream.ae', role: UserRole.Agent, lastLogin: '2024-07-27T18:45:00Z', avatar: 'https://picsum.photos/seed/user3/100/100' },
  { id: 'user-4', name: 'Client Omar', email: 'omar@client.com', role: UserRole.Viewer, lastLogin: '2024-07-26T09:15:00Z', avatar: 'https://picsum.photos/seed/user4/100/100' },
];

export const mockProperties: Property[] = [
  { id: 'prop-1', title: 'Luxury Marina Apartment', location: 'Dubai Marina', priceAED: 3500000, type: PropertyType.Apartment, status: PropertyStatus.Available, agentId: 'user-2', imageUrl: 'https://picsum.photos/seed/prop1/400/300', bedrooms: 2, bathrooms: 3, areaSqFt: 1500 },
  { id: 'prop-2', title: 'Spacious Downtown Villa', location: 'Downtown Dubai', priceAED: 12000000, type: PropertyType.Villa, status: PropertyStatus.Sold, agentId: 'user-3', imageUrl: 'https://picsum.photos/seed/prop2/400/300', bedrooms: 5, bathrooms: 6, areaSqFt: 6000 },
  { id: 'prop-3', title: 'Modern JLT Office Space', location: 'JLT', priceAED: 2000000, type: PropertyType.Commercial, status: PropertyStatus.Rented, agentId: 'user-2', imageUrl: 'https://picsum.photos/seed/prop3/400/300', bedrooms: 0, bathrooms: 2, areaSqFt: 2500 },
  { id: 'prop-4', title: 'Exclusive Palm Jumeirah Villa', location: 'Palm Jumeirah', priceAED: 25000000, type: PropertyType.Villa, status: PropertyStatus.Available, agentId: 'user-3', imageUrl: 'https://picsum.photos/seed/prop4/400/300', bedrooms: 6, bathrooms: 7, areaSqFt: 8000 },
  { id: 'prop-5', title: 'Chic City Walk Apartment', location: 'City Walk', priceAED: 2800000, type: PropertyType.Apartment, status: PropertyStatus.Available, agentId: 'user-2', imageUrl: 'https://picsum.photos/seed/prop5/400/300', bedrooms: 1, bathrooms: 2, areaSqFt: 900 },
];

export const mockDeals: Deal[] = [
  { id: 'deal-1', propertyId: 'prop-2', agentId: 'user-3', clientId: 'client-1', stage: DealStage.Closed, valueAED: 12000000, commissionRate: 0.02, closeDate: '2024-06-15' },
  { id: 'deal-2', propertyId: 'prop-1', agentId: 'user-2', clientId: 'client-2', stage: DealStage.Negotiation, valueAED: 3500000, commissionRate: 0.02, closeDate: '2024-08-10' },
  { id: 'deal-3', propertyId: 'prop-4', agentId: 'user-3', clientId: 'client-3', stage: DealStage.Offer, valueAED: 25000000, commissionRate: 0.015, closeDate: '2024-08-20' },
  { id: 'deal-4', propertyId: 'prop-3', agentId: 'user-2', clientId: 'client-4', stage: DealStage.Closed, valueAED: 2000000, commissionRate: 0.05, closeDate: '2024-05-20' }, // For rent
  { id: 'deal-5', propertyId: 'prop-5', agentId: 'user-3', clientId: 'client-5', stage: DealStage.Closed, valueAED: 2800000, commissionRate: 0.02, closeDate: '2024-07-22' },
];

export const mockLeads: Lead[] = [
    { id: 'lead-1', name: 'Hassan Iqbal', email: 'hassan@example.com', phone: '+971 50 123 4567', source: 'Website', status: LeadStatus.New, agentId: 'user-2', createdAt: '2024-07-28T09:00:00Z' },
    { id: 'lead-2', name: 'Sara Khan', email: 'sara@example.com', phone: '+971 55 987 6543', source: 'Referral', status: LeadStatus.Contacted, agentId: 'user-3', createdAt: '2024-07-27T14:00:00Z' },
    { id: 'lead-3', name: 'Khalid Ahmed', email: 'khalid@example.com', phone: '+971 52 555 8888', source: 'Walk-in', status: LeadStatus.Qualified, agentId: 'user-2', createdAt: '2024-07-25T11:30:00Z' },
    { id: 'lead-4', name: 'Noura Salim', email: 'noura@example.com', phone: '+971 56 222 3333', source: 'Website', status: LeadStatus.Lost, agentId: 'user-3', createdAt: '2024-07-26T16:20:00Z' },
];

export const mockDocuments: Document[] = [
    { id: 'doc-1', name: 'Prop-1_TitleDeed.pdf', type: 'PDF', sizeKB: 1200, uploadDate: '2024-07-20', uploadedById: 'user-2', relatedToId: 'prop-1' },
    { id: 'doc-2', name: 'Deal-1_MOU.docx', type: 'DOCX', sizeKB: 250, uploadDate: '2024-06-10', uploadedById: 'user-3', relatedToId: 'deal-1' },
    { id: 'doc-3', name: 'Palm_Villa_Brochure.pdf', type: 'PDF', sizeKB: 5600, uploadDate: '2024-07-15', uploadedById: 'user-3', relatedToId: 'prop-4' },
    { id: 'doc-4', name: 'Client_Passport.jpg', type: 'JPG', sizeKB: 850, uploadDate: '2024-06-11', uploadedById: 'user-3', relatedToId: 'deal-1' },
];

export const mockReminders: Reminder[] = [
    { id: 'rem-1', title: 'Follow up with Sara Khan', dueDate: '2024-07-30', relatedTo: 'Lead: Sara Khan', isCompleted: false, agentId: 'user-3' },
    { id: 'rem-2', title: 'Send offer for Marina Apt', dueDate: '2024-07-29', relatedTo: 'Deal: prop-1', isCompleted: false, agentId: 'user-2' },
    { id: 'rem-3', title: 'Call Khalid Ahmed re: viewing', dueDate: '2024-07-28', relatedTo: 'Lead: Khalid Ahmed', isCompleted: true, agentId: 'user-2' },
    { id: 'rem-4', title: 'Prepare docs for Palm Villa', dueDate: '2024-08-01', relatedTo: 'Deal: prop-4', isCompleted: false, agentId: 'user-3' },
    { id: 'rem-5', title: 'Schedule meeting with Hassan', dueDate: '2024-07-28', relatedTo: 'Lead: Hassan Iqbal', isCompleted: false, agentId: 'user-2' },
];

export const mockCalls: Call[] = [
    { id: 'call-1', clientName: 'Sara Khan', agentId: 'user-3', dateTime: '2024-07-28T10:05:00Z', outcome: CallOutcome.Successful, notes: 'Discussed Marina property, client is very interested. Scheduled a viewing for tomorrow at 2 PM.' },
    { id: 'call-2', clientName: 'Hassan Iqbal', agentId: 'user-2', dateTime: '2024-07-28T11:30:00Z', outcome: CallOutcome.Voicemail, notes: 'Left a voicemail to introduce myself and follow up on the website inquiry.' },
    { id: 'call-3', clientName: 'Potential Buyer X', agentId: 'user-3', dateTime: '2024-07-27T15:00:00Z', outcome: CallOutcome.NoAnswer, notes: 'Tried calling regarding the Downtown Villa inquiry, no answer.' },
    { id: 'call-4', clientName: 'Khalid Ahmed', agentId: 'user-2', dateTime: '2024-07-27T09:45:00Z', outcome: CallOutcome.Successful, notes: 'Confirmed viewing appointment for the JLT office space. Client seems qualified.' },
];

export const mockEmails: Email[] = [
  {
    id: 'email-1',
    from: 'Sara Khan',
    to: 'Agent Fatima',
    subject: 'Re: Viewing Appointment for Marina Apartment',
    body: 'Hi Fatima, \n\nConfirming the viewing for tomorrow at 2 PM. Looking forward to it! \n\nBest, \nSara',
    date: '2024-07-28T14:30:00Z',
    isRead: false,
    folder: EmailFolder.Inbox,
  },
  {
    id: 'email-2',
    from: 'Agent Ahmed',
    to: 'Hassan Iqbal',
    subject: 'Following up on your inquiry',
    body: 'Dear Hassan, \n\nThank you for your interest in our properties. I tried calling you earlier. Please let me know a good time to connect. \n\nRegards, \nAhmed',
    date: '2024-07-28T12:00:00Z',
    isRead: true,
    folder: EmailFolder.Sent,
  },
  {
    id: 'email-3',
    from: 'Marketing Team',
    to: 'Me',
    subject: 'New Luxury Villa Launch on Palm Jumeirah!',
    body: 'Don\'t miss out on our latest exclusive listing. A stunning 6-bedroom villa on the Palm with private beach access. Contact us for a private viewing.',
    date: '2024-07-27T18:00:00Z',
    isRead: true,
    folder: EmailFolder.Inbox,
  },
  {
    id: 'email-4',
    from: 'Agent Fatima',
    to: 'Client Omar',
    subject: 'Documents for Downtown Villa',
    body: 'Hi Omar, \n\nPlease find attached the necessary documents for the Downtown Villa deal. Let me know if you have any questions. \n\nThanks, \nFatima',
    date: '2024-07-26T10:15:00Z',
    isRead: true,
    folder: EmailFolder.Sent,
  },
   {
    id: 'email-5',
    from: 'Noura Salim',
    to: 'Agent Fatima',
    subject: 'Update on property search',
    body: 'Hi Fatima, \n\nThank you for the options. Unfortunately, they are a bit out of my budget. I will have to hold off on my search for now. \n\nBest, \nNoura',
    date: '2024-07-29T09:00:00Z',
    isRead: false,
    folder: EmailFolder.Inbox,
  },
];