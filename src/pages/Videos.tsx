import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Navigation from '@/components/Navigation';
import { Video, Plus, Search, Filter, Play, Eye, Calendar, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Videos = () => {
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: "Live Surgery: Laparoscopic Procedures",
      speaker: "Dr. Vikram Rajesh",
      duration: "45:30",
      views: "2.1k",
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop",
      category: "Surgery",
      description: "Comprehensive demonstration of advanced laparoscopic surgical techniques...",
      uploadDate: "2024-01-15",
      tags: ["Surgery", "Laparoscopy", "Live Demo"]
    },
    {
      id: 2,
      title: "Clinical Skills: Patient Interview Techniques",
      speaker: "Dr. Meera Joshi", 
      duration: "28:15",
      views: "1.8k",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=225&fit=crop",
      category: "Clinical Skills",
      description: "Essential patient communication and interview skills for medical students...",
      uploadDate: "2024-01-12",
      tags: ["Clinical Skills", "Communication", "Patient Care"]
    },
    {
      id: 3,
      title: "Cardiology Grand Rounds: Heart Failure Management",
      speaker: "Dr. Ravi Kumar",
      duration: "52:45",
      views: "3.2k",
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop",
      category: "Cardiology",
      description: "Advanced heart failure management strategies and latest treatment protocols...",
      uploadDate: "2024-01-08",
      tags: ["Cardiology", "Heart Failure", "Treatment"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    category: '',
    speaker: '',
    duration: '',
    videoUrl: '',
    thumbnail: ''
  });

  const categories = ['Surgery', 'Clinical Skills', 'Cardiology', 'Neurology', 'Pediatrics', 'Radiology'];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddVideo = () => {
    if (newVideo.title && newVideo.description && newVideo.category) {
      const video = {
        id: Date.now(),
        ...newVideo,
        views: "0",
        uploadDate: new Date().toISOString().split('T')[0],
        thumbnail: newVideo.thumbnail || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop",
        tags: [newVideo.category]
      };
      setVideos([video, ...videos]);
      setNewVideo({ title: '', description: '', category: '', speaker: '', duration: '', videoUrl: '', thumbnail: '' });
      setIsAddDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/10 dark:to-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold flex items-center mb-2">
                <Video className="h-10 w-10 mr-3 text-blue-600" />
                Video Library
              </h1>
              <p className="text-lg text-muted-foreground">
                Educational videos, lectures, and surgical demonstrations
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-5 w-5 mr-2" />
                  Upload Video
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload Educational Video</DialogTitle>
                  <DialogDescription>
                    Share your medical knowledge through video content
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Video Title</Label>
                    <Input
                      id="title"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                      placeholder="Enter video title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newVideo.category} onValueChange={(value) => setNewVideo({...newVideo, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={newVideo.duration}
                        onChange={(e) => setNewVideo({...newVideo, duration: e.target.value})}
                        placeholder="e.g., 45:30"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="speaker">Speaker/Presenter</Label>
                    <Input
                      id="speaker"
                      value={newVideo.speaker}
                      onChange={(e) => setNewVideo({...newVideo, speaker: e.target.value})}
                      placeholder="Enter speaker name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <Input
                      id="videoUrl"
                      value={newVideo.videoUrl}
                      onChange={(e) => setNewVideo({...newVideo, videoUrl: e.target.value})}
                      placeholder="Enter video URL or file path"
                    />
                  </div>
                  <div>
                    <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
                    <Input
                      id="thumbnail"
                      value={newVideo.thumbnail}
                      onChange={(e) => setNewVideo({...newVideo, thumbnail: e.target.value})}
                      placeholder="Enter thumbnail image URL"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newVideo.description}
                      onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                      placeholder="Describe the video content..."
                      rows={4}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddVideo} className="flex-1">Upload Video</Button>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="hover:shadow-lg transition-all duration-300 border-2 border-blue-100 dark:border-blue-900/20">
              <div className="relative group cursor-pointer">
                <div className="relative rounded-t-lg overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Play className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                  <Badge className="absolute top-3 right-3 bg-white/90 text-black">
                    {video.category}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg hover:text-blue-600 cursor-pointer line-clamp-2">
                  {video.title}
                </CardTitle>
                <CardDescription>
                  By {video.speaker}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {video.views} views
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {video.uploadDate}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button className="flex-1" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Watch
                  </Button>
                  <Button variant="outline" size="sm">Save</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No videos found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;