import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import {
  Database,
  BarChart3,
  Bell,
  ClipboardList,
  FileText,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  Download,
  Mail,
  Phone,
  MapPin,
  Shield,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

const SmakAI = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    organisation: '',
    designation: '',
    email: '',
    phone: '',
    sector: '',
    geography: '',
    therapyArea: '',
    projectType: '',
    sampleSize: '',
    startDate: '',
    deliverables: '',
    objective: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'smakAIEnquiries'), {
        ...formData,
        submittedAt: new Date(),
        status: 'new'
      });
      alert('Thank you for your interest! Our team will review and get back to you within 5-7 working days.');
      setFormData({
        fullName: '',
        organisation: '',
        designation: '',
        email: '',
        phone: '',
        sector: '',
        geography: '',
        therapyArea: '',
        projectType: '',
        sampleSize: '',
        startDate: '',
        deliverables: '',
        objective: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const features = [
    {
      icon: Database,
      title: 'Digital Data Capture with Medicean RWE',
      points: [
        'Patient registration with unique subject IDs',
        'Camp, clinic, online and tele-survey data capture',
        'Multi-lingual forms, WhatsApp/Telegram/SMS & Google Forms integration',
        'Longitudinal tracking across visits and follow-ups'
      ]
    },
    {
      icon: BarChart3,
      title: 'Real-World Evidence Dashboards',
      points: [
        'Disease burden and risk profiling',
        'Adherence and persistence trends',
        'Behavioural patterns and perception scores',
        'Cohort segmentation (age, gender, region, therapy, etc.)'
      ]
    },
    {
      icon: Bell,
      title: 'Adherence & Follow-up Programs',
      points: [
        'Automated reminders for medication and appointments',
        'Behavioural nudges via SMS/WhatsApp',
        'Tracking of who actually returns / refills / continues therapy'
      ]
    },
    {
      icon: ClipboardList,
      title: 'Survey & Behavioural Insight Engine',
      points: [
        'Doctor and patient KAP (Knowledge–Attitude–Practice) surveys',
        'Campaign effectiveness measurement',
        'Product/therapy feedback loops'
      ]
    },
    {
      icon: FileText,
      title: 'Insights, Reports & Publications',
      points: [
        'Executive reports for internal strategy',
        'Whitepapers for external communication',
        'Support for peer-reviewed publications (with SMAK Research Club)'
      ]
    }
  ];

  const workflow = [
    {
      number: 1,
      title: 'Discovery Call',
      icon: Lightbulb,
      description: 'Understand your therapy, product or problem statement. Define objectives: adherence, perception, burden, outcome, etc.'
    },
    {
      number: 2,
      title: 'Study & Protocol Design',
      icon: CheckCircle,
      description: 'Define population, sample size, inclusion/exclusion. Choose channels: camps, clinics, online, tele-surveys.'
    },
    {
      number: 3,
      title: 'Deployment with Medicean RWE',
      icon: Zap,
      description: 'Configure digital forms and workflows. Train site teams / volunteers / SMAK members. Launch data capture.'
    },
    {
      number: 4,
      title: 'Monitoring & Quality Control',
      icon: BarChart3,
      description: 'Real-time dashboards for enrollment. Data checks, cleaning and de-duplication. Ethics & privacy oversight.'
    },
    {
      number: 5,
      title: 'Analysis & Insights',
      icon: TrendingUp,
      description: 'Descriptive and comparative analytics. Cohort segmentation & behavioural insights. AI-assisted generation.'
    },
    {
      number: 6,
      title: 'Deliverables & Follow-through',
      icon: FileText,
      description: 'Executive report & slide deck. Optional dashboard access. Optional publication support.'
    }
  ];

  const services = [
    'New therapy RWE pilots',
    'Adherence and persistence studies',
    'KAP surveys (doctors, patients, caregivers)',
    'Camp-based burden mapping (diabetes, hypertension, oncology, etc.)',
    'Digital intervention outcome tracking (apps, devices, reminders)',
    'Public health outreach measurement'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50/30 dark:from-gray-900 dark:to-gray-800">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 min-h-[500px] flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-500 to-pink-400 dark:from-blue-950 dark:via-purple-900 dark:to-pink-900 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-blue-300/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-24 h-24 bg-pink-300/40 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.06]"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-pink-200/20 via-purple-100/10 to-transparent dark:from-pink-900/20 dark:via-purple-800/10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              SMAK AI – Real-World Evidence for the Next Generation of Medicine
            </h1>
            <p className="text-xl text-blue-50 dark:text-blue-100 mb-8 font-semibold drop-shadow-lg leading-relaxed">
              SMAK AI is the data and AI wing of the Society for Medical Academia & Knowledge. We combine medical students, clinicians and data scientists with the Medicean RWE platform to run real-world evidence (RWE) studies, digital health surveys and adherence programs for pharma, medtech, healthtech, NGOs and hospitals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg">
                Discuss a Project
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/20 px-8 py-3 text-lg font-semibold">
                <Download className="h-5 w-5 mr-2" />
                Download Capability Deck
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is SMAK AI */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              What is SMAK AI?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              SMAK AI is a student-driven, clinician-guided RWE lab powered by Medicean RWE, our digital platform for capturing and analysing health data in real-world settings. We design and execute:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Treatment Adherence Studies</h3>
                  <p className="text-gray-600 dark:text-gray-400">Understanding real-world medication adherence patterns</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Behavioural & Perception Surveys</h3>
                  <p className="text-gray-600 dark:text-gray-400">Capturing patient and provider perspectives</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Camp-Based Screening Programs</h3>
                  <p className="text-gray-600 dark:text-gray-400">Community health outreach and follow-up</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Real-World Outcomes Tracking</h3>
                  <p className="text-gray-600 dark:text-gray-400">For new therapies and devices</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-6 rounded">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>All studies are run with ethical oversight, de-identified data, and clear partnerships with our clients and collaborators.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gradient-to-br from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Key Features of SMAK AI
          </h2>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Product + Service excellence built on Medicean RWE platform
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {feature.points.map((point, pidx) => (
                        <li key={pidx} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Real-World Impact
            </h2>
            <h3 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-gray-200">
              How SMAK AI Helped a Mid-Size Pharma Understand Oncology Adherence
            </h3>

            <div className="space-y-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-600">
                <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                  A mid-size oncology company wanted to understand why patients were dropping off therapy after 2–3 cycles, despite strong clinical data.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-blue-500 to-purple-600">
                    <CardTitle className="text-white flex items-center gap-2">
                      <span className="bg-white text-blue-600 font-bold px-3 py-1 rounded-full">1</span>
                      Study Design
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li>• Real-world adherence study across 3 cities</li>
                      <li>• Target: 400 oncology patients over 6 months</li>
                      <li>• Key questions: barriers, side-effects, affordability, support needs</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-purple-500 to-pink-600">
                    <CardTitle className="text-white flex items-center gap-2">
                      <span className="bg-white text-purple-600 font-bold px-3 py-1 rounded-full">2</span>
                      Data Capture
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li>• Patient registration with unique IDs</li>
                      <li>• Baseline clinical data & socio-demographics</li>
                      <li>• WhatsApp + Google Form follow-up surveys</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-pink-500 to-rose-600">
                    <CardTitle className="text-white flex items-center gap-2">
                      <span className="bg-white text-pink-600 font-bold px-3 py-1 rounded-full">3</span>
                      AI Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li>• Identified 3 core drop-off drivers</li>
                      <li>• Risk factor segmentation</li>
                      <li>• Intervention impact simulation</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-rose-500 to-orange-600">
                    <CardTitle className="text-white flex items-center gap-2">
                      <span className="bg-white text-rose-600 font-bold px-3 py-1 rounded-full">4</span>
                      Results & Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li>• Executive dashboards & reports</li>
                      <li>• Publication-ready manuscript</li>
                      <li>• 15-20% projected improvement in persistence</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-16 bg-gradient-to-br from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            How SMAK AI Works
          </h2>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-12">
            A structured 6-step workflow from discovery to delivery
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflow.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.number} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-bl-full"></div>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-4xl font-bold text-gray-200 dark:text-gray-700">{step.number}</span>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            What We Can Help You With
          </h2>
          <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-12">
            Services for companies, NGOs, hospitals and healthcare organisations
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, idx) => (
              <Card key={idx} className="border-2 border-blue-100 dark:border-blue-900/30 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-8">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0 mt-1">
                      <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{service}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gradient-to-br from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Start an RWE / AI Project with SMAK
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Tell us about your project, and our team will review feasibility and get back within 5-7 working days
              </p>
            </div>

            <Card className="border-0 shadow-xl">
              <CardContent className="pt-8">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Full Name *</label>
                      <Input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleFormChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Organisation / Institution *</label>
                      <Input
                        name="organisation"
                        value={formData.organisation}
                        onChange={handleFormChange}
                        placeholder="Company or institution name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Designation / Role *</label>
                      <Input
                        name="designation"
                        value={formData.designation}
                        onChange={handleFormChange}
                        placeholder="Your role"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Work Email *</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="your.email@company.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone / WhatsApp *</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Sector *</label>
                      <select
                        name="sector"
                        value={formData.sector}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      >
                        <option value="">Select sector</option>
                        <option value="pharma">Pharma</option>
                        <option value="medtech">MedTech</option>
                        <option value="healthtech">Healthtech</option>
                        <option value="hospital">Hospital</option>
                        <option value="ngo">NGO</option>
                        <option value="academic">Academic</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Geography / Target Region *</label>
                      <Input
                        name="geography"
                        value={formData.geography}
                        onChange={handleFormChange}
                        placeholder="e.g., North India, Pan-India"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Therapy Area / Focus *</label>
                      <Input
                        name="therapyArea"
                        value={formData.therapyArea}
                        onChange={handleFormChange}
                        placeholder="e.g., oncology, diabetes, mental health"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Project Type *</label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      >
                        <option value="">Select project type</option>
                        <option value="adherence">Adherence study</option>
                        <option value="rwe">RWE pilot</option>
                        <option value="survey">Survey</option>
                        <option value="camp">Camp program</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Approximate Sample Size or Scale *</label>
                      <Input
                        name="sampleSize"
                        value={formData.sampleSize}
                        onChange={handleFormChange}
                        placeholder="e.g., 100-500 patients, 3 cities"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Desired Start Date & Duration *</label>
                      <Input
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleFormChange}
                        placeholder="e.g., Q1 2026, 6 months"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Expected Deliverables *</label>
                      <select
                        name="deliverables"
                        value={formData.deliverables}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      >
                        <option value="">Select deliverables</option>
                        <option value="dashboards">Dashboards</option>
                        <option value="report">Report</option>
                        <option value="publication">Publication support</option>
                        <option value="all">All</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Short Description of Your Objective *</label>
                    <Textarea
                      name="objective"
                      value={formData.objective}
                      onChange={handleFormChange}
                      placeholder="Tell us about your challenge and what you hope to achieve"
                      rows={5}
                      required
                    />
                  </div>

                  <Button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-lg disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Project Enquiry'}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-6 rounded">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Once you share your details, our SMAK AI team will review the feasibility and get back within 5–7 working days to schedule a scoping call.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join SMAK AI */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardContent className="pt-12">
                <h2 className="text-3xl font-bold mb-6 text-center">For Students & Clinicians – Join SMAK AI</h2>
                <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-8">
                  Are you a medical student or young doctor interested in AI & research?
                </p>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Users className="h-6 w-6 text-blue-600" />
                    SMAK AI trains student cohorts in:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 dark:text-gray-300">Study design & protocol writing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 dark:text-gray-300">Data collection & ethics</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 dark:text-gray-300">Basic statistics & interpretation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-gray-700 dark:text-gray-300">Scientific writing and publications</span>
                    </li>
                  </ul>
                </div>

                <p className="text-center text-gray-700 dark:text-gray-300 font-semibold">
                  Watch out for SMAK AI Research Cohort announcements on our social channels.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ethics & Compliance */}
      <section className="py-16 bg-gradient-to-br from-blue-50/50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-lg border-l-4 border-blue-600">
              <CardHeader className="bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Ethics, Privacy & Compliance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">De-Identified Data</h4>
                      <p className="text-gray-700 dark:text-gray-300">All data is de-identified before analysis to protect participant privacy</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Informed Consent</h4>
                      <p className="text-gray-700 dark:text-gray-300">Participants are enrolled with informed consent where applicable</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Data Ownership</h4>
                      <p className="text-gray-700 dark:text-gray-300">SMAK AI does not sell personal data; we work on aggregated and anonymised datasets</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Regulatory Compliance</h4>
                      <p className="text-gray-700 dark:text-gray-300">Project-specific ethics approvals and data-sharing agreements are signed with partner organisations for larger studies</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SmakAI;
