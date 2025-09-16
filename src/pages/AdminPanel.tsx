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
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
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

const AdminPanel: React.FC = () => {
    const { user } = useAuth();
    const [pendingJournals, setPendingJournals] = useState<Journal[]>([]);
    const [pendingBlogs, setPendingBlogs] = useState<Blog[]>([]);
    const [loadingJournals, setLoadingJournals] = useState(true);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [activeTab, setActiveTab] = useState<'journals' | 'blogs'>('journals');

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
    }, []);

    useEffect(() => {
        const fetchPendingBlogs = async () => {
            setLoadingBlogs(true);
            const querySnapshot = await getDocs(collection(db, "blogs"));
            const pending = querySnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() } as Blog))
                .filter((blog) => blog.status === "pending");
            setPendingBlogs(pending);
            setLoadingBlogs(false);
        };
        fetchPendingBlogs();
    }, []);

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
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Admin Panel</h1>
            <div className="flex justify-center mb-8">
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
                </div>
            </div>
            <div className="grid gap-6">
                {activeTab === 'journals' ? (
                    loadingJournals ? (
                        <p>Loading pending journals...</p>
                    ) : pendingJournals.length === 0 ? (
                        <p>No pending journals for approval.</p>
                    ) : (
                        pendingJournals.map((journal) => (
                            <Card key={journal.id} className="bg-gray-800 text-white p-6">
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
                ) : (
                    loadingBlogs ? (
                        <p>Loading pending blogs...</p>
                    ) : pendingBlogs.length === 0 ? (
                        <p>No pending blogs for approval.</p>
                    ) : (
                        pendingBlogs.map((blog) => (
                            <Card key={blog.id} className="bg-gray-800 text-white p-6">
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
            </div>
        </div>
    );
};

export default AdminPanel;
