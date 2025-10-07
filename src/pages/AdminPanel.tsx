import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { QuizQuestionDraggable } from '../components/QuizQuestionDraggable';
interface Journal {
    id: string;
    title: string;
    authors?: string;
    journal?: string;
    abstract?: string;
    category?: string;
    status: string;
    imageUrl?: string;
    pdfUrl?: string;
    externalUrl?: string;
    uploadedByName?: string;
    publishedDate?: string;
    citationCount?: number;
    downloadCount?: number;
}
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, ArrowLeft, LayoutDashboard } from "lucide-react";
import { Menu, MenuItem } from "@mui/material";
import { db, storage } from "../firebase";
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import BulkMemberUpload from "../components/BulkMemberUpload";
//import { Tabs, Tab } from "@/components/ui/tabs";

// Example admin email list
const ADMIN_EMAILS = ["admin@example.com", "anotheradmin@example.com"];


interface Blog {
    id: string;
    title: string;
    author?: string;
    category?: string;
    content?: string;
    excerpt?: string;
    publishedDate?: string;
    status: string;
    image?: string;
    tags?: string[];
    createdAt?: any;
}

interface VideoLectureAdmin {
    id: string;
    title: string;
    instructor?: string;
    description?: string;
    subject?: string;
    videoUrl?: string;
    thumbnail?: string;
    status: string;
    uploadedBy?: string;
    createdAt?: any;
}

