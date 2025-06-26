import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Download, 
  Search,
  Bell,
  ChevronDown,
  User, 
  Settings, 
  LogOut, 
  Sun,
  Moon,
  X,
  Clock,
  AlertTriangle,
  Phone,
  Heart,
  Brain,
  Zap,
  Users,
  Activity,
  Shield,
  Plus,
  Filter,
  Upload,
  Image
} from 'lucide-react';

const EmergencyProtocols = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<EmergencyProtocol | null>(null);
  const [showFullProtocol, setShowFullProtocol] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const navigate = useNavigate();

  interface EmergencyProtocol {
    id: number;
    title: string;
    description: string;
    category: string;
    priority: string;
    timeframe: string;
    image: string;
    steps: string[];
    signs: string[];
    immediateActions: string[];
    medications: string[];
    contraindications: string[];
    followUp: string;
    icon: React.ReactNode;
  }

  const user = {
    name: "Dr. John Doe",
    year: "3rd Year MBBS",
    college: "SMAK Medical College",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
  };

  const [emergencyProtocols, setEmergencyProtocols] = useState<EmergencyProtocol[]>([
    {
      id: 1,
      title: "Acute Stroke (FAST Protocol)",
      description: "Rapid assessment and management of suspected stroke patients using the FAST protocol for optimal outcomes.",
      category: "Neurology",
      priority: "Critical",
      timeframe: "< 4.5 hours",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
      icon: <Brain className="h-6 w-6" />,
      steps: [
        "Ensure scene safety and approach patient",
        "Perform primary assessment (ABCDE)",
        "Check blood glucose level immediately",
        "Perform FAST assessment: Face, Arms, Speech, Time",
        "Obtain IV access and draw blood samples",
        "Perform neurological examination (NIHSS)",
        "Urgent CT scan of head without contrast",
        "Consider thrombolytic therapy if within window",
        "Monitor vital signs and neurological status",
        "Prepare for potential transfer to stroke center"
      ],
      signs: [
        "Sudden onset facial drooping",
        "Arm weakness or numbness",
        "Speech difficulties or slurred speech",
        "Sudden severe headache",
        "Loss of balance or coordination",
        "Sudden vision changes",
        "Altered level of consciousness"
      ],
      immediateActions: [
        "Call for immediate medical assistance",
        "Note time of symptom onset",
        "Keep patient calm and lying flat",
        "Do NOT give food or water",
        "Monitor airway and breathing",
        "Prepare for rapid transport"
      ],
      medications: [
        "Alteplase (tPA) if within 4.5 hours",
        "Aspirin 325mg (after hemorrhage excluded)",
        "Antihypertensives if BP >220/120",
        "Antiemetics if nausea/vomiting"
      ],
      contraindications: [
        "Hemorrhagic stroke on CT",
        "Recent surgery or trauma",
        "Active bleeding or coagulopathy",
        "Severe hypertension (>185/110)",
        "Pregnancy",
        "Age considerations (relative)"
      ],
      followUp: "Continuous monitoring in stroke unit, physical therapy evaluation, speech therapy if needed, and secondary prevention measures."
    },
    {
      id: 2,
      title: "Cardiac Arrest (CPR/AED)",
      description: "Immediate cardiopulmonary resuscitation and advanced cardiac life support for cardiac arrest victims.",
      category: "Emergency Medicine",
      priority: "Critical",
      timeframe: "Immediate",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
      icon: <Heart className="h-6 w-6" />,
      steps: [
        "Check responsiveness and breathing",
        "Call for help and request AED",
        "Position patient on firm surface",
        "Begin chest compressions (30:2 ratio)",
        "Apply AED pads and follow prompts",
        "Continue CPR cycles until help arrives",
        "Establish IV/IO access when available",
        "Administer medications per ACLS protocol",
        "Consider reversible causes (H's and T's)",
        "Continue resuscitation efforts appropriately"
      ],
      signs: [
        "Unresponsive to verbal/tactile stimuli",
        "Absent or abnormal breathing",
        "No palpable pulse",
        "Cyanosis or pallor",
        "Unconsciousness",
        "Witnessed collapse"
      ],
      immediateActions: [
        "Start chest compressions immediately",
        "Call 911 and get AED",
        "Push hard and fast (100-120/min)",
        "Allow complete chest recoil",
        "Minimize interruptions",
        "Switch compressors every 2 minutes"
      ],
      medications: [
        "Epinephrine 1mg IV every 3-5 minutes",
        "Amiodarone 300mg IV for VF/VT",
        "Atropine 1mg IV for asystole/PEA",
        "Sodium bicarbonate if indicated"
      ],
      contraindications: [
        "Obviously deceased (rigor mortis)",
        "Do Not Resuscitate (DNR) order",
        "Futile resuscitation scenarios",
        "Unsafe scene conditions"
      ],
      followUp: "Post-cardiac arrest care, therapeutic hypothermia consideration, neurological assessment, and underlying cause investigation."
    },
    {
      id: 3,
      title: "Anaphylaxis Management",
      description: "Rapid recognition and treatment of severe allergic reactions with epinephrine and supportive care.",
      category: "Allergy/Immunology",
      priority: "Critical",
      timeframe: "< 15 minutes",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=400&fit=crop",
      icon: <AlertTriangle className="h-6 w-6" />,
      steps: [
        "Recognize anaphylaxis symptoms",
        "Remove or avoid triggering allergen",
        "Administer epinephrine immediately",
        "Call for emergency medical assistance",
        "Position patient appropriately",
        "Establish IV access and give fluids",
        "Administer H1 and H2 antihistamines",
        "Give corticosteroids",
        "Monitor for biphasic reactions",
        "Provide patient education and EpiPen"
      ],
      signs: [
        "Sudden onset skin reactions (hives, itching)",
        "Swelling of face, lips, tongue, throat",
        "Difficulty breathing or wheezing",
        "Rapid weak pulse",
        "Nausea, vomiting, diarrhea",
        "Dizziness or fainting",
        "Feeling of impending doom"
      ],
      immediateActions: [
        "Administer epinephrine auto-injector",
        "Call emergency services immediately",
        "Remove allergen source if known",
        "Keep patient lying flat",
        "Monitor airway and breathing",
        "Be prepared for second injection"
      ],
      medications: [
        "Epinephrine 0.3-0.5mg IM (first-line)",
        "Diphenhydramine 25-50mg IV/IM",
        "Ranitidine 50mg IV or famotidine 20mg IV",
        "Methylprednisolone 125mg IV",
        "Albuterol if bronchospasm",
        "Glucagon if on beta-blockers"
      ],
      contraindications: [
        "No absolute contraindications for epinephrine",
        "Caution with severe hypertension",
        "Caution with coronary artery disease",
        "Avoid delays in treatment"
      ],
      followUp: "Observation for 4-6 hours, allergy specialist referral, EpiPen prescription and training, and allergen avoidance education."
    },
    {
      id: 4,
      title: "Severe Asthma Exacerbation",
      description: "Management of acute severe asthma attacks with bronchodilators and systemic corticosteroids.",
      category: "Pulmonology",
      priority: "High",
      timeframe: "< 30 minutes",
      image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600&h=400&fit=crop",
      icon: <Activity className="h-6 w-6" />,
      steps: [
        "Assess severity of exacerbation",
        "Position patient upright",
        "Administer high-flow oxygen",
        "Give bronchodilators (SABA)",
        "Administer systemic corticosteroids",
        "Monitor oxygen saturation and ABG",
        "Consider magnesium sulfate",
        "Assess response to treatment",
        "Consider ICU admission if severe",
        "Plan discharge with action plan"
      ],
      signs: [
        "Severe breathlessness",
        "Unable to speak in full sentences",
        "Use of accessory muscles",
        "Wheeze or silent chest",
        "Tachycardia >120 bpm",
        "Peak flow <50% predicted",
        "Cyanosis or altered consciousness"
      ],
      immediateActions: [
        "Sit patient upright",
        "Give high-flow oxygen",
        "Administer bronchodilator",
        "Stay calm and reassure patient",
        "Monitor breathing closely",
        "Call for medical help"
      ],
      medications: [
        "Albuterol 2.5-5mg nebulized q20min",
        "Ipratropium 0.5mg nebulized",
        "Prednisolone 40-50mg PO",
        "Methylprednisolone 125mg IV",
        "Magnesium sulfate 2g IV over 20min",
        "Epinephrine if near-fatal"
      ],
      contraindications: [
        "Avoid sedatives",
        "Avoid beta-blockers",
        "Caution with theophylline",
        "Avoid chest physiotherapy"
      ],
      followUp: "Peak flow monitoring, inhaler technique review, asthma action plan update, and follow-up with pulmonologist."
    },
    {
      id: 5,
      title: "Diabetic Ketoacidosis (DKA)",
      description: "Management of severe diabetic ketoacidosis with insulin, fluids, and electrolyte replacement.",
      category: "Endocrinology",
      priority: "High",
      timeframe: "< 1 hour",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=400&fit=crop",
      icon: <Zap className="h-6 w-6" />,
      steps: [
        "Confirm DKA diagnosis (glucose, ketones, pH)",
        "Assess level of consciousness",
        "Begin IV fluid resuscitation",
        "Start insulin infusion",
        "Monitor electrolytes closely",
        "Replace potassium as needed",
        "Monitor for cerebral edema",
        "Treat underlying precipitant",
        "Transition to subcutaneous insulin",
        "Monitor for complications"
      ],
      signs: [
        "Blood glucose >250 mg/dL",
        "Ketones in blood/urine",
        "Arterial pH <7.3",
        "Kussmaul respirations",
        "Fruity breath odor",
        "Altered mental status",
        "Dehydration signs"
      ],
      immediateActions: [
        "Check blood glucose immediately",
        "Test for ketones",
        "Start IV access",
        "Begin fluid replacement",
        "Call for medical assistance",
        "Monitor vital signs"
      ],
      medications: [
        "Regular insulin 0.1 units/kg/hr IV",
        "Normal saline 15-20 mL/kg/hr",
        "Potassium chloride 20-30 mEq/L",
        "Sodium bicarbonate if pH <7.0",
        "Phosphate replacement if needed"
      ],
      contraindications: [
        "Avoid insulin bolus initially",
        "Avoid rapid fluid correction",
        "Caution with bicarbonate use",
        "Monitor for hypokalemia"
      ],
      followUp: "Diabetes education, insulin regimen adjustment, monitoring for complications, and endocrinology follow-up."
    },
    {
      id: 6,
      title: "Seizure Management",
      description: "Immediate care for seizure patients including airway protection and antiepileptic medications.",
      category: "Neurology",
      priority: "High",
      timeframe: "< 5 minutes",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop",
      icon: <Brain className="h-6 w-6" />,
      steps: [
        "Ensure scene and patient safety",
        "Protect airway and breathing",
        "Position patient on side",
        "Time the seizure duration",
        "Remove harmful objects nearby",
        "Administer oxygen if needed",
        "Give antiepileptic if >5 minutes",
        "Monitor vital signs",
        "Assess post-ictal state",
        "Investigate underlying cause"
      ],
      signs: [
        "Rhythmic jerking movements",
        "Loss of consciousness",
        "Tongue biting",
        "Incontinence",
        "Cyanosis during seizure",
        "Post-ictal confusion",
        "Status epilepticus if >5 minutes"
      ],
      immediateActions: [
        "Stay with patient",
        "Time the seizure",
        "Clear area of dangerous objects",
        "Turn patient on side",
        "Do NOT restrain patient",
        "Call for help if prolonged"
      ],
      medications: [
        "Lorazepam 0.1mg/kg IV (max 4mg)",
        "Diazepam 0.15mg/kg IV",
        "Midazolam 10mg IM if no IV",
        "Phenytoin 20mg/kg IV loading",
        "Levetiracetam 60mg/kg IV",
        "Valproic acid 40mg/kg IV"
      ],
      contraindications: [
        "Do not put anything in mouth",
        "Avoid restraining patient",
        "Do not give oral medications",
        "Avoid excessive stimulation"
      ],
      followUp: "EEG monitoring, neuroimaging if indicated, antiepileptic drug level monitoring, and neurology consultation."
    },
    {
      id: 7,
      title: "Massive Bleeding/Hemorrhage",
      description: "Rapid control of severe bleeding with direct pressure, tourniquets, and blood product transfusion.",
      category: "Trauma/Surgery",
      priority: "Critical",
      timeframe: "Immediate",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=400&fit=crop",
      icon: <Shield className="h-6 w-6" />,
      steps: [
        "Ensure scene safety first",
        "Apply direct pressure to wound",
        "Elevate bleeding extremity",
        "Apply tourniquet if extremity bleeding",
        "Establish large bore IV access",
        "Send blood for type and crossmatch",
        "Begin blood product transfusion",
        "Monitor vital signs closely",
        "Prepare for surgical intervention",
        "Activate massive transfusion protocol"
      ],
      signs: [
        "Visible active bleeding",
        "Hypotension (SBP <90)",
        "Tachycardia >100 bpm",
        "Altered mental status",
        "Pale, cool, clammy skin",
        "Decreased urine output",
        "Signs of shock"
      ],
      immediateActions: [
        "Apply direct pressure immediately",
        "Call for emergency help",
        "Elevate bleeding part if possible",
        "Apply tourniquet if needed",
        "Keep patient warm",
        "Monitor consciousness level"
      ],
      medications: [
        "Tranexamic acid 1g IV over 10min",
        "Packed RBCs as needed",
        "Fresh frozen plasma",
        "Platelets if thrombocytopenic",
        "Factor concentrates if indicated",
        "Vasopressors if needed"
      ],
      contraindications: [
        "Avoid removing impaled objects",
        "Do not remove blood clots",
        "Avoid excessive crystalloid fluids",
        "Caution with anticoagulated patients"
      ],
      followUp: "Surgical consultation, hematology evaluation, monitoring for complications, and rehabilitation planning."
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'High',
    timeframe: '',
    steps: '',
    signs: '',
    immediateActions: '',
    medications: '',
    contraindications: '',
    followUp: ''
  });

  const categories = ['All', 'Neurology', 'Emergency Medicine', 'Allergy/Immunology', 'Pulmonology', 'Endocrinology', 'Trauma/Surgery'];
  const priorities = ['All', 'Critical', 'High', 'Medium'];

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const handleViewFullProtocol = (protocol: EmergencyProtocol) => {
    setSelectedProtocol(protocol);
    setShowFullProtocol(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitProtocol = () => {
    if (!formData.title || !formData.description || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    const getIconForCategory = (category: string) => {
      switch (category) {
        case 'Neurology': return <Brain className="h-6 w-6" />;
        case 'Emergency Medicine': return <Heart className="h-6 w-6" />;
        case 'Allergy/Immunology': return <AlertTriangle className="h-6 w-6" />;
        case 'Pulmonology': return <Activity className="h-6 w-6" />;
        case 'Endocrinology': return <Zap className="h-6 w-6" />;
        case 'Trauma/Surgery': return <Shield className="h-6 w-6" />;
        default: return <AlertTriangle className="h-6 w-6" />;
      }
    };

    const newProtocol: EmergencyProtocol = {
      id: emergencyProtocols.length + 1,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      timeframe: formData.timeframe,
      image: selectedImage || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
      icon: getIconForCategory(formData.category),
      steps: formData.steps.split('\n').filter(step => step.trim() !== ''),
      signs: formData.signs.split('\n').filter(sign => sign.trim() !== ''),
      immediateActions: formData.immediateActions.split('\n').filter(action => action.trim() !== ''),
      medications: formData.medications.split('\n').filter(med => med.trim() !== ''),
      contraindications: formData.contraindications.split('\n').filter(contra => contra.trim() !== ''),
      followUp: formData.followUp
    };

    setEmergencyProtocols(prev => [newProtocol, ...prev]);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: 'High',
      timeframe: '',
      steps: '',
      signs: '',
      immediateActions: '',
      medications: '',
      contraindications: '',
      followUp: ''
    });
    setSelectedImage(null);
    setShowAddForm(false);
    
    alert('Emergency protocol added successfully!');
  };

  const handleDownloadProtocol = (protocol: EmergencyProtocol) => {
    const protocolContent = `
EMERGENCY PROTOCOL: ${protocol.title}
Category: ${protocol.category}
Priority: ${protocol.priority}
Time Frame: ${protocol.timeframe}

DESCRIPTION:
${protocol.description}

SIGNS AND SYMPTOMS:
${protocol.signs.map(sign => `• ${sign}`).join('\n')}

IMMEDIATE ACTIONS:
${protocol.immediateActions.map(action => `• ${action}`).join('\n')}

STEP-BY-STEP PROTOCOL:
${protocol.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

MEDICATIONS:
${protocol.medications.map(med => `• ${med}`).join('\n')}

CONTRAINDICATIONS:
${protocol.contraindications.map(contra => `• ${contra}`).join('\n')}

FOLLOW-UP CARE:
${protocol.followUp}

---
Generated from Medical Emergency Protocols System
Date: ${new Date().toLocaleDateString()}
    `.trim();

    const blob = new Blob([protocolContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${protocol.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_protocol.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredProtocols = emergencyProtocols.filter(protocol => {
    const matchesSearch = protocol.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      protocol.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      protocol.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || protocol.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || protocol.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Full Protocol Modal */}
      {showFullProtocol && selectedProtocol && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Emergency Protocol Details</h2>
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => handleDownloadProtocol(selectedProtocol)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Protocol
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowFullProtocol(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <img 
                    src={selectedProtocol.image} 
                    alt={selectedProtocol.title}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {selectedProtocol.category}
                    </Badge>
                    <Badge className={`${getPriorityColor(selectedProtocol.priority)} text-white`}>
                      {selectedProtocol.priority} Priority
                    </Badge>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      <Clock className="h-3 w-3 mr-1" />
                      {selectedProtocol.timeframe}
                    </Badge>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    {selectedProtocol.icon}
                    <span className="ml-2">{selectedProtocol.title}</span>
                  </h1>
                  <p className="text-gray-700 dark:text-gray-300">{selectedProtocol.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-red-50 dark:bg-red-900/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">Signs & Symptoms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {selectedProtocol.signs.map((sign, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          {sign}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-orange-50 dark:bg-orange-900/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400">Immediate Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {selectedProtocol.immediateActions.map((action, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-orange-500 mr-2">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-blue-50 dark:bg-blue-900/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">Step-by-Step Protocol</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {selectedProtocol.steps.slice(0, 5).map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2 font-medium">{index + 1}.</span>
                          {step}
                        </li>
                      ))}
                      {selectedProtocol.steps.length > 5 && (
                        <li className="text-blue-600 font-medium">... and {selectedProtocol.steps.length - 5} more steps</li>
                      )}
                    </ol>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 dark:bg-green-900/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">Medications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {selectedProtocol.medications.map((med, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {med}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-yellow-50 dark:bg-yellow-900/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Contraindications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {selectedProtocol.contraindications.map((contra, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-500 mr-2">•</span>
                          {contra}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 dark:bg-purple-900/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">Follow-up Care</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedProtocol.followUp}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Emergency Protocols</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search protocols..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <Button 
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2"
              >
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                <ChevronDown className="h-4 w-4" />
              </Button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.college}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Emergency Medical Protocols</h2>
              <p className="text-gray-600 dark:text-gray-400">Life-saving protocols for critical medical emergencies</p>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Protocol
            </Button>
          </div>

          {/* Add New Protocol Form */}
          {showAddForm && (
            <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-900/10">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-300">Add New Emergency Protocol</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create a comprehensive emergency protocol guide</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Protocol Title *</label>
                    <Input 
                      placeholder="Enter protocol title" 
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    >
                      <option value="">Select category</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Emergency Medicine">Emergency Medicine</option>
                      <option value="Allergy/Immunology">Allergy/Immunology</option>
                      <option value="Pulmonology">Pulmonology</option>
                      <option value="Endocrinology">Endocrinology</option>
                      <option value="Trauma/Surgery">Trauma/Surgery</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Pediatrics">Pediatrics</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority Level</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Frame</label>
                    <Input 
                      placeholder="e.g., < 5 minutes, Immediate"
                      value={formData.timeframe}
                      onChange={(e) => handleInputChange('timeframe', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Protocol Image</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                      >
                        <Image className="h-4 w-4 mr-2" />
                        Upload Image
                      </label>
                      {selectedImage && <span className="text-sm text-green-600">Image selected</span>}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                  <Textarea 
                    placeholder="Brief description of the emergency protocol..." 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Signs & Symptoms (one per line)</label>
                    <Textarea 
                      placeholder="List signs and symptoms..." 
                      rows={4}
                      value={formData.signs}
                      onChange={(e) => handleInputChange('signs', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Immediate Actions (one per line)</label>
                    <Textarea 
                      placeholder="List immediate actions to take..." 
                      rows={4}
                      value={formData.immediateActions}
                      onChange={(e) => handleInputChange('immediateActions', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Step-by-Step Protocol (one per line)</label>
                  <Textarea 
                    placeholder="List detailed protocol steps..." 
                    rows={6}
                    value={formData.steps}
                    onChange={(e) => handleInputChange('steps', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Medications (one per line)</label>
                    <Textarea 
                      placeholder="List medications with dosages..." 
                      rows={4}
                      value={formData.medications}
                      onChange={(e) => handleInputChange('medications', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contraindications (one per line)</label>
                    <Textarea 
                      placeholder="List contraindications..." 
                      rows={4}
                      value={formData.contraindications}
                      onChange={(e) => handleInputChange('contraindications', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Follow-up Care</label>
                  <Textarea 
                    placeholder="Describe follow-up care and monitoring..." 
                    rows={3}
                    value={formData.followUp}
                    onChange={(e) => handleInputChange('followUp', e.target.value)}
                  />
                </div>

                {selectedImage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Preview</label>
                    <img src={selectedImage} alt="Preview" className="w-32 h-32 object-cover rounded-md border" />
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button onClick={handleSubmitProtocol} className="bg-blue-600 hover:bg-blue-700">
                    Add Protocol
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters Section */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Protocols</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedPriority('All');
                      setSearchTerm('');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Showing {filteredProtocols.length} of {emergencyProtocols.length} protocols</span>
                {(selectedCategory !== 'All' || selectedPriority !== 'All' || searchTerm) && (
                  <span className="text-blue-600">• Filters active</span>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Protocols Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProtocols.map((protocol) => (
              <Card key={protocol.id} className="group hover:shadow-lg transition-all border-gray-200 hover:border-blue-300 relative">
                <div className="absolute top-3 right-3 z-10">
                  <Badge className={`${getPriorityColor(protocol.priority)} text-white`}>
                    {protocol.priority}
                  </Badge>
                </div>
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={protocol.image} 
                    alt={protocol.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">
                      {protocol.icon}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {protocol.category}
                    </Badge>
                    <span className="text-sm text-gray-500 font-medium flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {protocol.timeframe}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {protocol.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {protocol.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{protocol.steps.length} steps</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{protocol.medications.length} medications</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadProtocol(protocol)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleViewFullProtocol(protocol)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        View Protocol
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProtocols.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No protocols found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyProtocols;
