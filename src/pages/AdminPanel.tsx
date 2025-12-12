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
import { LogOut, User, ArrowLeft, LayoutDashboard, Plus, Edit, Trash2, CheckCircle, XCircle, Eye } from "lucide-react";
import { Menu, MenuItem } from "@mui/material";
import { db, storage } from "../firebase";
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import BulkMemberUpload from "../components/BulkMemberUpload";

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

interface RCMember {
    id: string;
    name: string;
    institution: string;
    email: string;
    designation: string;
    phone: string;
    pictureUrl?: string;
}

interface Quiz {
    id: string;
    title: string;
    thumbnail: string;
    type: 'manual' | 'gform';
    questions?: any[];
    gformLink?: string;
    createdAt: any;
    duration?: number; // in minutes
}

interface Achievement {
    id: string;
    icon: string;
    value: string;
    label: string;
}

interface SmakAIEnquiry {
    id: string;
    fullName: string;
    organisation: string;
    designation: string;
    email: string;
    phone: string;
    sector: string;
    geography: string;
    therapyArea: string;
    projectType: string;
    sampleSize: string;
    startDate: string;
    deliverables: string;
    objective: string;
    submittedAt: any;
    status: string;
}

const AdminPanel: React.FC = () => {
    const adminTabs = [
        { key: 'journals', label: 'Journals' },
        { key: 'blogs', label: 'Blogs' },
        { key: 'members', label: 'Members' },
        { key: 'researchclubmembers', label: 'Research Club Members' },
        { key: 'researchclubmentors', label: 'Research Club Mentors' },
        { key: 'bulkmembers', label: 'Bulk Members' },
        { key: 'achievements', label: 'Achievements' },
        { key: 'videos', label: 'Video Lectures' },
        { key: 'courses', label: 'Courses' },
        { key: 'quizzes', label: 'Quizzes' },
        { key: 'smakaienquiries', label: 'SMAK AI Enquiries' }
    ];
    
    // Research Club Members state
    const [rcMembers, setRCMembers] = useState<RCMember[]>([]);
    const [rcMemberForm, setRCMemberForm] = useState({
        name: '',
        institution: '',
        email: '',
        designation: '',
        phone: '',
        picture: null as File | null,
    });
    const [editingRCMemberId, setEditingRCMemberId] = useState<string | null>(null);

    // Research Club Mentors state
    const [rcMentors, setRCMentors] = useState<RCMember[]>([]);
    const [rcMentorForm, setRCMentorForm] = useState({
        name: '',
        institution: '',
        email: '',
        designation: '',
        phone: '',
        picture: null as File | null,
    });
    const [editingRCMentorId, setEditingRCMentorId] = useState<string | null>(null);

    // State for editing quiz
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
    const [editQuizForm, setEditQuizForm] = useState({
        title: '',
        thumbnail: '',
        thumbnailType: 'url',
        questions: [{ question: '', options: ['', ''], correctAnswer: 0 }],
        gformLink: '',
        type: 'manual',
        duration: 10,
    });
    const [showEditModal, setShowEditModal] = useState(false);

    // State declarations for quizzes section
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [quizForm, setQuizForm] = useState({
        title: '',
        thumbnail: '',
        thumbnailType: 'url',
        gformLink: '',
        questions: [{ question: '', options: ['', ''], correctAnswer: 0 }],
        duration: 10,
    });
    const [quizMode, setQuizMode] = useState<'manual' | 'gform'>('manual');
    const [uploadingQuiz, setUploadingQuiz] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);

    // Dynamic course sections state
    const [courseSections, setCourseSections] = useState([
        {
            sectionType: 'video',
            quizType: 'manual',
            quizTitle: '',
            quizThumbnail: '',
            questions: [{ question: '', options: ['', ''], correctAnswer: 0 }],
            videoLink: '',
            gformLink: ''
        }
    ]);
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [courseThumbnailType, setCourseThumbnailType] = useState('url');
    const [courseThumbnail, setCourseThumbnail] = useState('');
    const [courseThumbnailFile, setCourseThumbnailFile] = useState<File | null>(null);
    const [savingCourse, setSavingCourse] = useState(false);

    // SMAK AI Enquiries state
    const [smakAIEnquiries, setSmakAIEnquiries] = useState<SmakAIEnquiry[]>([]);
    const [loadingSMakAI, setLoadingSMakAI] = useState(false);

    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };
    const handleSignOut = () => {
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
    const [activeTab, setActiveTab] = useState<'journals' | 'blogs' | 'members' | 'achievements' | 'videos' | 'bulkmembers' | 'quizzes' | 'courses' | 'researchclubmembers' | 'researchclubmentors' | 'smakaienquiries'>('journals');

    // Achievements state
    const defaultAchievements = [
        { icon: 'Trophy', value: '2024', label: 'Established' },
        { icon: 'Users', value: '1000+', label: 'Active Members' },
        { icon: 'BookOpen', value: '200+', label: 'Research Papers' },
        { icon: 'Globe', value: '50+', label: 'Partner Colleges' }
    ];
    const [staticAchievements, setStaticAchievements] = useState(() => {
        const local = localStorage.getItem('staticAchievements');
        if (local) {
            try {
                return JSON.parse(local);
            } catch { }
        }
        return defaultAchievements;
    });
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [achievementForm, setAchievementForm] = useState({
        icon: '',
        value: '',
        label: '',
        isStatic: false,
        staticIndex: null as number | null,
    });
    const [editingAchievementId, setEditingAchievementId] = useState<string | null>(null);
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
    const [members, setMembers] = useState<any[]>([]);
    const [memberForm, setMemberForm] = useState({
        name: '',
        institution: '',
        email: '',
        designation: '',
        phone: '',
        picture: null as File | null,
        isStatic: false,
        staticIndex: null as number | null,
    });
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

    // Fetch Research Club Members and Mentors
    useEffect(() => {
        const fetchRCMembers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "researchClubMembers"));
                const membersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as RCMember));
                setRCMembers(membersList);
            } catch (error) {
                console.error("Error fetching research club members:", error);
            }
        };

        const fetchRCMentors = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "researchClubMentors"));
                const mentorsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as RCMember));
                setRCMentors(mentorsList);
            } catch (error) {
                console.error("Error fetching research club mentors:", error);
            }
        };

        if (activeTab === 'researchclubmembers') {
            fetchRCMembers();
        }
        if (activeTab === 'researchclubmentors') {
            fetchRCMentors();
        }
    }, [activeTab]);

    // Fetch other data
    useEffect(() => {
        const fetchQuizzes = async () => {
            const querySnapshot = await getDocs(collection(db, "quizzes"));
            setQuizzes(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Quiz)));
        };

        const fetchPendingJournals = async () => {
            setLoadingJournals(true);
            const querySnapshot = await getDocs(collection(db, "journals"));
            const pending = querySnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() } as Journal))
                .filter((journal) => journal.status === "pending");
            setPendingJournals(pending);
            setLoadingJournals(false);
        };

        const fetchPendingVideos = async () => {
            setLoadingVideos(true);
            const querySnapshot = await getDocs(collection(db, "videoLectures"));
            const pending = querySnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() } as VideoLectureAdmin))
                .filter((video) => video.status === "pending");
            setPendingVideos(pending);
            setLoadingVideos(false);
        };

        const fetchPendingBlogs = async () => {
            setLoadingBlogs(true);
            const querySnapshot = await getDocs(collection(db, "blogs"));
            const pending = querySnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() } as Blog))
                .filter((blog) => blog.status === "pending");
            setPendingBlogs(pending);
            setLoadingBlogs(false);
        };

        const fetchMembers = async () => {
            const querySnapshot = await getDocs(collection(db, "members"));
            const membersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setMembers(membersList);
        };

        const fetchAchievements = async () => {
            const querySnapshot = await getDocs(collection(db, "achievements"));
            const achievementsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Achievement));
            setAchievements(achievementsList);
        };

        const fetchSmakAIEnquiries = async () => {
            setLoadingSMakAI(true);
            try {
                const querySnapshot = await getDocs(collection(db, "smakAIEnquiries"));
                const enquiries = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SmakAIEnquiry));
                setSmakAIEnquiries(enquiries.sort((a, b) => b.submittedAt - a.submittedAt));
            } catch (error) {
                console.error("Error fetching SMAK AI enquiries:", error);
            }
            setLoadingSMakAI(false);
        };

        fetchQuizzes();
        fetchPendingJournals();
        fetchPendingVideos();
        fetchPendingBlogs();
        fetchMembers();
        fetchAchievements();
        fetchSmakAIEnquiries();
    }, []);

    // Quiz handlers
    const handleQuizFormChange = (field: string, value: any) => {
        setQuizForm(prev => ({ ...prev, [field]: value }));
    };

    const handleQuizQuestionChange = (idx: number, field: string, value: any) => {
        setQuizForm(prev => {
            const updated = [...prev.questions];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, questions: updated };
        });
    };

    const handleAddQuizQuestion = () => {
        setQuizForm(prev => ({ 
            ...prev, 
            questions: [...prev.questions, { question: '', options: ['', ''], correctAnswer: 0 }] 
        }));
    };

    const handleRemoveQuizQuestion = (idx: number) => {
        setQuizForm(prev => ({ 
            ...prev, 
            questions: prev.questions.filter((_, i) => i !== idx) 
        }));
    };

    const handleQuizOptionChange = (qIdx: number, optIdx: number, value: string) => {
        setQuizForm(prev => {
            const updated = [...prev.questions];
            updated[qIdx].options[optIdx] = value;
            return { ...prev, questions: updated };
        });
    };

    const handleAddQuizOption = (qIdx: number) => {
        setQuizForm(prev => {
            const updated = [...prev.questions];
            updated[qIdx].options.push('');
            return { ...prev, questions: updated };
        });
    };

    const handleRemoveQuizOption = (qIdx: number, optIdx: number) => {
        setQuizForm(prev => {
            const updated = [...prev.questions];
            updated[qIdx].options = updated[qIdx].options.filter((_, i) => i !== optIdx);
            return { ...prev, questions: updated };
        });
    };

    const handleQuizSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadingQuiz(true);
        try {
            const quizData = {
                title: quizForm.title,
                thumbnail: quizForm.thumbnail,
                type: quizMode,
                questions: quizMode === 'manual' ? quizForm.questions : [],
                gformLink: quizMode === 'gform' ? quizForm.gformLink : '',
                createdAt: new Date(),
                duration: quizForm.duration || 10,
            };
            await addDoc(collection(db, "quizzes"), quizData);
            setQuizForm({ 
                title: '', 
                thumbnail: '', 
                thumbnailType: 'url', 
                gformLink: '', 
                questions: [{ question: '', options: ['', ''], correctAnswer: 0 }],
                duration: 10,
            });
            setShowQuizModal(false);
            
            // Refresh quizzes
            const querySnapshot = await getDocs(collection(db, "quizzes"));
            setQuizzes(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Quiz)));
        } catch (error) {
            console.error("Error creating quiz:", error);
            alert('Failed to create quiz.');
        } finally {
            setUploadingQuiz(false);
        }
    };

    // Edit quiz handlers
    const handleEditQuiz = (quiz: Quiz) => {
        setEditingQuiz(quiz);
        setEditQuizForm({
            title: quiz.title || '',
            thumbnail: quiz.thumbnail || '',
            thumbnailType: quiz.thumbnail ? 'url' : 'upload',
            questions: quiz.questions || [{ question: '', options: ['', ''], correctAnswer: 0 }],
            gformLink: quiz.gformLink || '',
            type: quiz.type || 'manual',
            duration: quiz.duration || 10,
        });
        setShowEditModal(true);
    };

    const handleEditQuizFormChange = (field: string, value: any) => {
        setEditQuizForm(prev => ({ ...prev, [field]: value }));
    };

    const handleEditQuizQuestionChange = (idx: number, field: string, value: any) => {
        setEditQuizForm(prev => {
            const updated = [...prev.questions];
            updated[idx] = { ...updated[idx], [field]: value };
            return { ...prev, questions: updated };
        });
    };

    const handleEditAddQuizQuestion = () => {
        setEditQuizForm(prev => ({ 
            ...prev, 
            questions: [...prev.questions, { question: '', options: ['', ''], correctAnswer: 0 }] 
        }));
    };

    const handleEditRemoveQuizQuestion = (idx: number) => {
        setEditQuizForm(prev => ({ 
            ...prev, 
            questions: prev.questions.filter((_, i) => i !== idx) 
        }));
    };

    const handleEditQuizOptionChange = (qIdx: number, optIdx: number, value: string) => {
        setEditQuizForm(prev => {
            const updated = [...prev.questions];
            updated[qIdx].options[optIdx] = value;
            return { ...prev, questions: updated };
        });
    };

    const handleEditAddQuizOption = (qIdx: number) => {
        setEditQuizForm(prev => {
            const updated = [...prev.questions];
            updated[qIdx].options.push('');
            return { ...prev, questions: updated };
        });
    };

    const handleEditRemoveQuizOption = (qIdx: number, optIdx: number) => {
        setEditQuizForm(prev => {
            const updated = [...prev.questions];
            updated[qIdx].options = updated[qIdx].options.filter((_, i) => i !== optIdx);
            return { ...prev, questions: updated };
        });
    };

    const handleSaveEditedQuiz = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingQuiz) return;
        try {
            const updateData: any = {
                title: editQuizForm.title,
                thumbnail: editQuizForm.thumbnail,
                duration: editQuizForm.duration || 10,
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
            setQuizzes(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Quiz)));
        } catch (err) {
            alert('Failed to update quiz.');
        }
    };

    const handleDeleteQuiz = async (quizId: string) => {
        if (!window.confirm('Are you sure you want to delete this quiz?')) return;
        try {
            await deleteDoc(doc(db, 'quizzes', quizId));
            setQuizzes(prev => prev.filter(q => q.id !== quizId));
        } catch (err) {
            alert('Failed to delete quiz.');
        }
    };

    // Achievement CRUD handlers
    const handleAchievementSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (achievementForm.isStatic && achievementForm.staticIndex !== null) {
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
        setAchievements(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Achievement)));
    };

    const handleEditAchievement = (ach: any, idx: number | null = null, isStatic: boolean = false) => {
        if (isStatic && idx !== null) {
            setAchievementForm({ 
                icon: ach.icon, 
                value: ach.value, 
                label: ach.label, 
                isStatic: true, 
                staticIndex: idx 
            });
            setEditingAchievementId(null);
        } else {
            setEditingAchievementId(ach.id);
            setAchievementForm({ 
                icon: ach.icon, 
                value: ach.value, 
                label: ach.label, 
                isStatic: false, 
                staticIndex: null 
            });
        }
    };

    const handleDeleteAchievement = async (id: string | null, idx: number | null = null, isStatic: boolean = false) => {
        if (isStatic && idx !== null) {
            if (window.confirm('Delete this static achievement?')) {
                setStaticAchievements(prev => {
                    const updated = prev.filter((_, i) => i !== idx);
                    localStorage.setItem('staticAchievements', JSON.stringify(updated));
                    return updated;
                });
            }
        } else if (id) {
            if (window.confirm('Delete this achievement?')) {
                await deleteDoc(doc(db, "achievements", id));
                setAchievements(achievements.filter(a => a.id !== id));
            }
        }
    };

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

    // Course handlers
    const handleCourseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingCourse(true);
        try {
            let thumbnailUrl = '';
            if (courseThumbnailType === 'upload' && courseThumbnailFile) {
                const storageRef = ref(storage, `courseThumbnails/${Date.now()}_${courseThumbnailFile.name}`);
                await uploadBytes(storageRef, courseThumbnailFile);
                thumbnailUrl = await getDownloadURL(storageRef);
            } else if (courseThumbnailType === 'url' && courseThumbnail) {
                thumbnailUrl = courseThumbnail;
            }
            
            const courseData = {
                name: courseName,
                description: courseDescription,
                thumbnail: thumbnailUrl,
                sections: courseSections,
                createdAt: new Date()
            };
            
            await addDoc(collection(db, 'courses'), courseData);
            
            // Reset form
            setCourseName('');
            setCourseDescription('');
            setCourseThumbnail('');
            setCourseThumbnailFile(null);
            setCourseThumbnailType('url');
            setCourseSections([{
                sectionType: 'video',
                quizType: 'manual',
                quizTitle: '',
                quizThumbnail: '',
                questions: [{ question: '', options: ['', ''], correctAnswer: 0 }],
                videoLink: '',
                gformLink: ''
            }]);
            
            alert('Course created successfully!');
        } catch (error) {
            console.error("Error creating course:", error);
            alert('Failed to create course.');
        } finally {
            setSavingCourse(false);
        }
    };

    // Member handlers
    const handleMemberSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let pictureUrl = '';
            if (memberForm.picture) {
                const fileRef = ref(storage, `members/${Date.now()}_${memberForm.picture.name}`);
                await uploadBytes(fileRef, memberForm.picture);
                pictureUrl = await getDownloadURL(fileRef);
            }
            
            if (memberForm.isStatic && memberForm.staticIndex !== null) {
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
            
            setMemberForm({ 
                name: '', 
                institution: '', 
                email: '', 
                designation: '', 
                phone: '', 
                picture: null, 
                isStatic: false, 
                staticIndex: null 
            });
            
            // Refresh members list
            const membersCol = collection(db, "members");
            const querySnapshot = await getDocs(membersCol);
            setMembers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error handling member:", error);
            alert('Failed to save member.');
        }
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
        <div className="min-h-screen bg-gradient-to-br from-[rgb(15,23,42)] via-blue-900 to-[rgb(15,23,42)] text-white">
            {/* Navbar */}
            <nav className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 shadow-lg border-b border-blue-300/20 backdrop-blur-sm">
                <button
                    className="flex items-center gap-2 text-white hover:text-blue-200 font-semibold text-lg transition-all duration-200 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30"
                    onClick={() => navigate("/dashboard")}
                >
                    <ArrowLeft size={22} />
                    Back to Dashboard
                </button>
                <span className="text-2xl font-bold tracking-wide text-white bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Admin Panel</span>
                <div>
                    <button
                        className="flex items-center gap-2 text-white hover:text-blue-200 font-semibold text-lg px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 transition-all duration-200"
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
                        PaperProps={{
                            className: "bg-blue-800/90 backdrop-blur-sm border border-blue-600/50 text-white mt-2"
                        }}
                    >
                        <MenuItem onClick={() => { handleUserMenuClose(); navigate("/dashboard"); }} className="hover:bg-blue-700/50">
                            <LayoutDashboard size={18} className="mr-2" /> Dashboard
                        </MenuItem>
                        <MenuItem onClick={() => { handleUserMenuClose(); handleSignOut(); }} className="hover:bg-blue-700/50">
                            <LogOut size={18} className="mr-2" /> Sign Out
                        </MenuItem>
                    </Menu>
                </div>
            </nav>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8 mt-8 animate-fade-in">
                <div className="flex gap-2 bg-blue-800/30 backdrop-blur-sm rounded-xl p-2 border border-blue-600/30">
                    {adminTabs.map((tab) => (
                        <Button
                            key={tab.key}
                            variant={activeTab === tab.key ? 'default' : 'ghost'}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === tab.key
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-blue-200 hover:text-white hover:bg-blue-600/50'
                                }`}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pb-8">
                {/* Research Club Members Section */}
                {activeTab === 'researchclubmembers' && (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Manage Research Club Members</h2>
                        <Card className="medical-card shadow-2xl max-w-4xl bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-blue-600/30">
                            <form className="p-8 space-y-6" onSubmit={async e => {
                                e.preventDefault();
                                let pictureUrl = '';
                                if (rcMemberForm.picture) {
                                    const storageRef = ref(storage, `rcMemberPictures/${Date.now()}_${rcMemberForm.picture.name}`);
                                    await uploadBytes(storageRef, rcMemberForm.picture);
                                    pictureUrl = await getDownloadURL(storageRef);
                                }
                                if (editingRCMemberId) {
                                    const memberDoc = doc(db, "researchClubMembers", editingRCMemberId);
                                    await updateDoc(memberDoc, {
                                        name: rcMemberForm.name,
                                        institution: rcMemberForm.institution,
                                        email: rcMemberForm.email,
                                        designation: rcMemberForm.designation,
                                        phone: rcMemberForm.phone,
                                        ...(pictureUrl ? { pictureUrl } : {})
                                    });
                                    setEditingRCMemberId(null);
                                } else {
                                    await addDoc(collection(db, "researchClubMembers"), {
                                        name: rcMemberForm.name,
                                        institution: rcMemberForm.institution,
                                        email: rcMemberForm.email,
                                        designation: rcMemberForm.designation,
                                        phone: rcMemberForm.phone,
                                        pictureUrl
                                    });
                                }
                                setRCMemberForm({ name: '', institution: '', email: '', designation: '', phone: '', picture: null });
                                // Refresh list
                                const querySnapshot = await getDocs(collection(db, "researchClubMembers"));
                                setRCMembers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as RCMember)));
                            }}>
                                <h3 className="text-xl font-semibold text-blue-200 mb-4">
                                    {editingRCMemberId ? 'Edit Research Club Member' : 'Add New Research Club Member'}
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-blue-200">Name *</label>
                                        <input 
                                            type="text" 
                                            
                                            placeholder="Full Name" 
                                            className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                            value={rcMemberForm.name} 
                                            onChange={e => setRCMemberForm(f => ({ ...f, name: e.target.value }))} 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-blue-200">Institution </label>
                                        <input 
                                            type="text" 
                                            
                                            placeholder="Institution/College" 
                                            className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                            value={rcMemberForm.institution} 
                                            onChange={e => setRCMemberForm(f => ({ ...f, institution: e.target.value }))} 
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-blue-200">Email </label>
                                        <input 
                                            type="email" 
                                            
                                            placeholder="Email Address" 
                                            className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                            value={rcMemberForm.email} 
                                            onChange={e => setRCMemberForm(f => ({ ...f, email: e.target.value }))} 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-blue-200">Phone</label>
                                        <input 
                                            type="text" 
                                            placeholder="Phone Number" 
                                            className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                            value={rcMemberForm.phone} 
                                            onChange={e => setRCMemberForm(f => ({ ...f, phone: e.target.value }))} 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-blue-200">Designation/Role </label>
                                    <input 
                                        type="text" 
                                        
                                        placeholder="Designation/Role" 
                                        className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                        value={rcMemberForm.designation} 
                                        onChange={e => setRCMemberForm(f => ({ ...f, designation: e.target.value }))} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-blue-200">
                                        Profile Picture {!editingRCMemberId && '*'}
                                    </label>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-all duration-200" 
                                        onChange={e => setRCMemberForm(f => ({ ...f, picture: e.target.files?.[0] || null }))} 
                                        
                                    />
                                    {editingRCMemberId && (
                                        <p className="text-blue-300 text-sm mt-1">Leave empty to keep current picture</p>
                                    )}
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <Button 
                                        type="submit" 
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg"
                                    >
                                        {editingRCMemberId ? 'Update' : 'Add'} Member
                                    </Button>
                                    {editingRCMemberId && (
                                        <Button 
                                            type="button" 
                                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-200" 
                                            onClick={() => { 
                                                setEditingRCMemberId(null); 
                                                setRCMemberForm({ name: '', institution: '', email: '', designation: '', phone: '', picture: null }); 
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </Card>
                        
                        {/* Research Club Members List */}
                        <div className="mt-8">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6">
                                Research Club Members ({rcMembers.length})
                            </h3>
                            {rcMembers.length === 0 ? (
                                <Card className="text-center py-12 bg-blue-800/20 backdrop-blur-sm border border-blue-600/30 rounded-2xl">
                                    <div className="text-blue-300 text-lg">No research club members found.</div>
                                </Card>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {rcMembers.map((m) => (
                                        <Card key={m.id} className="medical-card text-white p-6 flex flex-col items-center text-center card-hover bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-blue-600/30 rounded-2xl hover:border-blue-500/50 transition-all duration-200">
                                            <img 
                                                src={m.pictureUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"} 
                                                alt={m.name} 
                                                className="h-24 w-24 rounded-full object-cover mb-4 shadow-lg border-2 border-blue-500/50" 
                                            />
                                            <div className="font-bold text-lg mb-1 text-white">{m.name}</div>
                                            <div className="text-blue-200 text-sm mb-1">{m.institution}</div>
                                            <div className="text-blue-300 text-sm font-semibold mb-2">{m.designation}</div>
                                            <div className="text-blue-400 text-xs mb-1">{m.email}</div>
                                            {m.phone && <div className="text-blue-400 text-xs mb-4">{m.phone}</div>}
                                            <div className="flex gap-2 mt-2 w-full">
                                                <Button 
                                                    size="sm" 
                                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg flex-1 transition-all duration-200 flex items-center gap-1" 
                                                    onClick={() => { 
                                                        setEditingRCMemberId(m.id); 
                                                        setRCMemberForm({ 
                                                            name: m.name, 
                                                            institution: m.institution, 
                                                            email: m.email, 
                                                            designation: m.designation, 
                                                            phone: m.phone, 
                                                            picture: null 
                                                        }); 
                                                    }}
                                                >
                                                    <Edit size={14} />
                                                    Edit
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex-1 transition-all duration-200 flex items-center gap-1" 
                                                    onClick={async () => { 
                                                        if (window.confirm('Are you sure you want to delete this member?')) { 
                                                            await deleteDoc(doc(db, "researchClubMembers", m.id)); 
                                                            setRCMembers(rcMembers.filter(mem => mem.id !== m.id)); 
                                                        } 
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Research Club Mentors Section */}
                {activeTab === 'researchclubmentors' && (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Manage Research Club Mentors</h2>
                        <Card className="medical-card shadow-2xl max-w-4xl bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-blue-600/30">
                            <form className="p-8 space-y-6" onSubmit={async e => {
                                e.preventDefault();
                                let pictureUrl = '';
                                if (rcMentorForm.picture) {
                                    const storageRef = ref(storage, `rcMentorPictures/${Date.now()}_${rcMentorForm.picture.name}`);
                                    await uploadBytes(storageRef, rcMentorForm.picture);
                                    pictureUrl = await getDownloadURL(storageRef);
                                }
                                if (editingRCMentorId) {
                                    const mentorDoc = doc(db, "researchClubMentors", editingRCMentorId);
                                    await updateDoc(mentorDoc, {
                                        name: rcMentorForm.name,
                                        institution: rcMentorForm.institution,
                                        email: rcMentorForm.email,
                                        designation: rcMentorForm.designation,
                                        phone: rcMentorForm.phone,
                                        ...(pictureUrl ? { pictureUrl } : {})
                                    });
                                    setEditingRCMentorId(null);
                                } else {
                                    await addDoc(collection(db, "researchClubMentors"), {
                                        name: rcMentorForm.name,
                                        institution: rcMentorForm.institution,
                                        email: rcMentorForm.email,
                                        designation: rcMentorForm.designation,
                                        phone: rcMentorForm.phone,
                                        pictureUrl
                                    });
                                }
                                setRCMentorForm({ name: '', institution: '', email: '', designation: '', phone: '', picture: null });
                                // Refresh list
                                const querySnapshot = await getDocs(collection(db, "researchClubMentors"));
                                setRCMentors(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as RCMember)));
                            }}>
                                <h3 className="text-xl font-semibold text-blue-200 mb-4">
                                    {editingRCMentorId ? 'Edit Research Club Mentor' : 'Add New Research Club Mentor'}
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-blue-200">Name *</label>
                                        <input 
                                            type="text" 
                                            
                                            placeholder="Full Name" 
                                            className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                            value={rcMentorForm.name} 
                                            onChange={e => setRCMentorForm(f => ({ ...f, name: e.target.value }))} 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-blue-200">Institution </label>
                                        <input 
                                            type="text" 
                                            
                                            placeholder="Institution/College" 
                                            className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                            value={rcMentorForm.institution} 
                                            onChange={e => setRCMentorForm(f => ({ ...f, institution: e.target.value }))} 
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-blue-200">Email </label>
                                        <input 
                                            type="email" 
                                            
                                            placeholder="Email Address" 
                                            className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                            value={rcMentorForm.email} 
                                            onChange={e => setRCMentorForm(f => ({ ...f, email: e.target.value }))} 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-blue-200">Phone</label>
                                        <input 
                                            type="text" 
                                            placeholder="Phone Number" 
                                            className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                            value={rcMentorForm.phone} 
                                            onChange={e => setRCMentorForm(f => ({ ...f, phone: e.target.value }))} 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-blue-200">Designation/Role </label>
                                    <input 
                                        type="text" 
                                        
                                        placeholder="Designation/Role" 
                                        className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                        value={rcMentorForm.designation} 
                                        onChange={e => setRCMentorForm(f => ({ ...f, designation: e.target.value }))} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-blue-200">
                                        Profile Picture {!editingRCMentorId && '*'}
                                    </label>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-all duration-200" 
                                        onChange={e => setRCMentorForm(f => ({ ...f, picture: e.target.files?.[0] || null }))} 
                                        
                                    />
                                    {editingRCMentorId && (
                                        <p className="text-blue-300 text-sm mt-1">Leave empty to keep current picture</p>
                                    )}
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <Button 
                                        type="submit" 
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg"
                                    >
                                        {editingRCMentorId ? 'Update' : 'Add'} Mentor
                                    </Button>
                                    {editingRCMentorId && (
                                        <Button 
                                            type="button" 
                                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-200" 
                                            onClick={() => { 
                                                setEditingRCMentorId(null); 
                                                setRCMentorForm({ name: '', institution: '', email: '', designation: '', phone: '', picture: null }); 
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </Card>
                        
                        {/* Research Club Mentors List */}
                        <div className="mt-8">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6">
                                Research Club Mentors ({rcMentors.length})
                            </h3>
                            {rcMentors.length === 0 ? (
                                <Card className="text-center py-12 bg-blue-800/20 backdrop-blur-sm border border-blue-600/30 rounded-2xl">
                                    <div className="text-blue-300 text-lg">No research club mentors found.</div>
                                </Card>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {rcMentors.map((m) => (
                                        <Card key={m.id} className="medical-card text-white p-6 flex flex-col items-center text-center card-hover bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-blue-600/30 rounded-2xl hover:border-blue-500/50 transition-all duration-200">
                                            <img 
                                                src={m.pictureUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"} 
                                                alt={m.name} 
                                                className="h-24 w-24 rounded-full object-cover mb-4 shadow-lg border-2 border-blue-500/50" 
                                            />
                                            <div className="font-bold text-lg mb-1 text-white">{m.name}</div>
                                            <div className="text-blue-200 text-sm mb-1">{m.institution}</div>
                                            <div className="text-blue-300 text-sm font-semibold mb-2">{m.designation}</div>
                                            <div className="text-blue-400 text-xs mb-1">{m.email}</div>
                                            {m.phone && <div className="text-blue-400 text-xs mb-4">{m.phone}</div>}
                                            <div className="flex gap-2 mt-2 w-full">
                                                <Button 
                                                    size="sm" 
                                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg flex-1 transition-all duration-200 flex items-center gap-1" 
                                                    onClick={() => { 
                                                        setEditingRCMentorId(m.id); 
                                                        setRCMentorForm({ 
                                                            name: m.name, 
                                                            institution: m.institution, 
                                                            email: m.email, 
                                                            designation: m.designation, 
                                                            phone: m.phone, 
                                                            picture: null 
                                                        }); 
                                                    }}
                                                >
                                                    <Edit size={14} />
                                                    Edit
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex-1 transition-all duration-200 flex items-center gap-1" 
                                                    onClick={async () => { 
                                                        if (window.confirm('Are you sure you want to delete this mentor?')) { 
                                                            await deleteDoc(doc(db, "researchClubMentors", m.id)); 
                                                            setRCMentors(rcMentors.filter(mentor => mentor.id !== m.id)); 
                                                        } 
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Quizzes Section */}
                {activeTab === 'quizzes' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Quiz Management</h2>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2"
                                onClick={() => setShowQuizModal(true)}
                            >
                                <Plus size={20} />
                                Create New Quiz
                            </Button>
                        </div>

                        {/* Quiz Modal */}
                        {showQuizModal && (
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                                <div className="rounded-2xl p-8 max-w-2xl w-full relative border-2 border-blue-300/50 shadow-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white max-h-[90vh] overflow-y-auto">
                                    <button
                                        className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl transition-colors duration-200 bg-blue-600/50 w-8 h-8 rounded-full flex items-center justify-center"
                                        onClick={() => setShowQuizModal(false)}
                                        title="Close"
                                    >
                                        ×
                                    </button>
                                    <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Create New Quiz</h3>
                                    <form onSubmit={handleQuizSubmit} className="space-y-6">
                                        <div className="space-y-4">
                                            <label className="block font-semibold text-blue-200">Quiz Title</label>
                                            <input
                                                type="text"
                                                className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                value={quizForm.title}
                                                onChange={e => handleQuizFormChange('title', e.target.value)}
                                                required
                                                placeholder="Enter quiz title..."
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block font-semibold text-blue-200">Thumbnail</label>
                                            <div className="flex gap-4 mb-3">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="thumbnailType" value="url" checked={quizForm.thumbnailType === 'url'} onChange={() => handleQuizFormChange('thumbnailType', 'url')} className="text-blue-500" />
                                                    <span>URL</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="thumbnailType" value="upload" checked={quizForm.thumbnailType === 'upload'} onChange={() => handleQuizFormChange('thumbnailType', 'upload')} className="text-blue-500" />
                                                    <span>Upload</span>
                                                </label>
                                            </div>
                                            {quizForm.thumbnailType === 'url' && (
                                                <input
                                                    type="text"
                                                    className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    value={quizForm.thumbnail}
                                                    onChange={e => handleQuizFormChange('thumbnail', e.target.value)}
                                                    placeholder="Enter thumbnail URL..."
                                                />
                                            )}
                                            {quizForm.thumbnailType === 'upload' && (
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-all duration-200"
                                                    onChange={e => handleQuizFormChange('thumbnail', e.target.files?.[0])}
                                                />
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block font-semibold text-blue-200">Quiz Type</label>
                                            <select
                                                className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                value={quizMode}
                                                onChange={e => setQuizMode(e.target.value as 'manual' | 'gform')}
                                            >
                                                <option value="manual" className="bg-slate-800">Manual Creation</option>
                                                <option value="gform" className="bg-slate-800">Google Form Link</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block font-semibold text-blue-200">Duration (minutes)</label>
                                            <input
                                                type="number"
                                                min={1}
                                                className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                value={editQuizForm.duration ?? 10}
                                                onChange={e => {
                                                    const val = parseInt(e.target.value, 10);
                                                    handleEditQuizFormChange('duration', isNaN(val) ? 10 : Math.max(1, val));
                                                }}
                                                placeholder="e.g., 10"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block font-semibold text-blue-200">Duration (minutes)</label>
                                            <input
                                                type="number"
                                                min={1}
                                                className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                value={quizForm.duration ?? 10}
                                                onChange={e => {
                                                    const val = parseInt(e.target.value, 10);
                                                    handleQuizFormChange('duration', isNaN(val) ? 10 : Math.max(1, val));
                                                }}
                                                placeholder="e.g., 10"
                                            />
                                        </div>

                                        {quizMode === 'gform' && (
                                            <div className="space-y-4">
                                                <label className="block font-semibold text-blue-200">Google Form Link</label>
                                                <input
                                                    type="url"
                                                    className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    value={quizForm.gformLink}
                                                    onChange={e => handleQuizFormChange('gformLink', e.target.value)}
                                                    required
                                                    placeholder="https://forms.google.com/..."
                                                />
                                            </div>
                                        )}

                                        {quizMode === 'manual' && (
                                            <div className="space-y-4">
                                                <label className="block font-semibold text-blue-200">Questions</label>
                                                <div className="space-y-4 max-h-96 overflow-y-auto p-2">
                                                    <DragDropContext onDragEnd={result => {
                                                        if (!result.destination) return;
                                                        const reordered = Array.from(quizForm.questions);
                                                        const [removed] = reordered.splice(result.source.index, 1);
                                                        reordered.splice(result.destination.index, 0, removed);
                                                        setQuizForm(prev => ({ ...prev, questions: reordered }));
                                                    }}>
                                                        <Droppable droppableId="questions-droppable">
                                                            {(provided) => (
                                                                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                                                                    {quizForm.questions.map((q, idx) => (
                                                                        <QuizQuestionDraggable key={idx} question={q} idx={idx}>
                                                                            <div className="bg-blue-800/20 border border-blue-600/30 rounded-xl p-4 space-y-4 hover:border-blue-500/50 transition-all duration-200">
                                                                                <input
                                                                                    type="text"
                                                                                    className="w-full bg-blue-800/30 border border-blue-600/50 rounded-lg px-3 py-2 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                                    placeholder="Enter question..."
                                                                                    value={q.question}
                                                                                    onChange={e => handleQuizQuestionChange(idx, 'question', e.target.value)}
                                                                                    required
                                                                                />
                                                                                <div className="space-y-3">
                                                                                    <label className="block font-semibold text-blue-200 text-sm">Options</label>
                                                                                    {q.options.map((opt, oIdx) => (
                                                                                        <div key={oIdx} className="flex items-center gap-2">
                                                                                            <input
                                                                                                type="text"
                                                                                                className="flex-1 bg-blue-800/30 border border-blue-600/50 rounded-lg px-3 py-2 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                                                placeholder={`Option ${oIdx + 1}`}
                                                                                                value={opt}
                                                                                                onChange={e => handleQuizOptionChange(idx, oIdx, e.target.value)}
                                                                                                required
                                                                                            />
                                                                                            <button
                                                                                                type="button"
                                                                                                className="text-red-400 hover:text-red-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 rounded"
                                                                                                onClick={() => handleRemoveQuizOption(idx, oIdx)}
                                                                                                disabled={q.options.length <= 2}
                                                                                            >
                                                                                                Remove
                                                                                            </button>
                                                                                        </div>
                                                                                    ))}
                                                                                    <button
                                                                                        type="button"
                                                                                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-1 text-sm"
                                                                                        onClick={() => handleAddQuizOption(idx)}
                                                                                    >
                                                                                        <Plus size={16} />
                                                                                        Add Option
                                                                                    </button>
                                                                                </div>
                                                                                <div className="space-y-2">
                                                                                    <label className="block font-semibold text-blue-200 text-sm">Correct Answer (option index)</label>
                                                                                    <input
                                                                                        type="number"
                                                                                        min="0"
                                                                                        max={q.options.length - 1}
                                                                                        className="w-20 bg-blue-800/30 border border-blue-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                                        value={q.correctAnswer}
                                                                                        onChange={e => handleQuizQuestionChange(idx, 'correctAnswer', Number(e.target.value))}
                                                                                        required
                                                                                    />
                                                                                </div>
                                                                                <button
                                                                                    type="button"
                                                                                    className="text-red-400 hover:text-red-300 transition-colors duration-200 text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                    onClick={() => handleRemoveQuizQuestion(idx)}
                                                                                    disabled={quizForm.questions.length <= 1}
                                                                                >
                                                                                    <Trash2 size={16} />
                                                                                    Remove Question
                                                                                </button>
                                                                            </div>
                                                                        </QuizQuestionDraggable>
                                                                    ))}
                                                                    {provided.placeholder}
                                                                </div>
                                                            )}
                                                        </Droppable>
                                                    </DragDropContext>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2"
                                                    onClick={handleAddQuizQuestion}
                                                >
                                                    <Plus size={20} />
                                                    Add Question
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="submit"
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={uploadingQuiz}
                                            >
                                                {uploadingQuiz ? 'Creating...' : 'Create Quiz'}
                                            </button>
                                            <button
                                                type="button"
                                                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-200"
                                                onClick={() => setShowQuizModal(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Quiz List */}
                        <div className="grid gap-6 mt-8">
                            {quizzes.map((quiz) => (
                                <div key={quiz.id} className="bg-blue-800/20 backdrop-blur-sm border border-blue-600/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-200">
                                    <div className="flex items-start gap-6">
                                        <img src={quiz.thumbnail} alt={quiz.title} className="w-32 h-32 object-cover rounded-xl shadow-lg" />
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-bold text-xl text-white mb-2">{quiz.title}</h4>
                                                    <Badge className={`${quiz.type === 'manual' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'} border-0`}>
                                                        {quiz.type === 'manual' ? 'Manual Quiz' : 'Google Form'}
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditQuiz(quiz)}
                                                        className="flex items-center gap-2 border-blue-500/50 text-blue-300 hover:bg-blue-500/20 hover:text-white transition-all duration-200"
                                                    >
                                                        <Edit size={16} />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteQuiz(quiz.id)}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                            {quiz.type === 'gform' && quiz.gformLink && (
                                                <a
                                                    href={quiz.gformLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                                >
                                                    <Eye size={16} />
                                                    Open Form
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Edit Quiz Modal */}
                        {showEditModal && (
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                                <div className="rounded-2xl p-8 max-w-2xl w-full relative border-2 border-blue-300/50 shadow-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white max-h-[90vh] overflow-y-auto">
                                    <button
                                        className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl transition-colors duration-200 bg-blue-600/50 w-8 h-8 rounded-full flex items-center justify-center"
                                        onClick={() => setShowEditModal(false)}
                                        title="Close"
                                    >
                                        ×
                                    </button>
                                    <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Edit Quiz</h3>
                                    <form onSubmit={handleSaveEditedQuiz} className="space-y-6">
                                        <div className="space-y-4">
                                            <label className="block font-semibold text-blue-200">Quiz Title</label>
                                            <input
                                                type="text"
                                                className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                value={editQuizForm.title}
                                                onChange={e => handleEditQuizFormChange('title', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block font-semibold text-blue-200">Thumbnail</label>
                                            <div className="flex gap-4 mb-3">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="editThumbnailType" value="url" checked={editQuizForm.thumbnailType === 'url'} onChange={() => handleEditQuizFormChange('thumbnailType', 'url')} className="text-blue-500" />
                                                    <span>URL</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="editThumbnailType" value="upload" checked={editQuizForm.thumbnailType === 'upload'} onChange={() => handleEditQuizFormChange('thumbnailType', 'upload')} className="text-blue-500" />
                                                    <span>Upload</span>
                                                </label>
                                            </div>
                                            {editQuizForm.thumbnailType === 'url' && (
                                                <input
                                                    type="text"
                                                    className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    value={editQuizForm.thumbnail}
                                                    onChange={e => handleEditQuizFormChange('thumbnail', e.target.value)}
                                                    placeholder="Enter thumbnail URL..."
                                                />
                                            )}
                                            {editQuizForm.thumbnailType === 'upload' && (
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-all duration-200"
                                                    onChange={e => handleEditQuizFormChange('thumbnail', e.target.files?.[0])}
                                                />
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block font-semibold text-blue-200">Quiz Type</label>
                                            <select
                                                className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                value={editQuizForm.type}
                                                onChange={e => handleEditQuizFormChange('type', e.target.value)}
                                            >
                                                <option value="manual" className="bg-slate-800">Manual Creation</option>
                                                <option value="gform" className="bg-slate-800">Google Form Link</option>
                                            </select>
                                        </div>

                                        {editQuizForm.type === 'gform' && (
                                            <div className="space-y-4">
                                                <label className="block font-semibold text-blue-200">Google Form Link</label>
                                                <input
                                                    type="url"
                                                    className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                    value={editQuizForm.gformLink}
                                                    onChange={e => handleEditQuizFormChange('gformLink', e.target.value)}
                                                    required
                                                    placeholder="https://forms.google.com/..."
                                                />
                                            </div>
                                        )}

                                        {editQuizForm.type === 'manual' && (
                                            <div className="space-y-4">
                                                <label className="block font-semibold text-blue-200">Questions</label>
                                                <div className="space-y-4 max-h-96 overflow-y-auto p-2">
                                                    <DragDropContext onDragEnd={result => {
                                                        if (!result.destination) return;
                                                        const reordered = Array.from(editQuizForm.questions);
                                                        const [removed] = reordered.splice(result.source.index, 1);
                                                        reordered.splice(result.destination.index, 0, removed);
                                                        setEditQuizForm(prev => ({ ...prev, questions: reordered }));
                                                    }}>
                                                        <Droppable droppableId="edit-questions-droppable">
                                                            {(provided) => (
                                                                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                                                                    {editQuizForm.questions.map((q, idx) => (
                                                                        <QuizQuestionDraggable key={idx} question={q} idx={idx}>
                                                                            <div className="bg-blue-800/20 border border-blue-600/30 rounded-xl p-4 space-y-4 hover:border-blue-500/50 transition-all duration-200">
                                                                                <input
                                                                                    type="text"
                                                                                    className="w-full bg-blue-800/30 border border-blue-600/50 rounded-lg px-3 py-2 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                                    placeholder="Enter question..."
                                                                                    value={q.question}
                                                                                    onChange={e => handleEditQuizQuestionChange(idx, 'question', e.target.value)}
                                                                                    required
                                                                                />
                                                                                <div className="space-y-3">
                                                                                    <label className="block font-semibold text-blue-200 text-sm">Options</label>
                                                                                    {q.options.map((opt, oIdx) => (
                                                                                        <div key={oIdx} className="flex items-center gap-2">
                                                                                            <input
                                                                                                type="text"
                                                                                                className="flex-1 bg-blue-800/30 border border-blue-600/50 rounded-lg px-3 py-2 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                                                placeholder={`Option ${oIdx + 1}`}
                                                                                                value={opt}
                                                                                                onChange={e => handleEditQuizOptionChange(idx, oIdx, e.target.value)}
                                                                                                required
                                                                                            />
                                                                                            <button
                                                                                                type="button"
                                                                                                className="text-red-400 hover:text-red-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 rounded"
                                                                                                onClick={() => handleEditRemoveQuizOption(idx, oIdx)}
                                                                                                disabled={q.options.length <= 2}
                                                                                            >
                                                                                                Remove
                                                                                            </button>
                                                                                        </div>
                                                                                    ))}
                                                                                    <button
                                                                                        type="button"
                                                                                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-1 text-sm"
                                                                                        onClick={() => handleEditAddQuizOption(idx)}
                                                                                    >
                                                                                        <Plus size={16} />
                                                                                        Add Option
                                                                                    </button>
                                                                                </div>
                                                                                <div className="space-y-2">
                                                                                    <label className="block font-semibold text-blue-200 text-sm">Correct Answer (option index)</label>
                                                                                    <input
                                                                                        type="number"
                                                                                        min="0"
                                                                                        max={q.options.length - 1}
                                                                                        className="w-20 bg-blue-800/30 border border-blue-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                                        value={q.correctAnswer}
                                                                                        onChange={e => handleEditQuizQuestionChange(idx, 'correctAnswer', Number(e.target.value))}
                                                                                        required
                                                                                    />
                                                                                </div>
                                                                                <button
                                                                                    type="button"
                                                                                    className="text-red-400 hover:text-red-300 transition-colors duration-200 text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                    onClick={() => handleEditRemoveQuizQuestion(idx)}
                                                                                    disabled={editQuizForm.questions.length <= 1}
                                                                                >
                                                                                    <Trash2 size={16} />
                                                                                    Remove Question
                                                                                </button>
                                                                            </div>
                                                                        </QuizQuestionDraggable>
                                                                    ))}
                                                                    {provided.placeholder}
                                                                </div>
                                                            )}
                                                        </Droppable>
                                                    </DragDropContext>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2"
                                                    onClick={handleEditAddQuizQuestion}
                                                >
                                                    <Plus size={20} />
                                                    Add Question
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="submit"
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                type="button"
                                                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-200"
                                                onClick={() => setShowEditModal(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Courses Section */}
                {activeTab === 'courses' && (
                    <Card className="medical-card shadow-2xl max-w-2xl mx-auto bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-blue-600/30">
                        <form className="p-8 space-y-6" onSubmit={handleCourseSubmit}>
                            <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Create Course</h2>
                            <div className="space-y-4">
                                <label className="block font-semibold text-blue-200">Course Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Course Name"
                                    value={courseName}
                                    onChange={e => setCourseName(e.target.value)}
                                    className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block font-semibold text-blue-200">Course Description</label>
                                <textarea
                                    required
                                    placeholder="Course Description"
                                    value={courseDescription}
                                    onChange={e => setCourseDescription(e.target.value)}
                                    className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px]"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block font-semibold text-blue-200">Course Thumbnail</label>
                                <div className="flex gap-4 mb-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="courseThumbnailType" value="url" checked={courseThumbnailType === 'url'} onChange={() => setCourseThumbnailType('url')} className="text-blue-500" />
                                        <span>URL</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="courseThumbnailType" value="upload" checked={courseThumbnailType === 'upload'} onChange={() => setCourseThumbnailType('upload')} className="text-blue-500" />
                                        <span>Upload</span>
                                    </label>
                                </div>
                                {courseThumbnailType === 'url' && (
                                    <input
                                        type="text"
                                        className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        value={courseThumbnail}
                                        onChange={e => setCourseThumbnail(e.target.value)}
                                        placeholder="Enter thumbnail URL..."
                                    />
                                )}
                                {courseThumbnailType === 'upload' && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setCourseThumbnailFile(e.target.files?.[0] || null)}
                                        className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-all duration-200"
                                    />
                                )}
                            </div>
                            <hr className="my-6 border-blue-500/30" />
                            <h3 className="font-semibold text-blue-200 text-xl mb-4">Add Section</h3>
                            {courseSections.map((section, idx) => (
                                <Card key={idx} className="border border-blue-600/30 p-6 mb-4 rounded-xl bg-blue-800/20 backdrop-blur-sm relative">
                                    <span className="font-medium text-blue-200 text-lg">Section {idx + 1}</span>
                                    {/* Cross (delete) button */}
                                    <button
                                        type="button"
                                        className="absolute top-4 right-4 text-gray-300 hover:text-red-400 text-xl transition-colors duration-200 bg-blue-600/50 w-8 h-8 rounded-full flex items-center justify-center"
                                        title="Delete Section"
                                        onClick={() => setCourseSections(sections => sections.filter((_, i) => i !== idx))}
                                        disabled={courseSections.length === 1}
                                    >
                                        ×
                                    </button>
                                    <div className="mb-4 flex gap-6 mt-4">
                                        <label className="flex items-center gap-3 text-blue-200 cursor-pointer">
                                            <input type="radio" name={`sectionType-${idx}`} value="video" checked={section.sectionType === 'video'} onChange={() => {
                                                setCourseSections(sections => sections.map((s, i) => i === idx ? { ...s, sectionType: 'video' } : s));
                                            }} className="text-blue-500" />
                                            Add Video
                                        </label>
                                        <label className="flex items-center gap-3 text-blue-200 cursor-pointer">
                                            <input type="radio" name={`sectionType-${idx}`} value="quiz" checked={section.sectionType === 'quiz'} onChange={() => {
                                                setCourseSections(sections => sections.map((s, i) => i === idx ? { ...s, sectionType: 'quiz' } : s));
                                            }} className="text-blue-500" />
                                            Add Quiz
                                        </label>
                                    </div>
                                    {section.sectionType === 'video' && (
                                        <div className="space-y-4">
                                            <label className="block font-medium text-blue-200">Video Link</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className="w-full bg-blue-800/30 border border-blue-600/50 rounded-lg px-3 py-2 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Paste video link here"
                                                    value={section.videoLink || ''}
                                                    onChange={e => setCourseSections(sections => sections.map((s, i) => i === idx ? { ...s, videoLink: e.target.value } : s))}
                                                />
                                                <Button
                                                    type="button"
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
                                                    onClick={() => {
                                                        alert('Video link saved for this section!');
                                                    }}
                                                >
                                                    Done
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    {section.sectionType === 'quiz' && (
                                        <div className="space-y-4">
                                            <label className="block font-medium text-blue-200">Quiz Type</label>
                                            <div className="flex gap-6 mb-4">
                                                <label className="flex items-center gap-3 text-blue-200 cursor-pointer">
                                                    <input type="radio" name={`quizType-${idx}`} value="manual" checked={section.quizType === 'manual'} onChange={() => {
                                                        setCourseSections(sections => sections.map((s, i) => i === idx ? { ...s, quizType: 'manual' } : s));
                                                    }} className="text-blue-500" />
                                                    Manual Form
                                                </label>
                                                <label className="flex items-center gap-3 text-blue-200 cursor-pointer">
                                                    <input type="radio" name={`quizType-${idx}`} value="gform" checked={section.quizType === 'gform'} onChange={() => {
                                                        setCourseSections(sections => sections.map((s, i) => i === idx ? { ...s, quizType: 'gform' } : s));
                                                    }} className="text-blue-500" />
                                                    Google Form
                                                </label>
                                            </div>
                                            {section.quizType === 'manual' && (
                                                <div className="space-y-4">
                                                    <label className="block font-semibold text-blue-200">Quiz Title</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                        value={section.quizTitle || ''}
                                                        onChange={e => setCourseSections(sections => sections.map((s, i) => i === idx ? { ...s, quizTitle: e.target.value } : s))}
                                                        required
                                                        placeholder="Enter quiz title..."
                                                    />
                                                    <label className="block font-semibold text-blue-200">Thumbnail</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                        value={section.quizThumbnail || ''}
                                                        onChange={e => setCourseSections(sections => sections.map((s, i) => i === idx ? { ...s, quizThumbnail: e.target.value } : s))}
                                                        placeholder="Enter thumbnail URL..."
                                                    />
                                                    <label className="block font-semibold text-blue-200">Questions</label>
                                                    <DragDropContext onDragEnd={result => {
                                                        if (!result.destination) return;
                                                        const reordered = Array.from(section.questions);
                                                        const [removed] = reordered.splice(result.source.index, 1);
                                                        reordered.splice(result.destination.index, 0, removed);
                                                        setCourseSections(sections => sections.map((s, i) => i === idx ? { ...s, questions: reordered } : s));
                                                    }}>
                                                        <Droppable droppableId={`questions-droppable-${idx}`}>
                                                            {(provided) => (
                                                                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                                                                    {section.questions.map((q, qIdx) => (
                                                                        <QuizQuestionDraggable key={qIdx} question={q} idx={qIdx}>
                                                                            <div className="bg-blue-800/20 border border-blue-600/30 rounded-xl p-4 space-y-4 mb-2">
                                                                                <input
                                                                                    type="text"
                                                                                    className="w-full bg-blue-800/30 border border-blue-600/50 rounded-lg px-3 py-2 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                                    placeholder="Enter question..."
                                                                                    value={q.question}
                                                                                    onChange={e => {
                                                                                        const updatedQuestions = section.questions.map((qq, qqIdx) => qqIdx === qIdx ? { ...qq, question: e.target.value } : qq);
                                                                                        setCourseSections(sections => sections.map((s, i) => i === idx ? { ...s, questions: updatedQuestions } : s));
                                                                                    }}
                                                                                    required
                                                                                />
                                                                                <label className="block font-semibold text-blue-200 text-sm">Options</label>
                                                                                {q.options.map((opt, oIdx) => (
                                                                                    <div key={oIdx} className="flex items-center gap-2">
                                                                                        <input
                                                                                            type="text"
                                                                                            className="flex-1 bg-blue-800/30 border border-blue-600/50 rounded-lg px-3 py-2 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                                            placeholder={`Option ${oIdx + 1}`}
                                                                                            value={opt}
                                                                                            onChange={e => {
                                                                                                const updatedQuestions = section.questions.map((qq, qqIdx) => {
                                                                                                    if (qqIdx === qIdx) {
                                                                                                        const updatedOptions = qq.options.map((oo, ooIdx) => ooIdx === oIdx ? e.target.value : oo);
                                                                                                        return { ...qq, options: updatedOptions };
                                                                                                    }
                                                                                                    return qq;
                                                                                                });
                                                                                                setCourseSections(sections => sections.map((s, i) => i === idx ? { ...s, questions: updatedQuestions } : s));
                                                                                            }}
                                                                                            required
                                                                                        />
                                                                                        <button
                                                                                            type="button"
                                                                                            className="text-red-400 hover:text-red-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 rounded"
                                                                                            onClick={() => {
                                                                                                const updatedQuestions = section.questions.map((qq, qqIdx) => {
                                                                                                    if (qqIdx === qIdx) {
                                                                                                        return { ...qq, options: qq.options.filter((_, ooIdx) => ooIdx !== oIdx) };
                                                                                                    }
                                                                                                    return qq;
                                                                                                });
                                                                                                setCourseSections(sections => sections.map((s, i) => i === idx ? { ...s, questions: updatedQuestions } : s));
                                                                                            }}
                                                                                            disabled={q.options.length <= 2}
                                                                                        >Remove</button>
                                                                                    </div>
                                                                                ))}
                                                                                <button
                                                                                    type="button"
                                                                                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-1 text-sm"
                                                                                    onClick={() => {
                                                                                        const updatedQuestions = section.questions.map((qq, qqIdx) => {
                                                                                            if (qqIdx === qIdx) {
                                                                                                return { ...qq, options: [...qq.options, ''] };
                                                                                            }
                                                                                            return qq;
                                                                                        });
                                                                                        setCourseSections(sections => sections.map((s, i) => i === idx ? { ...s, questions: updatedQuestions } : s));
                                                                                    }}
                                                                                >
                                                                                    <Plus size={16} /> Add Option
                                                                                </button>
                                                                                <label className="block font-semibold text-blue-200 text-sm">Correct Answer (option index)</label>
                                                                                <input
                                                                                    type="number"
                                                                                    min="0"
                                                                                    max={q.options.length - 1}
                                                                                    className="w-20 bg-blue-800/30 border border-blue-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                                    value={q.correctAnswer}
                                                                                    onChange={e => {
                                                                                        const updatedQuestions = section.questions.map((qq, qqIdx) => qqIdx === qIdx ? { ...qq, correctAnswer: Number(e.target.value) } : qq);
                                                                                        setCourseSections(sections => sections.map((s, i) => i === idx ? { ...s, questions: updatedQuestions } : s));
                                                                                    }}
                                                                                    required
                                                                                />
                                                                                <button
                                                                                    type="button"
                                                                                    className="text-red-400 hover:text-red-300 transition-colors duration-200 text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                    onClick={() => {
                                                                                        const updatedQuestions = section.questions.filter((_, qqIdx) => qqIdx !== qIdx);
                                                                                        setCourseSections(sections => sections.map((s, i) => i === idx ? { ...s, questions: updatedQuestions } : s));
                                                                                    }}
                                                                                    disabled={section.questions.length <= 1}
                                                                                >
                                                                                    <Trash2 size={16} /> Remove Question
                                                                                </button>
                                                                            </div>
                                                                        </QuizQuestionDraggable>
                                                                    ))}
                                                                    {provided.placeholder}
                                                                </div>
                                                            )}
                                                        </Droppable>
                                                    </DragDropContext>
                                                    <button
                                                        type="button"
                                                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-2"
                                                        onClick={() => {
                                                            const updatedQuestions = [...section.questions, { question: '', options: ['', ''], correctAnswer: 0 }];
                                                            setCourseSections(sections => sections.map((s, i) => i === idx ? { ...s, questions: updatedQuestions } : s));
                                                        }}
                                                    >
                                                        <Plus size={20} /> Add Question
                                                    </button>
                                                </div>
                                            )}
                                            {section.quizType === 'gform' && (
                                                <div className="space-y-4">
                                                    <label className="block font-medium text-blue-200">Google Form Link</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-blue-800/30 border border-blue-600/50 rounded-lg px-3 py-2 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Paste Google Form link here"
                                                        value={section.gformLink || ''}
                                                        onChange={e => setCourseSections(sections => sections.map((s, i) => i === idx ? { ...s, gformLink: e.target.value } : s))}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Card>
                            ))}
                            <div className="mt-6 flex justify-between items-center">
                                <Button
                                    type="button"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-all duration-200 flex items-center gap-2"
                                    onClick={() => setCourseSections(sections => [
                                        ...sections,
                                        {
                                            sectionType: 'video',
                                            quizType: 'manual',
                                            quizTitle: '',
                                            quizThumbnail: '',
                                            questions: [{ question: '', options: ['', ''], correctAnswer: 0 }],
                                            videoLink: '',
                                            gformLink: ''
                                        }
                                    ])}
                                >
                                    <Plus size={20} />
                                    Add another section
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition-all duration-200 flex items-center gap-2"
                                    disabled={savingCourse}
                                >
                                    {savingCourse ? 'Saving...' : 'Add Course'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Approval Cards - Journals, Blogs, Videos */}
                {['videos', 'journals', 'blogs'].includes(activeTab) && (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6">
                            Pending {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} for Approval
                        </h2>

                        {(() => {
                            const loadingState = activeTab === 'videos' ? loadingVideos : activeTab === 'journals' ? loadingJournals : loadingBlogs;
                            const pendingItems = activeTab === 'videos' ? pendingVideos : activeTab === 'journals' ? pendingJournals : pendingBlogs;

                            if (loadingState) {
                                return (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                    </div>
                                );
                            }

                            if (pendingItems.length === 0) {
                                return (
                                    <Card className="text-center py-12 bg-blue-800/20 backdrop-blur-sm border border-blue-600/30 rounded-2xl">
                                        <div className="text-blue-300 text-lg">No pending {activeTab} for approval.</div>
                                    </Card>
                                );
                            }

                            return (
                                <div className="grid gap-6">
                                    {pendingItems.map((item) => (
                                        <Card key={item.id} className="medical-card text-white p-6 card-hover bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-blue-600/30 rounded-2xl hover:border-blue-500/50 transition-all duration-200">
                                            {(item.imageUrl || item.thumbnail || item.image) && (
                                                <img
                                                    src={item.imageUrl || item.thumbnail || item.image}
                                                    alt={item.title}
                                                    className="w-full h-48 object-cover rounded-xl mb-4 shadow-lg"
                                                    onError={e => {
                                                        e.currentTarget.src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop";
                                                    }}
                                                />
                                            )}
                                            <h2 className="text-xl font-semibold mb-3 text-white">{item.title}</h2>
                                            <div className="mb-3 text-sm text-blue-200 space-y-1">
                                                {'authors' in item && <div><span className="font-semibold">Authors:</span> {item.authors}</div>}
                                                {'instructor' in item && <div><span className="font-semibold">Instructor:</span> {item.instructor}</div>}
                                                {'author' in item && <div><span className="font-semibold">Author:</span> {item.author}</div>}
                                                {'journal' in item && <div><span className="font-semibold">Journal:</span> {item.journal}</div>}
                                                {'subject' in item && <div><span className="font-semibold">Subject:</span> {item.subject}</div>}
                                                {'category' in item && <div><span className="font-semibold">Category:</span> {item.category}</div>}
                                                {'uploadedBy' in item && <div><span className="font-semibold">Uploaded By:</span> {item.uploadedBy}</div>}
                                                {'publishedDate' in item && <div><span className="font-semibold">Published:</span> {item.publishedDate}</div>}
                                            </div>
                                            <div className="mb-4">
                                                <span className="font-semibold text-blue-200">Description:</span>
                                                <p className="text-blue-100 mt-1 line-clamp-3">
                                                    {item.abstract || item.description || item.excerpt}
                                                </p>
                                            </div>
                                            <Badge className="mb-4 bg-yellow-500/20 text-yellow-300 border-0">Pending Approval</Badge>
                                            <div className="flex flex-wrap gap-3">
                                                {(item.pdfUrl || item.videoUrl) && (
                                                    <Button
                                                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-all duration-200"
                                                        onClick={() => {
                                                            if (item.pdfUrl) {
                                                                const link = document.createElement('a');
                                                                link.href = item.pdfUrl;
                                                                link.download = `${item.title}.pdf`;
                                                                link.target = '_blank';
                                                                link.click();
                                                            } else if (item.videoUrl) {
                                                                window.open(item.videoUrl, '_blank', 'noopener,noreferrer');
                                                            }
                                                        }}
                                                    >
                                                        <Eye size={16} />
                                                        {item.pdfUrl ? 'View PDF' : 'Watch Video'}
                                                    </Button>
                                                )}
                                                {item.externalUrl && (
                                                    <Button
                                                        className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2 transition-all duration-200"
                                                        onClick={() => window.open(item.externalUrl, '_blank', 'noopener,noreferrer')}
                                                    >
                                                        <Eye size={16} />
                                                        External Link
                                                    </Button>
                                                )}
                                                <div className="flex gap-2 ml-auto">
                                                    <Button
                                                        onClick={() => activeTab === 'videos' ? handleApproveVideo(item.id) : activeTab === 'journals' ? handleApproveJournal(item.id) : handleApproveBlog(item.id)}
                                                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transition-all duration-200"
                                                    >
                                                        <CheckCircle size={16} />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        onClick={() => activeTab === 'videos' ? handleRejectVideo(item.id) : activeTab === 'journals' ? handleRejectJournal(item.id) : handleRejectBlog(item.id)}
                                                        className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 transition-all duration-200"
                                                    >
                                                        <XCircle size={16} />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* Achievements Section */}
                {activeTab === 'achievements' && (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Manage Achievements</h2>
                        <Card className="medical-card shadow-2xl max-w-2xl bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-blue-600/30">
                            <form className="p-8 space-y-6" onSubmit={handleAchievementSubmit}>
                                <h3 className="text-xl font-semibold text-blue-200 mb-4">Add New Achievement</h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-blue-200">Icon <span className="text-red-400">*</span></label>
                                        <select
                                            required
                                            className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            value={achievementForm.icon}
                                            onChange={e => setAchievementForm(f => ({ ...f, icon: e.target.value }))}
                                        >
                                            <option value="" className="bg-slate-800">Select Icon</option>
                                            {achievementIcons.map(icon => (
                                                <option key={icon} value={icon} className="bg-slate-800">{icon}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-blue-200">Value <span className="text-red-400">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Achievement Value"
                                            className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            value={achievementForm.value}
                                            onChange={e => setAchievementForm(f => ({ ...f, value: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-blue-200">Label <span className="text-red-400">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Achievement Label"
                                            className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            value={achievementForm.label}
                                            onChange={e => setAchievementForm(f => ({ ...f, label: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg"
                                    >
                                        <Plus size={20} />
                                        {editingAchievementId ? 'Update' : 'Add'} Achievement
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20 hover:text-white transition-all duration-200 px-6 py-3 rounded-xl"
                                        onClick={() => { setEditingAchievementId(null); setAchievementForm({ icon: '', value: '', label: '', isStatic: false, staticIndex: null }); }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                            {staticAchievements.map((a, idx) => (
                                <Card key={"static-" + idx} className="medical-card text-white p-6 flex items-center gap-6 card-hover bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-blue-600/30 rounded-2xl hover:border-blue-500/50 transition-all duration-200">
                                    <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 mr-4 shadow-lg">
                                        <span className="text-2xl font-bold">{a.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-2xl text-white">{a.value}</div>
                                        <div className="text-blue-200">{a.label}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 flex items-center gap-2"
                                            onClick={() => handleEditAchievement(a, idx, true)}
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </Button>
                                        <Button
                                            className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200 flex items-center gap-2"
                                            onClick={() => handleDeleteAchievement(null, idx, true)}
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                            {achievements.map((a, idx) => (
                                <Card key={a.id || idx} className="medical-card text-white p-6 flex items-center gap-6 card-hover bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-blue-600/30 rounded-2xl hover:border-blue-500/50 transition-all duration-200">
                                    <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 mr-4 shadow-lg">
                                        <span className="text-2xl font-bold">{a.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-2xl text-white">{a.value}</div>
                                        <div className="text-blue-200">{a.label}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 flex items-center gap-2"
                                            onClick={() => handleEditAchievement(a)}
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </Button>
                                        <Button
                                            className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200 flex items-center gap-2"
                                            onClick={() => handleDeleteAchievement(a.id)}
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Members Section */}
                {activeTab === 'members' && (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Manage Team Members</h2>
                        <Card className="medical-card shadow-2xl max-w-4xl bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-blue-600/30">
                            <form className="p-8 space-y-6" onSubmit={handleMemberSubmit}>
                                <h3 className="text-xl font-semibold text-blue-200 mb-4">
                                    {editingMemberId ? 'Edit Member' : 'Add New Member'}
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-blue-200">Name <span className="text-red-400">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Full name"
                                            className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            value={memberForm.name}
                                            onChange={e => setMemberForm(f => ({ ...f, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-blue-200">Institution/College <span className="text-red-400">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Institution/College"
                                            className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            value={memberForm.institution}
                                            onChange={e => setMemberForm(f => ({ ...f, institution: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-blue-200">Profile Picture <span className="text-red-400">*</span></label>
                                    <input
                                        type="file"
                                        required
                                        accept="image/*"
                                        className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-all duration-200"
                                        onChange={e => setMemberForm(f => ({ ...f, picture: e.target.files?.[0] || null }))}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-blue-200">Email</label>
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            value={memberForm.email}
                                            onChange={e => setMemberForm(f => ({ ...f, email: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-blue-200">Phone (with country code)</label>
                                        <input
                                            type="tel"
                                            placeholder="+91 9876543210"
                                            className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            value={memberForm.phone || ''}
                                            onChange={e => setMemberForm(f => ({ ...f, phone: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-blue-200">Designation</label>
                                    <input
                                        type="text"
                                        placeholder="Designation/Role"
                                        className="w-full bg-blue-800/30 border border-blue-600/50 rounded-xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        value={memberForm.designation}
                                        onChange={e => setMemberForm(f => ({ ...f, designation: e.target.value }))}
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg"
                                    >
                                        <Plus size={20} />
                                        {editingMemberId ? 'Update Member' : 'Add Member'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20 hover:text-white transition-all duration-200 px-6 py-3 rounded-xl"
                                        onClick={() => { setEditingMemberId(null); setMemberForm({ name: '', institution: '', email: '', designation: '', phone: '', picture: null, isStatic: false, staticIndex: null }); }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Card>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {staticMembers.map((m, idx) => (
                                <Card key={"static-" + idx} className="medical-card text-white p-6 flex flex-col items-center text-center card-hover bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-blue-600/30 rounded-2xl hover:border-blue-500/50 transition-all duration-200">
                                    <img src={m.pictureUrl} alt={m.name} className="h-24 w-24 rounded-full object-cover mb-4 shadow-lg border-2 border-blue-500/50" />
                                    <div className="flex-1 w-full">
                                        <div className="font-bold text-lg text-white mb-2">{m.name}</div>
                                        <div className="text-blue-200 text-sm mb-1">{m.institution}</div>
                                        <div className="text-blue-300 text-sm font-semibold mb-4">{m.designation}</div>
                                    </div>
                                    <div className="flex gap-2 w-full">
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700 text-white flex-1 transition-all duration-200 flex items-center gap-2"
                                            onClick={() => {
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
                                            }}
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </Button>
                                        <Button
                                            className="bg-red-600 hover:bg-red-700 text-white flex-1 transition-all duration-200 flex items-center gap-2"
                                            onClick={() => {
                                                if (window.confirm('Delete this static member?')) {
                                                    setStaticMembers(prev => prev.filter((_, i) => i !== idx));
                                                }
                                            }}
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                            {members.map((m, idx) => (
                                <Card key={m.id || idx} className="medical-card text-white p-6 flex flex-col items-center text-center card-hover bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-blue-600/30 rounded-2xl hover:border-blue-500/50 transition-all duration-200">
                                    <img src={m.pictureUrl || m.picture} alt={m.name} className="h-24 w-24 rounded-full object-cover mb-4 shadow-lg border-2 border-blue-500/50" />
                                    <div className="flex-1 w-full">
                                        <div className="font-bold text-lg text-white mb-2">{m.name}</div>
                                        <div className="text-blue-200 text-sm mb-1">{m.institution}</div>
                                        <div className="text-blue-300 text-sm mb-1">{m.email}</div>
                                        <div className="text-blue-300 text-sm font-semibold mb-4">{m.designation}</div>
                                    </div>
                                    <div className="flex gap-2 w-full">
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700 text-white flex-1 transition-all duration-200 flex items-center gap-2"
                                            onClick={() => {
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
                                            }}
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </Button>
                                        <Button
                                            className="bg-red-600 hover:bg-red-700 text-white flex-1 transition-all duration-200 flex items-center gap-2"
                                            onClick={async () => {
                                                if (window.confirm('Delete this member?')) {
                                                    await deleteDoc(doc(db, "members", m.id));
                                                    setMembers(members.filter(mem => mem.id !== m.id));
                                                }
                                            }}
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bulk Members Section */}
                {activeTab === 'bulkmembers' && (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Bulk Members Upload</h2>
                        <BulkMemberUpload />
                    </div>
                )}

                {/* SMAK AI Enquiries Section */}
                {activeTab === 'smakaienquiries' && (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">SMAK AI Project Enquiries</h2>
                        {loadingSMakAI ? (
                            <p className="text-gray-400">Loading enquiries...</p>
                        ) : smakAIEnquiries.length === 0 ? (
                            <p className="text-gray-400">No enquiries received yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {smakAIEnquiries.map((enquiry) => (
                                    <Card key={enquiry.id} className="bg-gray-800/50 border-blue-500/30 overflow-hidden hover:border-blue-400/60 transition-all duration-300">
                                        <CardHeader className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-blue-500/20">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg text-white">{enquiry.fullName}</CardTitle>
                                                    <p className="text-sm text-gray-400 mt-1">{enquiry.email}</p>
                                                </div>
                                                <Badge className={enquiry.status === 'new' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}>
                                                    {enquiry.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase font-semibold">Organization</p>
                                                    <p className="text-gray-200 mt-1">{enquiry.organisation}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase font-semibold">Designation</p>
                                                    <p className="text-gray-200 mt-1">{enquiry.designation}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase font-semibold">Phone</p>
                                                    <p className="text-gray-200 mt-1">{enquiry.phone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase font-semibold">Sector</p>
                                                    <p className="text-gray-200 mt-1">{enquiry.sector}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase font-semibold">Geography</p>
                                                    <p className="text-gray-200 mt-1">{enquiry.geography}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase font-semibold">Therapy Area</p>
                                                    <p className="text-gray-200 mt-1">{enquiry.therapyArea}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase font-semibold">Project Type</p>
                                                    <p className="text-gray-200 mt-1">{enquiry.projectType}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase font-semibold">Sample Size</p>
                                                    <p className="text-gray-200 mt-1">{enquiry.sampleSize}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase font-semibold">Start Date</p>
                                                    <p className="text-gray-200 mt-1">{enquiry.startDate}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase font-semibold">Deliverables</p>
                                                    <p className="text-gray-200 mt-1 capitalize">{enquiry.deliverables}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs uppercase font-semibold mb-2">Project Objective</p>
                                                <p className="text-gray-300 text-sm bg-gray-900/50 p-3 rounded border border-gray-700">{enquiry.objective}</p>
                                            </div>
                                            <div className="pt-2 border-t border-gray-700">
                                                <p className="text-gray-500 text-xs">
                                                    Submitted: {enquiry.submittedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    size="sm"
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={async () => {
                                                        try {
                                                            await updateDoc(doc(db, 'smakAIEnquiries', enquiry.id), { status: 'contacted' });
                                                            setSmakAIEnquiries(prev => prev.map(e => e.id === enquiry.id ? { ...e, status: 'contacted' } : e));
                                                        } catch (error) {
                                                            console.error('Error updating status:', error);
                                                        }
                                                    }}
                                                >
                                                    Mark Contacted
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="flex-1"
                                                    onClick={async () => {
                                                        if (window.confirm('Delete this enquiry?')) {
                                                            try {
                                                                await deleteDoc(doc(db, 'smakAIEnquiries', enquiry.id));
                                                                setSmakAIEnquiries(prev => prev.filter(e => e.id !== enquiry.id));
                                                            } catch (error) {
                                                                console.error('Error deleting enquiry:', error);
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPanel;