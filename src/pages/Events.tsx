import React from "react";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Users, Plus, Upload, Image, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

const ADMIN_EMAILS = ["admin@example.com", "anotheradmin@example.com"];

const Events = () => {
  console.log('Events component render');
  // Registration modal state
  // Modal state: false | 'user' | 'admin'
  const [showRegisterModal, setShowRegisterModal] = useState<false | 'user' | 'admin'>(false);
  const [registerEvent, setRegisterEvent] = useState(null);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    institute: '',
    year: ''
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrations, setRegistrations] = useState([]);

  // Handle registration form changes - FIXED: Added useCallback to prevent re-renders
  const handleRegistrationChange = React.useCallback((e) => {
    const { name, value } = e.target;
    console.log('Input change:', name, value);
    setRegistrationForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Submit registration to Firestore
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (!registerEvent) return;
    try {
      const regCol = collection(db, 'registrations');
      await addDoc(regCol, {
        ...registrationForm,
        eventName: registerEvent.title || '',
        eventId: registerEvent.id || null,
        timestamp: new Date().toISOString()
      });
      setRegistrationSuccess(true);
      setRegistrationForm({ name: '', email: '', institute: '', year: '' });
    } catch (err) {
      alert('Failed to register.');
    }
  };

  // Admin: fetch registrations for an event
  const fetchRegistrationsForEvent = async (event) => {
    try {
      const regCol = collection(db, 'registrations');
      const q = query(regCol, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const regs = snapshot.docs
        .map(doc => ({ id: doc.id, ...(doc.data() as { eventName?: string; name?: string; email?: string; institute?: string; year?: string; timestamp?: string }) }))
        .filter(r => (r.eventName ?? '') === (event.title || ''));
      setRegistrations(regs);
    } catch (err) {
      alert('Failed to fetch registrations.');
    }
  };

  // Registration Modal UI - FIXED: Moved outside and made it a proper component
  const RegistrationModal = React.useMemo(() => {
    if (!showRegisterModal || !registerEvent) return null;
    
    // Admin view
    if (showRegisterModal === 'admin') {
      return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-2xl relative" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white" onClick={() => { setShowRegisterModal(false); setRegisterEvent(null); setRegistrations([]); }}>
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" /> Registrations for "{registerEvent.title}"
            </h2>
            {registrations.length === 0 ? (
              <p className="text-muted-foreground">No registrations yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="bg-blue-100 dark:bg-blue-900/20">
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Institute</th>
                      <th className="p-2 text-left">Year</th>
                      <th className="p-2 text-left">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(r => (
                      <tr key={r.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="p-2">{r.name ?? ''}</td>
                        <td className="p-2">{r.email ?? ''}</td>
                        <td className="p-2">{r.institute ?? ''}</td>
                        <td className="p-2">{r.year ?? ''}</td>
                        <td className="p-2">{r.timestamp ? new Date(r.timestamp).toLocaleString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // User registration view - FIXED: Added proper form structure and input handling
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-lg relative" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white" onClick={() => { 
            setShowRegisterModal(false); 
            setRegisterEvent(null); 
            setRegistrationSuccess(false); 
            setRegistrationForm({ name: '', email: '', institute: '', year: '' }); 
          }}>
            ✕
          </button>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" /> Register for "{registerEvent.title}"
          </h2>
          {registrationSuccess ? (
            <div className="text-green-600 font-semibold text-center mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              Registration successful!
            </div>
          ) : null}
          <form onSubmit={handleRegistrationSubmit} className="space-y-4">
            <div>
              <Input 
                name="name" 
                value={registrationForm.name} 
                onChange={handleRegistrationChange} 
                placeholder="Your Name" 
                required 
                className="w-full"
              />
            </div>
            <div>
              <Input 
                name="email" 
                value={registrationForm.email} 
                onChange={handleRegistrationChange} 
                type="email" 
                placeholder="Email" 
                required 
                className="w-full"
              />
            </div>
            <div>
              <Input 
                name="institute" 
                value={registrationForm.institute} 
                onChange={handleRegistrationChange} 
                placeholder="Institute" 
                required 
                className="w-full"
              />
            </div>
            <div>
              <Input 
                name="year" 
                value={registrationForm.year} 
                onChange={handleRegistrationChange} 
                placeholder="Year of Study" 
                required 
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
              Submit Registration
            </Button>
          </form>
        </div>
      </div>
    );
  }, [showRegisterModal, registerEvent, registrations, registrationForm, registrationSuccess, handleRegistrationChange]);

  const { user } = useAuth();
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // Add Event form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: '',
    date: '',
    time: '',
    venue: '',
    category: '',
    description: '',
    thumbnailType: 'upload', // 'upload' or 'url'
    thumbnailFile: null,
    thumbnailUrl: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [editEventType, setEditEventType] = useState(null); // 'firestore' or 'local'
  const [editLocalIndex, setEditLocalIndex] = useState(null);
  const [uploadPreview, setUploadPreview] = useState('');
  
  // FIXED: Added static data preservation
  const hardcodedEvents = [
    {
      title: "Clinical Case Presentation Series",
      date: "December 15, 2024",
      time: "6:00 PM - 8:00 PM IST",
      location: "Virtual Event",
      type: "Webinar",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&crop=center",
      description: "Join us for an interactive session featuring complex clinical cases presented by senior residents and reviewed by expert clinicians."
    },
    {
      title: "Research Methodology Workshop",
      date: "December 20, 2024",
      time: "10:00 AM - 4:00 PM IST",
      location: "AIIMS Delhi",
      type: "Workshop",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop&crop=center",
      description: "Learn advanced research techniques, statistical analysis, and how to write compelling research papers."
    },
    {
      title: "Annual Medical Quiz Championship",
      date: "January 5, 2025",
      time: "2:00 PM - 5:00 PM IST",
      location: "Multiple Cities",
      type: "Competition",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop&crop=center",
      description: "Test your medical knowledge against peers from across the country in this comprehensive quiz competition."
    },
    {
      title: "Surgical Skills Simulation Training",
      date: "January 12, 2025",
      time: "9:00 AM - 5:00 PM IST",
      location: "PGIMER Chandigarh",
      type: "Training",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop&crop=center",
      description: "Hands-on surgical skills training using state-of-the-art simulation equipment and expert guidance."
    }
  ];

  const [firestoreEvents, setFirestoreEvents] = useState([]);
  const [localEvents, setLocalEvents] = useState(hardcodedEvents);
  const [editingEvent, setEditingEvent] = useState(null); // For edit modal (future)
  
  // Load events from Firestore on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCol = collection(db, "events");
        const q = query(eventsCol, orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFirestoreEvents(events);
      } catch (err) {
        console.error("Error loading events:", err);
      }
    };
    fetchEvents();
  }, []);

  // FIXED: Preserved static past events data
  const pastEvents = [
    {
      title: "World Asthma Day",
      date: "November 15, 2024",
      attendees: "2,500+",
      image: "/Images/IMG-20250613-WA0032.jpg"
    },
    {
      title: "World Asthma Day",
      date: "October 28, 2024",
      attendees: "1,800+",
      image: "/Images/IMG-20250613-WA0033.jpg"
    },
    {
      title: "World Asthma Day",
      date: "October 10-16, 2024",
      attendees: "3,200+",
      image: "/Images/IMG-20250613-WA0034.jpg"
    }
  ];

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setEventForm((prev) => ({ ...prev, thumbnailFile: files[0] }));
      if (files[0]) {
        setUploadPreview(URL.createObjectURL(files[0]));
      } else {
        setUploadPreview('');
      }
    } else {
      setEventForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submit (stub, add Firestore logic as needed)
  const handleAddOrEditEvent = async (e) => {
    e.preventDefault();
    let image = '';
    if (eventForm.thumbnailType === 'upload' && uploadPreview) {
      image = uploadPreview;
    } else if (eventForm.thumbnailType === 'url' && eventForm.thumbnailUrl) {
      image = eventForm.thumbnailUrl;
    }
    const eventData = {
      title: eventForm.name,
      date: eventForm.date,
      time: eventForm.time,
      location: eventForm.venue,
      type: eventForm.category,
      image,
      description: eventForm.description
    };
    if (editMode && editEventType === 'firestore') {
      // Update Firestore event
      try {
        const eventsCol = collection(db, "events");
        await import('firebase/firestore').then(firestore => firestore.updateDoc(firestore.doc(eventsCol, editEventId), eventData));
        const q = query(eventsCol, orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFirestoreEvents(events);
      } catch (err) {
        console.error("Error updating event:", err);
        alert("Failed to update event.");
      }
    } else if (editMode && editEventType === 'local') {
      // Update local event
      setLocalEvents(events => events.map((ev, idx) => idx === editLocalIndex ? eventData : ev));
    } else {
      // Add new event (Firestore only)
      try {
        const eventsCol = collection(db, "events");
        await addDoc(eventsCol, eventData);
        const q = query(eventsCol, orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFirestoreEvents(events);
      } catch (err) {
        console.error("Error adding event:", err);
        alert("Failed to add event.");
      }
    }
    setShowAddForm(false);
    setEditMode(false);
    setEditEventId(null);
    setEditEventType(null);
    setEditLocalIndex(null);
    setEventForm({
      name: '', date: '', time: '', venue: '', category: '', description: '', thumbnailType: 'upload', thumbnailFile: null, thumbnailUrl: ''
    });
    setUploadPreview('');
  };

  // Delete Firestore event
  const handleDeleteFirestoreEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      const eventsCol = collection(db, "events");
      await import('firebase/firestore').then(firestore => firestore.deleteDoc(firestore.doc(eventsCol, id)));
      setFirestoreEvents(events => events.filter(ev => ev.id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event.');
    }
  };

  // Delete hardcoded event (local only)
  const handleDeleteLocalEvent = (index) => {
    if (!window.confirm('Delete this event?')) return;
    setLocalEvents(events => events.filter((_, i) => i !== index));
  };

  // Edit Firestore event
  const handleEditFirestoreEvent = (event) => {
    setEditMode(true);
    setEditEventId(event.id);
    setEditEventType('firestore');
    setShowAddForm(true);
    setEventForm({
      name: event.title || '',
      date: event.date || '',
      time: event.time || '',
      venue: event.location || '',
      category: event.type || '',
      description: event.description || '',
      thumbnailType: event.image && event.image.startsWith('http') ? 'url' : 'upload',
      thumbnailFile: null,
      thumbnailUrl: event.image || ''
    });
    setUploadPreview(event.image || '');
  };

  // Edit local event
  const handleEditLocalEvent = (event, index) => {
    setEditMode(true);
    setEditEventType('local');
    setEditLocalIndex(index);
    setShowAddForm(true);
    setEventForm({
      name: event.title || '',
      date: event.date || '',
      time: event.time || '',
      venue: event.location || '',
      category: event.type || '',
      description: event.description || '',
      thumbnailType: event.image && event.image.startsWith('http') ? 'url' : 'upload',
      thumbnailFile: null,
      thumbnailUrl: event.image || ''
    });
    setUploadPreview(event.image || '');
  };

  return (
    <div className="min-h-screen bg-background">
      {RegistrationModal}
      <Navigation />
      
      {/* Admin-only Add Event button */}
      {isAdmin && (
        <div className="container mx-auto px-4 pt-8 flex justify-end">
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-5 w-5" /> Add Event
          </Button>
        </div>
      )}

      {/* Add/Edit Event Form (modal style, simple inline for now) */}
      {isAdmin && showAddForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-lg relative" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white" onClick={() => { setShowAddForm(false); setEditMode(false); }}>
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" /> {editMode ? 'Edit Event' : 'Create Event'}
            </h2>
            <form onSubmit={handleAddOrEditEvent} className="space-y-4">
              <Input name="name" value={eventForm.name} onChange={handleFormChange} placeholder="Event Name" required />
              <Input name="date" value={eventForm.date} onChange={handleFormChange} type="date" required />
              <Input name="time" value={eventForm.time} onChange={handleFormChange} type="time" required />
              <Input name="venue" value={eventForm.venue} onChange={handleFormChange} placeholder="Venue" required />
              <Input name="category" value={eventForm.category} onChange={handleFormChange} placeholder="Category" required />
              <Textarea name="description" value={eventForm.description} onChange={handleFormChange} placeholder="Description" required />
              <div>
                <label className="font-semibold mb-2 block">Thumbnail</label>
                <div className="flex gap-4 mb-2">
                  <Button type="button" variant={eventForm.thumbnailType === 'upload' ? 'default' : 'outline'} onClick={() => setEventForm((prev) => ({ ...prev, thumbnailType: 'upload' }))}>
                    <Upload className="h-4 w-4 mr-1" /> Upload
                  </Button>
                  <Button type="button" variant={eventForm.thumbnailType === 'url' ? 'default' : 'outline'} onClick={() => setEventForm((prev) => ({ ...prev, thumbnailType: 'url', thumbnailFile: null, thumbnailUrl: '' }))}>
                    <Image className="h-4 w-4 mr-1" /> URL
                  </Button>
                </div>
                {eventForm.thumbnailType === 'upload' ? (
                  <Input name="thumbnailFile" type="file" accept="image/*" onChange={handleFormChange} />
                ) : (
                  <Input name="thumbnailUrl" value={eventForm.thumbnailUrl} onChange={handleFormChange} placeholder="Image URL" />
                )}
                {/* Preview */}
                {(eventForm.thumbnailType === 'upload' && uploadPreview) && (
                  <img src={uploadPreview} alt="Preview" className="mt-2 rounded w-full max-h-40 object-cover" />
                )}
                {(eventForm.thumbnailType === 'url' && eventForm.thumbnailUrl) && (
                  <img src={eventForm.thumbnailUrl} alt="Preview" className="mt-2 rounded w-full max-h-40 object-cover" />
                )}
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">{editMode ? 'Update Event' : 'Create Event'}</Button>
            </form>
          </div>
        </div>
      )}
      
      <section className="relative py-20 min-h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-500 to-pink-400 dark:from-blue-950 dark:via-purple-900 dark:to-pink-900 overflow-hidden">
        {/* Previous animated orbs and gradients */}
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-blue-300/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-24 h-24 bg-pink-300/40 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-purple-300/50 rounded-full blur-lg animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-blue-400/30 rounded-full blur-lg animate-pulse delay-700"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.06]"></div>
        {/* Exciting wave animation */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-pink-200/20 via-purple-100/10 to-transparent dark:from-pink-900/20 dark:via-purple-800/10"></div>
        {/* Diagonal gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/20 to-pink-100/30 dark:from-transparent dark:via-blue-950/20 dark:to-pink-950/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 flex items-center justify-center gap-4">
              <span className="inline-block">
                <Calendar className="inline h-12 w-12 text-pink-500 mr-2 animate-gentle-pulse" />
              </span>
              <span className="bg-gradient-to-r from-blue-600 to-pink-400 bg-clip-text text-white dark:text-white">
                SMAK Events
              </span>
            </h1>
            <p className="text-xl text-blue-50 dark:text-blue-100 mb-8 font-semibold drop-shadow-lg">
              Join our community of medical students and professionals in learning, networking, and growing together through our diverse range of events.
            </p>
          </div>
        </div>
        <style>{`
          @keyframes gentle-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
          .animate-gentle-pulse { animation: gentle-pulse 3s ease-in-out infinite; }
        `}</style>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <p className="text-lg text-muted-foreground">
              Don't miss out on these exciting learning opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Combine and sort events: Firestore first, then hardcoded, sorted by date desc */}
            {(() => {
              const combined = [...firestoreEvents, ...localEvents]
                .slice()
                .sort((a, b) => {
                  const dateA = new Date(a.date).getTime();
                  const dateB = new Date(b.date).getTime();
                  return dateB - dateA;
                });
              return combined.map((event, idx) => {
                const isFirestore = !!event.id;
                // For local events, get correct index for edit/delete
                const localIndex = isFirestore ? null : idx - firestoreEvents.length;
                // Defensive property access
                const title = event.title || '';
                const image = event.image || '';
                const type = event.type || '';
                const date = event.date || '';
                const time = event.time || '';
                const location = event.location || '';
                const description = event.description || '';
                return (
                  <Card key={isFirestore ? event.id : idx} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
                    <div className="aspect-video">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{title}</CardTitle>
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium dark:bg-blue-900/20 dark:text-blue-400">
                          {type}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                          {date}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2 text-blue-600" />
                          {time}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                          {location}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{description}</p>
                      {isAdmin && (
                        <div className="flex gap-2 mb-4 flex-wrap">
                          {isFirestore ? (
                            <>
                              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => handleEditFirestoreEvent(event)}>
                                <Edit className="h-4 w-4" /> Edit
                              </Button>
                              <Button variant="destructive" size="sm" className="flex items-center gap-1" onClick={() => handleDeleteFirestoreEvent(event.id)}>
                                <Trash2 className="h-4 w-4" /> Delete
                              </Button>
                              <Button variant="secondary" size="sm" className="flex items-center gap-1" onClick={() => { fetchRegistrationsForEvent(event); setRegisterEvent(event); setShowRegisterModal('admin'); }}>
                                <Users className="h-4 w-4" /> View Registrations
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => handleEditLocalEvent(event, localIndex)}>
                                <Edit className="h-4 w-4" /> Edit
                              </Button>
                              <Button variant="destructive" size="sm" className="flex items-center gap-1" onClick={() => handleDeleteLocalEvent(localIndex)}>
                                <Trash2 className="h-4 w-4" /> Delete
                              </Button>
                              <Button variant="secondary" size="sm" className="flex items-center gap-1" onClick={() => { fetchRegistrationsForEvent(event); setRegisterEvent(event); setShowRegisterModal('admin'); }}>
                                <Users className="h-4 w-4" /> View Registrations
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 mt-2" onClick={() => { setRegisterEvent(event); setShowRegisterModal('user'); setRegistrationSuccess(false); }}>
                        Register Now
                      </Button>
                    </CardContent>
                  </Card>
                );
              });
            })()}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Past Events
            </h2>
            <p className="text-lg text-muted-foreground">
              Celebrating our successful events and their impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
                <div className="aspect-video">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-blue-600 font-medium">
                    <Users className="h-4 w-4 mr-2" />
                    {event.attendees} Attendees
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Event Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Webinars", description: "Expert-led online sessions", icon: "🎥" },
              { title: "Workshops", description: "Hands-on learning experiences", icon: "🔬" },
              { title: "Competitions", description: "Test your knowledge and skills", icon: "🏆" },
              { title: "Conferences", description: "Large-scale academic gatherings", icon: "🏛️" }
            ].map((category, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;