const AdminPanel: React.FC = () => {
    // State for editing quiz
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [editQuizForm, setEditQuizForm] = useState({
        title: '',
        thumbnail: '',
        thumbnailType: 'url',
        questions: [{ question: '', options: ['', ''], correctAnswer: 0 }],
        gformLink: '',
        type: 'manual',
    });
    const [showEditModal, setShowEditModal] = useState(false);

    // Open edit modal for manual quiz
    const handleEditQuiz = (quiz) => {
        setEditingQuiz(quiz);
        setEditQuizForm({
            title: quiz.title || '',
            thumbnail: quiz.thumbnail || '',
            thumbnailType: quiz.thumbnail ? 'url' : 'upload',
            questions: quiz.questions || [{ question: '', options: ['', ''], correctAnswer: 0 }],
            gformLink: quiz.gformLink || '',
            type: quiz.type || 'manual',
        });
        setShowEditModal(true);
    };

    // Edit quiz form handlers
    const handleEditQuizFormChange = (field, value) => {
        setEditQuizForm(prev => ({ ...prev, [field]: value }));
    };
    const handleEditQuizQuestionChange = (idx, field, value) => {
        setEditQuizForm(prev => {
            const updated = [...prev.questions];
            updated[idx][field] = value;
            return { ...prev, questions: updated };
        });
    };
    const handleEditAddQuizQuestion = () => {
        setEditQuizForm(prev => ({ ...prev, questions: [...prev.questions, { question: '', options: ['', ''], correctAnswer: 0 }] }));
    };
    const handleEditRemoveQuizQuestion = (idx) => {
        setEditQuizForm(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== idx) }));
    };
    const handleEditQuizOptionChange = (qIdx, optIdx, value) => {
        setEditQuizForm(prev => {
            const updated = [...prev.questions];
            updated[qIdx].options[optIdx] = value;
            return { ...prev, questions: updated };
        });
    };
    const handleEditAddQuizOption = (qIdx) => {
        setEditQuizForm(prev => {
            const updated = [...prev.questions];
            updated[qIdx].options.push('');
            return { ...prev, questions: updated };
        });
    };
    const handleEditRemoveQuizOption = (qIdx, optIdx) => {
        setEditQuizForm(prev => {
            const updated = [...prev.questions];
            updated[qIdx].options = updated[qIdx].options.filter((_, i) => i !== optIdx);
            return { ...prev, questions: updated };
        });
    };
    // Save edited quiz
    const handleSaveEditedQuiz = async (e) => {
        e.preventDefault();
        if (!editingQuiz) return;
        try {
            const updateData: any = {
                title: editQuizForm.title,
                thumbnail: editQuizForm.thumbnail,
            };
            if (editQuizForm.type === 'manual') {
                updateData.questions = editQuizForm.questions;
            } else if (editQuizForm.type === 'gform') {
                updateData.gformLink = editQuizForm.gformLink;
            }
            await updateDoc(doc(db, 'quizzes', editingQuiz.id), updateData);
            setShowEditModal(false);
            setEditingQuiz(null);
            // Refresh quizzes
            const querySnapshot = await getDocs(collection(db, "quizzes"));
            setQuizzes(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
            alert('Failed to update quiz.');
        }
    };
    // Delete quiz handler
    const handleDeleteQuiz = async (quizId) => {
        if (!window.confirm('Are you sure you want to delete this quiz?')) return;
        try {
            await deleteDoc(doc(db, 'quizzes', quizId));
            setQuizzes(prev => prev.filter(q => q.id !== quizId));
        } catch (err) {
            alert('Failed to delete quiz.');
        }
    };
    // State declarations for quizzes section
    const [quizzes, setQuizzes] = useState([]);
    const [quizForm, setQuizForm] = useState({
        title: '',
        thumbnail: '',
        thumbnailType: 'url',
        gformLink: '',
        questions: [{ question: '', options: ['', ''], correctAnswer: 0 }],
    });
    const [quizMode, setQuizMode] = useState<'manual' | 'gform'>('manual');
    const [uploadingQuiz, setUploadingQuiz] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    // Section type for course section 1
    const [sectionType, setSectionType] = useState('video');
    // Quiz type for course section 1
    const [quizType, setQuizType] = useState<'manual' | 'gform'>('manual');
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };
    const handleSignOut = () => {
        // Add your sign out logic here
        if (window.confirm("Sign out?")) {
            window.location.href = "/login";
        }
    };
    const { user } = useAuth();
    const [pendingJournals, setPendingJournals] = useState<Journal[]>([]);
    const [pendingBlogs, setPendingBlogs] = useState<Blog[]>([]);
    const [pendingVideos, setPendingVideos] = useState<VideoLectureAdmin[]>([]);
    const [loadingJournals, setLoadingJournals] = useState(true);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [loadingVideos, setLoadingVideos] = useState(true);
    const [activeTab, setActiveTab] = useState<'journals' | 'blogs' | 'members' | 'achievements' | 'videos' | 'bulkmembers' | 'quizzes' | 'courses'>('journals');
    useEffect(() => {
        const fetchQuizzes = async () => {
            const querySnapshot = await getDocs(collection(db, "quizzes"));
            setQuizzes(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };
        fetchQuizzes();
    }, []);

    // Quiz handlers
    const handleQuizFormChange = (field, value) => {
        setQuizForm(prev => ({ ...prev, [field]: value }));
    };
    const handleQuizQuestionChange = (idx, field, value) => {
        setQuizForm(prev => {
            const updated = [...prev.questions];
            updated[idx][field] = value;
            return { ...prev, questions: updated };
        });
    };
    const handleAddQuizQuestion = () => {
        setQuizForm(prev => ({ ...prev, questions: [...prev.questions, { question: '', options: ['', ''], correctAnswer: 0 }] }));
    };
    const handleRemoveQuizQuestion = (idx) => {
        setQuizForm(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== idx) }));
    };
    const handleQuizOptionChange = (qIdx, optIdx, value) => {
        setQuizForm(prev => {
            const updated = [...prev.questions];
            updated[qIdx].options[optIdx] = value;
            return { ...prev, questions: updated };
        });
    };
    const handleAddQuizOption = (qIdx) => {
        setQuizForm(prev => {
            const updated = [...prev.questions];
            updated[qIdx].options.push('');
            return { ...prev, questions: updated };
        });
    };
    const handleRemoveQuizOption = (qIdx, optIdx) => {
        setQuizForm(prev => {
            const updated = [...prev.questions];
            updated[qIdx].options = updated[qIdx].options.filter((_, i) => i !== optIdx);
            return { ...prev, questions: updated };
        });
    };
    const handleQuizSubmit = async (e) => {
        e.preventDefault();
        setUploadingQuiz(true);
        const quizData = {
            title: quizForm.title,
            thumbnail: quizForm.thumbnail,
            type: quizMode,
            questions: quizMode === 'manual' ? quizForm.questions : [],
            gformLink: quizMode === 'gform' ? quizForm.gformLink : '',
            createdAt: new Date(),
        };
        await addDoc(collection(db, "quizzes"), quizData);
        setQuizForm({ title: '', thumbnail: '', thumbnailType: 'url', gformLink: '', questions: [{ question: '', options: ['', ''], correctAnswer: 0 }] });
        setShowQuizModal(false);
        setUploadingQuiz(false);
        // Refresh quizzes
        const querySnapshot = await getDocs(collection(db, "quizzes"));
        setQuizzes(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    // Achievements state
    const defaultAchievements = [
        { icon: 'Trophy', value: '2024', label: 'Established' },
        { icon: 'Users', value: '1000+', label: 'Active Members' },
        { icon: 'BookOpen', value: '200+', label: 'Research Papers' },
        { icon: 'Globe', value: '50+', label: 'Partner Colleges' }
    ];
    const [staticAchievements, setStaticAchievements] = useState(() => {
        // Try to load from localStorage first
        const local = localStorage.getItem('staticAchievements');
        if (local) {
            try {
                return JSON.parse(local);
            } catch { }
        }
        return defaultAchievements;
    });
    const [achievements, setAchievements] = useState([]);
    const [achievementForm, setAchievementForm] = useState({
        icon: '',
        value: '',
        label: '',
        isStatic: false,
        staticIndex: null,
    });
    const [editingAchievementId, setEditingAchievementId] = useState(null);
    const achievementIcons = [
        'Trophy', 'Users', 'BookOpen', 'Globe', 'Star', 'Award', 'Calendar', 'FileText', 'Heart', 'Activity', 'Shield', 'Microscope', 'Crown', 'Zap', 'Sparkles'
    ];
    // Static members array
    const [staticMembers, setStaticMembers] = useState([
        { name: "SAMUDRA CHAUDHARI ", institution: "SMAK", designation: "FOUNDER", pictureUrl: "https://i.postimg.cc/65tpg88S/Whats-App-Image-2025-08-13-at-13-39-13-32477921.jpg", phone: "", objectPosition: "center 20%" },
        { name: "KHUSHAL PAL", institution: "SMAK", designation: "CO-FOUNDER", pictureUrl: "https://i.postimg.cc/DwYfS5xk/Whats-App-Image-2025-08-13-at-13-39-13-89a66ab2.jpg", phone: "" },
        { name: "Brishabh Raj Prajesh", institution: "SMAK RESEARCH CLUB", designation: "Head", pictureUrl: "https://i.postimg.cc/L5ByYYTG/Whats-App-Image-2025-08-13-at-13-01-49-9d0aaa5d.jpg", phone: "" },
        { name: "Musa M. Bharmal", institution: "SMAK RESEARCH CLUB", designation: "Co Head", pictureUrl: "https://i.postimg.cc/6pT0w1Dk/Whats-App-Image-2025-08-13-at-13-01-49-3b92b5a0.jpg", phone: "" },
        { name: "Disha Agrawala ", institution: "SMAK", designation: "Executive Board Member", pictureUrl: "https://i.postimg.cc/VN8d4JBK/Whats-App-Image-2025-08-13-at-13-01-49-0a36118b.jpg", phone: "" },
        { name: "Taniya Masud Temkar", institution: "DY Patil Medical College, Kolhapur", designation: "Head Of Event & Content Committee", pictureUrl: "https://i.postimg.cc/HsMYKpLR/Whats-App-Image-2025-08-13-at-13-01-49-6427a359.jpg", phone: "" },
        { name: "Uzair Pathan", institution: "Coordinator - Event and Content Committee", designation: "Head", pictureUrl: "https://i.postimg.cc/brcyYMC3/Whats-App-Image-2025-08-13-at-13-01-49-73477329.jpg", phone: "GMC Alibag" },
        { name: "Aakanksha Nanda", institution: "Veer Surendra Sai Institute of Medical Science And Research, Burla, Odisha", designation: "Head of the Mentorship Program Committee", pictureUrl: "https://i.postimg.cc/0QG3mB5t/Whats-App-Image-2025-08-13-at-13-01-49-8c3c0677.jpg", phone: "" },
        { name: "Sanya Walia", institution: "Government Institute of Medical Sciences, Greater Noida", designation: "Coordinator - Mentorship Program Committee", pictureUrl: "https://i.postimg.cc/Gm0Fwhxy/Whats-App-Image-2025-08-13-at-13-01-49-c374962b.jpg", phone: "" },
        { name: "Ananya", institution: "Maulana Azad Medical College Delhi", designation: "Head Of Journal Development committee", pictureUrl: "https://i.postimg.cc/vTkKfgxz/Whats-App-Image-2025-08-13-at-13-01-49-c8ba169c.jpg", phone: "" },
        { name: "Ansharah Khan", institution: "Grant medical college Mumbai", designation: "Coordinator - Journal Development Committee", pictureUrl: "https://i.postimg.cc/ydPgDc5M/Whats-App-Image-2025-08-13-at-13-01-49-62c3e89c.jpg", phone: "" },
        { name: "Pratik Gupta", institution: "IMS and SUM campus 2", designation: "Head - Campus outreach and coordination Committee", pictureUrl: "https://i.postimg.cc/B6rSQ6Zr/Whats-App-Image-2025-08-13-at-13-01-49-eeb0d546.jpg", phone: "" },
        { name: "Madhav Tripathi", institution: "Virendra Kumar Sakhlecha Government Medical College, Neemuch (MP)", designation: "Coordinator - Outreach & Collaboration Committee", pictureUrl: "https://i.postimg.cc/50cTXFvS/Whats-App-Image-2025-08-13-at-13-01-49-7c1ed6e6.jpg", phone: "" },
    ]);
    // Members state
    const [members, setMembers] = useState([]);
    const [memberForm, setMemberForm] = useState({
        name: '',
        institution: '',
        email: '',
        designation: '',
        phone: '',
        picture: null,
        isStatic: false,
        staticIndex: null,
    });
    const [editingMemberId, setEditingMemberId] = useState(null);

    // Achievement CRUD handlers
    const handleAchievementSubmit = async (e) => {
        e.preventDefault();
        if (achievementForm.isStatic) {
            // Update static achievement
            setStaticAchievements(prev => {
                const updated = prev.map((a, idx) => idx === achievementForm.staticIndex ? {
                    icon: achievementForm.icon,
                    value: achievementForm.value,
                    label: achievementForm.label
                } : a);
                localStorage.setItem('staticAchievements', JSON.stringify(updated));
                return updated;
            });
        } else if (editingAchievementId) {
            // Update Firestore achievement
            const achievementDoc = doc(db, "achievements", editingAchievementId);
            await updateDoc(achievementDoc, {
                icon: achievementForm.icon,
                value: achievementForm.value,
                label: achievementForm.label
            });
            setEditingAchievementId(null);
        } else {
            // Add Firestore achievement
            await addDoc(collection(db, "achievements"), {
                icon: achievementForm.icon,
                value: achievementForm.value,
                label: achievementForm.label
            });
        }
        setAchievementForm({ icon: '', value: '', label: '', isStatic: false, staticIndex: null });
        // Refresh Firestore achievements
        const querySnapshot = await getDocs(collection(db, "achievements"));
        setAchievements(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const handleEditAchievement = (ach, idx = null, isStatic = false) => {
        if (isStatic) {
            setAchievementForm({ icon: ach.icon, value: ach.value, label: ach.label, isStatic: true, staticIndex: idx });
            setEditingAchievementId(null);
        } else {
            setEditingAchievementId(ach.id);
            setAchievementForm({ icon: ach.icon, value: ach.value, label: ach.label, isStatic: false, staticIndex: null });
        }
    };

    const handleDeleteAchievement = async (id, idx = null, isStatic = false) => {
        if (isStatic) {
            if (window.confirm('Delete this static achievement?')) {
                setStaticAchievements(prev => {
                    const updated = prev.filter((_, i) => i !== idx);
                    localStorage.setItem('staticAchievements', JSON.stringify(updated));
                    return updated;
                });
            }
        } else {
            if (window.confirm('Delete this achievement?')) {
                await deleteDoc(doc(db, "achievements", id));
                setAchievements(achievements.filter(a => a.id !== id));
            }
        }
    };

    useEffect(() => {
        const fetchPendingJournals = async () => {
            setLoadingJournals(true);
            const querySnapshot = await getDocs(collection(db, "journals"));
            const pending = querySnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() } as Journal))
                .filter((journal) => journal.status === "pending");
            setPendingJournals(pending);
            setLoadingJournals(false);
        };
        fetchPendingJournals();

        // Fetch pending video lectures
        const fetchPendingVideos = async () => {
            setLoadingVideos(true);
            const querySnapshot = await getDocs(collection(db, "videoLectures"));
            const pending = querySnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() } as VideoLectureAdmin))
                .filter((video) => video.status === "pending");
            setPendingVideos(pending);
            setLoadingVideos(false);
        };
        fetchPendingVideos();

        // Fetch members from Firestore
        const fetchMembers = async () => {
            const querySnapshot = await getDocs(collection(db, "members"));
            const membersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setMembers(membersList);
        };
        fetchMembers();
        // Fetch achievements from Firestore
        const fetchAchievements = async () => {
            const querySnapshot = await getDocs(collection(db, "achievements"));
            const achievementsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setAchievements(achievementsList);
        };
        fetchAchievements();
    }, []);

    // Blog/Journals/Video approval handlers
    const handleApproveVideo = async (id: string) => {
        await updateDoc(doc(db, "videoLectures", id), { status: "approved" });
        setPendingVideos((prev) => prev.filter((v) => v.id !== id));
    };

    const handleRejectVideo = async (id: string) => {
        await updateDoc(doc(db, "videoLectures", id), { status: "rejected" });
        setPendingVideos((prev) => prev.filter((v) => v.id !== id));
    };
    const handleApproveJournal = async (id: string) => {
        await updateDoc(doc(db, "journals", id), { status: "approved" });
        setPendingJournals((prev) => prev.filter((j) => j.id !== id));
    };

    const handleRejectJournal = async (id: string) => {
        await updateDoc(doc(db, "journals", id), { status: "rejected" });
        setPendingJournals((prev) => prev.filter((j) => j.id !== id));
    };

    const handleApproveBlog = async (id: string) => {
        await updateDoc(doc(db, "blogs", id), { status: "approved" });
        setPendingBlogs((prev) => prev.filter((b) => b.id !== id));
    };

    const handleRejectBlog = async (id: string) => {
        await updateDoc(doc(db, "blogs", id), { status: "rejected" });
        setPendingBlogs((prev) => prev.filter((b) => b.id !== id));
    };
    if (!user || !ADMIN_EMAILS.includes(user.email)) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
                <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[rgb(15,23,42)] via-blue-900 to-[rgb(15,23,42)] text-white p-0">
            {/* Navbar */}
            <nav className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 shadow-lg border-b border-blue-300/20">
                <button
                    className="flex items-center gap-2 text-white hover:text-blue-200 font-semibold text-lg focus-ring px-3 py-2 rounded-full btn-medical"
                    onClick={() => navigate("/dashboard")}
                >
                    <ArrowLeft size={22} />
                    Back
                </button>
                <span className="text-2xl font-bold tracking-wide text-white">Admin Panel</span>
                <div>
                    <button
                        className="flex items-center gap-2 text-white hover:text-blue-200 font-semibold text-lg px-3 py-2 rounded-full btn-medical"
                        onClick={handleUserMenuOpen}
                    >
                        <User size={22} />
                        {user?.email?.split("@")[0] || "User"}
                    </button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleUserMenuClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <MenuItem onClick={() => { handleUserMenuClose(); navigate("/dashboard"); }}>
                            <LayoutDashboard size={18} className="mr-2" /> Dashboard
                        </MenuItem>
                        <MenuItem onClick={() => { handleUserMenuClose(); handleSignOut(); }}>
                            <LogOut size={18} className="mr-2" /> Sign Out
                        </MenuItem>
                    </Menu>
                </div>
            </nav>
            <div className="flex justify-center mb-8 mt-8 animate-fade-in">
                <div className="flex gap-4">
                    <Button
                        variant={activeTab === 'journals' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('journals')}
                        className={activeTab === 'journals' ? 'bg-blue-600 text-white' : ''}
                    >
                        Journals
                    </Button>
                    <Button
                        variant={activeTab === 'blogs' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('blogs')}
                        className={activeTab === 'blogs' ? 'bg-blue-600 text-white' : ''}
                    >
                        Blogs
                    </Button>
                    <Button
                        variant={activeTab === 'members' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('members')}
                        className={activeTab === 'members' ? 'bg-blue-600 text-white' : ''}
                    >
                        Members
                    </Button>
                    <Button
                        variant={activeTab === 'bulkmembers' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('bulkmembers')}
                        className={activeTab === 'bulkmembers' ? 'bg-blue-600 text-white' : ''}
                    >
                        Bulk Members
                    </Button>
                    <Button
                        variant={activeTab === 'achievements' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('achievements')}
                        className={activeTab === 'achievements' ? 'bg-blue-600 text-white' : ''}
                    >
                        Achievements
                    </Button>
                    <Button
                        variant={activeTab === 'videos' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('videos')}
                        className={activeTab === 'videos' ? 'bg-blue-600 text-white' : ''}
                    >
                        Video Lectures
                    </Button>
                    <Button
                        variant={activeTab === 'courses' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('courses')}
                        className={activeTab === 'courses' ? 'bg-blue-600 text-white' : ''}
                    >
                        Courses
                    </Button>
                    <Button
                        variant={activeTab === 'quizzes' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('quizzes')}
                        className={activeTab === 'quizzes' ? 'bg-blue-600 text-white' : ''}
                    >
                        Quizzes
                    </Button>
                </div>
            </div>
            <div className="grid gap-6">
                {activeTab === 'quizzes' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Create & Manage Quizzes</h2>
                        <Button className="mb-4 bg-blue-600 text-white" onClick={() => setShowQuizModal(true)}>Create Quiz</Button>
                        {/* Quiz Modal */}
                        {showQuizModal && (
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                                <div className="rounded-lg p-8 max-w-lg w-full relative border-2 border-blue-300 shadow-xl bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-blue-900" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                                    <button className="absolute top-2 right-2 text-gray-500 text-2xl" onClick={() => setShowQuizModal(false)} title="Close">×</button>
                                    <h3 className="text-xl font-bold mb-4">Create Quiz</h3>
                                    <form onSubmit={handleQuizSubmit} className="space-y-4">
                                        <div>
                                            <label className="block font-semibold mb-1">Quiz Title</label>
                                            <input type="text" className="w-full border rounded px-3 py-2" value={quizForm.title} onChange={e => handleQuizFormChange('title', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="block font-semibold mb-1">Thumbnail</label>
                                            <div className="flex gap-2 mb-2">
                                                <label className="flex items-center gap-2">
                                                    <input type="radio" name="thumbnailType" value="url" checked={quizForm.thumbnailType === 'url'} onChange={() => handleQuizFormChange('thumbnailType', 'url')} />
                                                    URL
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input type="radio" name="thumbnailType" value="upload" checked={quizForm.thumbnailType === 'upload'} onChange={() => handleQuizFormChange('thumbnailType', 'upload')} />
                                                    Upload
                                                </label>
                                            </div>
                                            {quizForm.thumbnailType === 'url' && (
                                                <input type="text" className="w-full border rounded px-3 py-2" value={quizForm.thumbnail} onChange={e => handleQuizFormChange('thumbnail', e.target.value)} placeholder="Thumbnail URL" />
                                            )}
                                            {quizForm.thumbnailType === 'upload' && (
                                                <input type="file" accept="image/*" className="w-full border rounded px-3 py-2" onChange={e => handleQuizFormChange('thumbnail', e.target.files[0])} />
                                            )}
                                        </div>
                                        <div>
                                            <label className="block font-semibold mb-1">Quiz Type</label>
                                            <select className="w-full border rounded px-3 py-2" value={quizMode} onChange={e => setQuizMode(e.target.value as 'manual' | 'gform')}>
                                                <option value="manual">Manual Creation</option>
                                                <option value="gform">Google Form Link</option>
                                            </select>
                                        </div>
                                        {quizMode === 'gform' && (
                                            <div>
                                                <label className="block font-semibold mb-1">Google Form Link</label>
                                                <input type="url" className="w-full border rounded px-3 py-2" value={quizForm.gformLink} onChange={e => handleQuizFormChange('gformLink', e.target.value)} required />
                                            </div>
                                        )}
                                        {quizMode === 'manual' && (
                                            <div>
                                                <label className="block font-semibold mb-2">Questions</label>
                                                <DragDropContext onDragEnd={result => {
                                                    if (!result.destination) return;
                                                    const reordered = Array.from(quizForm.questions);
                                                    const [removed] = reordered.splice(result.source.index, 1);
                                                    reordered.splice(result.destination.index, 0, removed);
                                                    setQuizForm(prev => ({ ...prev, questions: reordered }));
                                                }}>
                                                    <Droppable droppableId="questions-droppable">
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                                                {quizForm.questions.map((q, idx) => (
                                                                    <QuizQuestionDraggable key={idx} question={q} idx={idx}>
                                                                        <div className="border rounded p-3 mb-2">
                                                                            <input type="text" className="w-full border rounded px-2 py-1 mb-2" placeholder="Question" value={q.question} onChange={e => handleQuizQuestionChange(idx, 'question', e.target.value)} required />
                                                                            <div className="mb-2">
                                                                                <label className="block font-semibold mb-1">Options</label>
                                                                                {q.options.map((opt, oIdx) => (
                                                                                    <div key={oIdx} className="flex items-center mb-1">
                                                                                        <input type="text" className="flex-1 border rounded px-2 py-1" placeholder={`Option ${oIdx + 1}`} value={opt} onChange={e => handleQuizOptionChange(idx, oIdx, e.target.value)} required />
                                                                                        <button type="button" className="ml-2 text-red-500" onClick={() => handleRemoveQuizOption(idx, oIdx)} disabled={q.options.length <= 2}>Remove</button>
                                                                                    </div>
                                                                                ))}
                                                                                <button type="button" className="text-blue-600" onClick={() => handleAddQuizOption(idx)}>Add Option</button>
                                                                            </div>
                                                                            <div>
                                                                                <label className="block font-semibold mb-1">Correct Answer (option index)</label>
                                                                                <input type="number" min="0" max={q.options.length - 1} className="w-20 border rounded px-2 py-1" value={q.correctAnswer} onChange={e => handleQuizQuestionChange(idx, 'correctAnswer', Number(e.target.value))} required />
                                                                            </div>
                                                                            <button type="button" className="mt-2 text-red-500" onClick={() => handleRemoveQuizQuestion(idx)} disabled={quizForm.questions.length <= 1}>Remove Question</button>
                                                                        </div>
                                                                    </QuizQuestionDraggable>
                                                                ))}
                                                                {provided.placeholder}
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                </DragDropContext>
                                                <button type="button" className="text-blue-600" onClick={handleAddQuizQuestion}>Add Question</button>
                                            </div>
                                        )}
                                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={uploadingQuiz}>{uploadingQuiz ? 'Uploading...' : 'Create Quiz'}</button>
                                    </form>
                                </div>
                            </div>
                        )}
                        {/* Quiz List */}
                        <div className="grid gap-4 mt-8">
                            {quizzes.map((quiz) => (
                                <div key={quiz.id} className="flex items-center gap-4 bg-blue-900/10 p-4 rounded-lg">
                                    <img src={quiz.thumbnail} alt={quiz.title} className="w-24 h-24 object-cover rounded-lg" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">{quiz.title}</h4>
                                        <span className="text-sm text-blue-300">{quiz.type === 'manual' ? 'Manual Quiz' : 'Google Form'}</span>
                                        {quiz.type === 'gform' && quiz.gformLink && (
                                            <a href={quiz.gformLink} target="_blank" rel="noopener noreferrer" className="ml-4 text-blue-500 underline">Open Form</a>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEditQuiz(quiz)}
                                        >
                                            Edit
                                        </Button>
                                        {/* Edit Quiz Modal */}
                                        {showEditModal && (
                                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                                                <div className="rounded-lg p-8 max-w-lg w-full relative border-2 border-blue-300 shadow-xl bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-blue-900" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                                                    <button className="absolute top-2 right-2 text-gray-500 text-2xl" onClick={() => setShowEditModal(false)} title="Close">×</button>
                                                    <h3 className="text-xl font-bold mb-4">Edit Quiz</h3>
                                                    <form onSubmit={handleSaveEditedQuiz} className="space-y-4">
                                                        <div>
                                                            <label className="block font-semibold mb-1">Quiz Title</label>
                                                            <input type="text" className="w-full border rounded px-3 py-2" value={editQuizForm.title} onChange={e => handleEditQuizFormChange('title', e.target.value)} required />
                                                        </div>
                                                        <div>
                                                            <label className="block font-semibold mb-1">Thumbnail</label>
                                                            <div className="flex gap-2 mb-2">
                                                                <label className="flex items-center gap-2">
                                                                    <input type="radio" name="editThumbnailType" value="url" checked={editQuizForm.thumbnailType === 'url'} onChange={() => handleEditQuizFormChange('thumbnailType', 'url')} />
                                                                    URL
                                                                </label>
                                                                <label className="flex items-center gap-2">
                                                                    <input type="radio" name="editThumbnailType" value="upload" checked={editQuizForm.thumbnailType === 'upload'} onChange={() => handleEditQuizFormChange('thumbnailType', 'upload')} />
                                                                    Upload
                                                                </label>
                                                            </div>
                                                            {editQuizForm.thumbnailType === 'url' && (
                                                                <input type="text" className="w-full border rounded px-3 py-2" value={editQuizForm.thumbnail} onChange={e => handleEditQuizFormChange('thumbnail', e.target.value)} placeholder="Thumbnail URL" />
                                                            )}
                                                            {editQuizForm.thumbnailType === 'upload' && (
                                                                <input type="file" accept="image/*" className="w-full border rounded px-3 py-2" onChange={e => handleEditQuizFormChange('thumbnail', e.target.files[0])} />
                                                            )}
                                                        </div>
                                                        {editQuizForm.type === 'gform' ? (
                                                            <div>
                                                                <label className="block font-semibold mb-1">Google Form Link</label>
                                                                <input type="url" className="w-full border rounded px-3 py-2" value={editQuizForm.gformLink} onChange={e => handleEditQuizFormChange('gformLink', e.target.value)} required />
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <label className="block font-semibold mb-2">Questions</label>
                                                                <DragDropContext onDragEnd={result => {
                                                                    if (!result.destination) return;
                                                                    const reordered = Array.from(editQuizForm.questions);
                                                                    const [removed] = reordered.splice(result.source.index, 1);
                                                                    reordered.splice(result.destination.index, 0, removed);
                                                                    setEditQuizForm(prev => ({ ...prev, questions: reordered }));
                                                                }}>
                                                                    <Droppable droppableId="edit-questions-droppable">
                                                                        {(provided) => (
                                                                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                                                                {editQuizForm.questions.map((q, idx) => (
                                                                                    <QuizQuestionDraggable key={idx} question={q} idx={idx}>
                                                                                        <div className="border rounded p-3 mb-2">
                                                                                            <input type="text" className="w-full border rounded px-2 py-1 mb-2" placeholder="Question" value={q.question} onChange={e => handleEditQuizQuestionChange(idx, 'question', e.target.value)} required />
                                                                                            <div className="mb-2">
                                                                                                <label className="block font-semibold mb-1">Options</label>
                                                                                                {q.options.map((opt, oIdx) => (
                                                                                                    <div key={oIdx} className="flex items-center mb-1">
                                                                                                        <input type="text" className="flex-1 border rounded px-2 py-1" placeholder={`Option ${oIdx + 1}`} value={opt} onChange={e => handleEditQuizOptionChange(idx, oIdx, e.target.value)} required />
                                                                                                        <button type="button" className="ml-2 text-red-500" onClick={() => handleEditRemoveQuizOption(idx, oIdx)} disabled={q.options.length <= 2}>Remove</button>
                                                                                                    </div>
                                                                                                ))}
                                                                                                <button type="button" className="text-blue-600" onClick={() => handleEditAddQuizOption(idx)}>Add Option</button>
                                                                                            </div>
                                                                                            <div>
                                                                                                <label className="block font-semibold mb-1">Correct Answer (option index)</label>
                                                                                                <input type="number" min="0" max={q.options.length - 1} className="w-20 border rounded px-2 py-1" value={q.correctAnswer} onChange={e => handleEditQuizQuestionChange(idx, 'correctAnswer', Number(e.target.value))} required />
                                                                                            </div>
                                                                                            <button type="button" className="mt-2 text-red-500" onClick={() => handleEditRemoveQuizQuestion(idx)} disabled={editQuizForm.questions.length <= 1}>Remove Question</button>
                                                                                        </div>
                                                                                    </QuizQuestionDraggable>
                                                                                ))}
                                                                                {provided.placeholder}
                                                                            </div>
                                                                        )}
                                                                    </Droppable>
                                                                </DragDropContext>
                                                                <button type="button" className="text-blue-600" onClick={handleEditAddQuizQuestion}>Add Question</button>
                                                            </div>
                                                        )}
                                                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
                                                    </form>
                                                </div>
                                            </div>
                                        )}
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteQuiz(quiz.id)}>Delete</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* ...existing code... */}
                    </div>
                )}
                {activeTab === 'bulkmembers' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Bulk Members Upload</h2>
                        <BulkMemberUpload />
                    </div>
                )}
                {activeTab === 'courses' && (
                    <Card className="mb-8 medical-card shadow-xl max-w-xl">
                        <form className="p-6 space-y-4">
                            <h2 className="text-2xl font-bold mb-4 text-blue-900 dark:text-white">Create Course</h2>
                            <div>
                                <label className="block font-semibold text-blue-900 dark:text-white mb-1">Course Name</label>
                                <input type="text" required placeholder="Course Name" className="p-2 rounded w-full text-black border border-blue-300 focus:border-blue-600 focus:ring focus:ring-blue-200" />
                            </div>
                            <div>
                                <label className="block font-semibold text-blue-900 dark:text-white mb-1">Course Description</label>
                                <textarea required placeholder="Course Description" className="p-2 rounded w-full text-black border border-blue-300 focus:border-blue-600 focus:ring focus:ring-blue-200" />
                            </div>
                            <div>
                                <label className="block font-semibold text-blue-900 dark:text-white mb-1">Course Thumbnail</label>
                                <input type="file" accept="image/*" className="p-2 rounded w-full text-black border border-blue-300 focus:border-blue-600 focus:ring focus:ring-blue-200" />
                            </div>
                            <hr className="my-4 border-blue-200" />
                            <h3 className="font-semibold text-blue-900 dark:text-white mb-2">Add Section</h3>
                            <Card className="border p-4 mb-3 rounded bg-blue-50">
                                <span className="font-medium text-blue-900">Section 1</span>
                                <div className="mb-2 flex gap-4 mt-2">
                                    <label className="flex items-center gap-2 text-blue-900">
                                        <input type="radio" name="sectionType" value="video" checked={sectionType === 'video'} onChange={() => setSectionType('video')} /> Add Video
                                    </label>
                                    <label className="flex items-center gap-2 text-blue-900">
                                        <input type="radio" name="sectionType" value="quiz" checked={sectionType === 'quiz'} onChange={() => setSectionType('quiz')} /> Add Quiz
                                    </label>
                                </div>
                                {sectionType === 'video' && (
                                    <div>
                                        <label className="block font-medium text-blue-900 mb-1">Upload Link</label>
                                        <input type="text" className="p-2 rounded w-full text-black border border-blue-300 focus:border-blue-600 focus:ring focus:ring-blue-200" placeholder="Paste video link here" />
                                    </div>
                                )}
                                {sectionType === 'quiz' && (
                                    <div>
                                        <label className="block font-medium text-blue-900 mb-1">Quiz Type</label>
                                        <div className="flex gap-4 mb-2">
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="quizType" value="manual" checked={quizType === 'manual'} onChange={() => setQuizType('manual')} /> Manual Form
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="quizType" value="gform" checked={quizType === 'gform'} onChange={() => setQuizType('gform')} /> Google Form
                                            </label>
                                        </div>
                                        {quizType === 'manual' && (
                                            <div>
                                                <label className="block font-medium text-blue-900 mb-1">Manual Quiz Form (coming soon)</label>
                                            </div>
                                        )}
                                        {quizType === 'gform' && (
                                            <div>
                                                <label className="block font-medium text-blue-900 mb-1">Google Form Link</label>
                                                <input type="text" className="p-2 rounded w-full text-black border border-blue-300 focus:border-blue-600 focus:ring focus:ring-blue-200" placeholder="Paste Google Form link here" />
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="mt-4 text-right">
                                    <Button type="button">Add another section</Button>
                                </div>
                            </Card>
                            {/* ...existing code... */}
                        </form>
                    </Card>
                )}
                {activeTab === 'videos' && (
                    loadingVideos ? (<p>Loading pending video lectures...</p>) : pendingVideos.length === 0 ? (<p>No pending video lectures for approval.</p>) : (
                        pendingVideos.map((video) => (
                            <Card key={video.id} className="medical-card text-blue-900 dark:text-white p-6 card-hover">
                                {video.thumbnail && (
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                        onError={e => (e.currentTarget.src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop")}
                                    />
                                )}
                                <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
                                <div className="mb-2 text-sm text-gray-300">
                                    <span className="font-semibold">Instructor:</span> {video.instructor}<br />
                                    <span className="font-semibold">Subject:</span> {video.subject}<br />
                                    <span className="font-semibold">Uploaded By:</span> {video.uploadedBy}<br />
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold">Description:</span>
                                    <p className="text-gray-200 mt-1">{video.description}</p>
                                </div>
                                <Badge className="mb-2">Pending</Badge>
                                <div className="flex gap-2 mb-2">
                                    {video.videoUrl && (
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                            onClick={() => window.open(video.videoUrl, '_blank', 'noopener,noreferrer')}
                                        >
                                            View Video
                                        </Button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleApproveVideo(video.id)} className="bg-green-600 hover:bg-green-700 text-white">Approve</Button>
                                    <Button onClick={() => handleRejectVideo(video.id)} className="bg-red-600 hover:bg-red-700 text-white">Reject</Button>
                                </div>
                            </Card>
                        ))
                    )
                )}
                {activeTab === 'journals' && (
                    loadingJournals ? (<p>Loading pending journals...</p>) : pendingJournals.length === 0 ? (<p>No pending journals for approval.</p>) : (
                        pendingJournals.map((journal) => (
                            <Card key={journal.id} className="medical-card text-blue-900 dark:text-white p-6 card-hover">
                                {journal.imageUrl && (
                                    <img
                                        src={journal.imageUrl}
                                        alt={journal.title}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                        onError={e => (e.currentTarget.src = "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop")}
                                    />
                                )}
                                <h2 className="text-xl font-semibold mb-2">{journal.title}</h2>
                                <div className="mb-2 text-sm text-gray-300">
                                    <span className="font-semibold">Authors:</span> {journal.authors}<br />
                                    <span className="font-semibold">Journal:</span> {journal.journal}<br />
                                    <span className="font-semibold">Category:</span> {journal.category}<br />
                                    <span className="font-semibold">Published:</span> {journal.publishedDate}<br />
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold">Abstract:</span>
                                    <p className="text-gray-200 mt-1">{journal.abstract}</p>
                                </div>
                                <Badge className="mb-2">Pending</Badge>
                                <div className="flex gap-2 mb-2">
                                    {journal.pdfUrl && (
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = journal.pdfUrl;
                                                link.download = `${journal.title}.pdf`;
                                                link.target = '_blank';
                                                link.click();
                                            }}
                                        >
                                            Download PDF
                                        </Button>
                                    )}
                                    {journal.externalUrl && (
                                        <Button
                                            className="bg-gray-600 hover:bg-gray-700 text-white"
                                            onClick={() => window.open(journal.externalUrl, '_blank', 'noopener,noreferrer')}
                                        >
                                            External Link
                                        </Button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleApproveJournal(journal.id)} className="bg-green-600 hover:bg-green-700 text-white">Approve</Button>
                                    <Button onClick={() => handleRejectJournal(journal.id)} className="bg-red-600 hover:bg-red-700 text-white">Reject</Button>
                                </div>
                            </Card>
                        ))
                    )
                )}
                {activeTab === 'blogs' && (
                    loadingBlogs ? (<p>Loading pending blogs...</p>) : pendingBlogs.length === 0 ? (<p>No pending blogs for approval.</p>) : (
                        pendingBlogs.map((blog) => (
                            <Card key={blog.id} className="medical-card text-blue-900 dark:text-white p-6 card-hover">
                                {blog.image && (
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                        onError={e => (e.currentTarget.src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop")}
                                    />
                                )}
                                <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                                <div className="mb-2 text-sm text-gray-300">
                                    <span className="font-semibold">Author:</span> {blog.author}<br />
                                    <span className="font-semibold">Category:</span> {blog.category}<br />
                                    <span className="font-semibold">Published:</span> {blog.publishedDate}<br />
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold">Excerpt:</span>
                                    <p className="text-gray-200 mt-1">{blog.excerpt}</p>
                                </div>
                                <Badge className="mb-2">Pending</Badge>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleApproveBlog(blog.id)} className="bg-green-600 hover:bg-green-700 text-white">Approve</Button>
                                    <Button onClick={() => handleRejectBlog(blog.id)} className="bg-red-600 hover:bg-red-700 text-white">Reject</Button>
                                </div>
                            </Card>
                        ))
                    )
                )}
                {activeTab === 'achievements' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Manage Achievements (Homepage Stats)</h2>
                        <Card className="mb-8 medical-card shadow-xl max-w-xl">
                            <form className="p-6 space-y-4" onSubmit={handleAchievementSubmit}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon <span className="text-red-500">*</span></label>
                                    <select required className="p-2 rounded w-full text-black" value={achievementForm.icon} onChange={e => setAchievementForm(f => ({ ...f, icon: e.target.value }))}>
                                        <option value="">Select Icon</option>
                                        {achievementIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Value <span className="text-red-500">*</span></label>
                                    <input type="text" required placeholder="Achievement Value" className="p-2 rounded w-full text-black" value={achievementForm.value} onChange={e => setAchievementForm(f => ({ ...f, value: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Label <span className="text-red-500">*</span></label>
                                    <input type="text" required placeholder="Achievement Label" className="p-2 rounded w-full text-black" value={achievementForm.label} onChange={e => setAchievementForm(f => ({ ...f, label: e.target.value }))} />
                                </div>
                                <div className="flex space-x-4">
                                    <Button type="submit" className="btn-medical shadow-lg">{editingAchievementId ? 'Update' : 'Add'} Achievement</Button>
                                    <Button type="button" variant="outline" onClick={() => { setEditingAchievementId(null); setAchievementForm({ icon: '', value: '', label: '', isStatic: false, staticIndex: null }); }}>Cancel</Button>
                                </div>
                            </form>
                        </Card>
                        <div className="grid gap-4">
                            {staticAchievements.map((a, idx) => (
                                <Card key={"static-" + idx} className="medical-card text-blue-900 dark:text-white p-4 flex items-center gap-4 card-hover">
                                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mr-4">
                                        <span className="text-lg font-bold">{a.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-lg">{a.value}</div>
                                        <div className="text-sm">{a.label}</div>
                                    </div>
                                    <Button className="btn-medical mr-2" onClick={() => handleEditAchievement(a, idx, true)}>Edit</Button>
                                    <Button className="bg-red-600 text-white" onClick={() => handleDeleteAchievement(null, idx, true)}>Delete</Button>
                                </Card>
                            ))}
                            {achievements.map((a, idx) => (
                                <Card key={a.id || idx} className="medical-card text-blue-900 dark:text-white p-4 flex items-center gap-4 card-hover">
                                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mr-4">
                                        <span className="text-lg font-bold">{a.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-lg">{a.value}</div>
                                        <div className="text-sm">{a.label}</div>
                                    </div>
                                    <Button className="btn-medical mr-2" onClick={() => handleEditAchievement(a)}>Edit</Button>
                                    <Button className="bg-red-600 text-white" onClick={() => handleDeleteAchievement(a.id)}>Delete</Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'members' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Manage Members</h2>
                        <Card className="mb-8 medical-card shadow-xl max-w-xl">
                            <form className="p-6 space-y-4" onSubmit={async e => {
                                e.preventDefault();
                                let pictureUrl = '';
                                if (memberForm.picture) {
                                    const fileRef = ref(storage, `members/${Date.now()}_${memberForm.picture.name}`);
                                    await uploadBytes(fileRef, memberForm.picture);
                                    pictureUrl = await getDownloadURL(fileRef);
                                }
                                if (memberForm.isStatic) {
                                    // Update static member
                                    setStaticMembers(prev => prev.map((m, idx) => idx === memberForm.staticIndex ? {
                                        ...m,
                                        name: memberForm.name,
                                        institution: memberForm.institution,
                                        designation: memberForm.designation,
                                        phone: memberForm.phone,
                                        pictureUrl: pictureUrl || m.pictureUrl,
                                    } : m));
                                } else if (editingMemberId) {
                                    // Update Firestore member
                                    const memberDoc = doc(db, "members", editingMemberId);
                                    await updateDoc(memberDoc, {
                                        name: memberForm.name,
                                        institution: memberForm.institution,
                                        email: memberForm.email,
                                        designation: memberForm.designation,
                                        phone: memberForm.phone,
                                        ...(pictureUrl ? { pictureUrl } : {}),
                                    });
                                    setEditingMemberId(null);
                                } else {
                                    // Add Firestore member
                                    const membersCol = collection(db, "members");
                                    const newMember = {
                                        name: memberForm.name,
                                        institution: memberForm.institution,
                                        email: memberForm.email,
                                        designation: memberForm.designation,
                                        phone: memberForm.phone,
                                        pictureUrl,
                                    };
                                    await addDoc(membersCol, newMember);
                                }
                                setMemberForm({ name: '', institution: '', email: '', designation: '', phone: '', picture: null, isStatic: false, staticIndex: null });
                                // Refresh members list
                                const membersCol = collection(db, "members");
                                const querySnapshot = await getDocs(membersCol);
                                setMembers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                            }}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name <span className="text-red-500">*</span></label>
                                    <input type="text" required placeholder="Full name" className="p-2 rounded w-full text-black" value={memberForm.name} onChange={e => setMemberForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Institution/College <span className="text-red-500">*</span></label>
                                    <input type="text" required placeholder="Institution/College" className="p-2 rounded w-full text-black" value={memberForm.institution} onChange={e => setMemberForm(f => ({ ...f, institution: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Picture <span className="text-red-500">*</span></label>
                                    <input type="file" required accept="image/*" className="p-2 rounded w-full text-black" onChange={e => setMemberForm(f => ({ ...f, picture: e.target.files[0] }))} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                        <input type="email" placeholder="Email address" className="p-2 rounded w-full text-black" value={memberForm.email} onChange={e => setMemberForm(f => ({ ...f, email: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone (with country code)</label>
                                        <input type="tel" placeholder="+91 9876543210" className="p-2 rounded w-full text-black" value={memberForm.phone || ''} onChange={e => setMemberForm(f => ({ ...f, phone: e.target.value }))} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Designation</label>
                                    <input type="text" placeholder="Designation/Role" className="p-2 rounded w-full text-black" value={memberForm.designation} onChange={e => setMemberForm(f => ({ ...f, designation: e.target.value }))} />
                                </div>
                                <div className="flex space-x-4">
                                    <Button type="submit" className="btn-medical shadow-lg">{editingMemberId ? 'Update Member' : 'Add Member'}</Button>
                                    <Button type="button" variant="outline" onClick={() => { setEditingMemberId(null); setMemberForm({ name: '', institution: '', email: '', designation: '', phone: '', picture: null, isStatic: false, staticIndex: null }); }}>Cancel</Button>
                                </div>
                            </form>
                        </Card>
                        <div className="grid gap-4">
                            {staticMembers.map((m, idx) => (
                                <Card key={"static-" + idx} className="medical-card text-blue-900 dark:text-white p-4 flex items-center gap-4 card-hover">
                                    <img src={m.pictureUrl} alt={m.name} className="h-16 w-16 rounded-full object-cover" />
                                    <div className="flex-1">
                                        <div className="font-bold text-lg">{m.name}</div>
                                        <div className="text-sm">{m.institution}</div>
                                        <div className="text-sm">{m.designation}</div>
                                    </div>
                                    <Button className="btn-medical mr-2" onClick={() => {
                                        setMemberForm({
                                            name: m.name,
                                            institution: m.institution,
                                            email: '',
                                            designation: m.designation,
                                            phone: m.phone || '',
                                            picture: null,
                                            isStatic: true,
                                            staticIndex: idx,
                                        });
                                        setEditingMemberId(null);
                                    }}>Edit</Button>
                                    <Button className="bg-red-600 text-white" onClick={() => {
                                        if (window.confirm('Delete this static member?')) {
                                            setStaticMembers(prev => prev.filter((_, i) => i !== idx));
                                        }
                                    }}>Delete</Button>
                                </Card>
                            ))}
                            {members.map((m, idx) => (
                                <Card key={m.id || idx} className="medical-card text-blue-900 dark:text-white p-4 flex items-center gap-4 card-hover">
                                    <img src={m.pictureUrl || m.picture} alt={m.name} className="h-16 w-16 rounded-full object-cover" />
                                    <div className="flex-1">
                                        <div className="font-bold text-lg">{m.name}</div>
                                        <div className="text-sm">{m.institution}</div>
                                        <div className="text-sm">{m.email}</div>
                                        <div className="text-sm">{m.designation}</div>
                                    </div>
                                    <Button className="btn-medical mr-2" onClick={() => {
                                        setEditingMemberId(m.id);
                                        setMemberForm({
                                            name: m.name,
                                            institution: m.institution,
                                            email: m.email,
                                            designation: m.designation,
                                            phone: m.phone || '',
                                            picture: null,
                                            isStatic: false,
                                            staticIndex: null,
                                        });
                                    }}>Edit</Button>
                                    <Button className="bg-red-600 text-white" onClick={async () => {
                                        if (window.confirm('Delete this member?')) {
                                            await deleteDoc(doc(db, "members", m.id));
                                            setMembers(members.filter(mem => mem.id !== m.id));
                                        }
                                    }}>Delete</Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPanel;
