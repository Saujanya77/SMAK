import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download, Eye, ExternalLink, Users, Shield, BookOpen, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';



// GuidelineCard Component
interface GuidelineCardProps {
  title: string;
  description: string;
  content: string[];
  pdfUrl?: string;
  category: string;
}

const GuidelineCard = ({ title, description, content, pdfUrl, category }: GuidelineCardProps) => {
  const [showContent, setShowContent] = useState(false);

  return (
    <Card className="guideline-card card-hover">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground mb-2">{title}</CardTitle>
            <CardDescription className="text-muted-foreground">{description}</CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2 text-xs">
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gradient">{title}</DialogTitle>
                </DialogHeader>
                <div className="mt-6 space-y-4">
                  <p className="text-muted-foreground">{description}</p>
                  <div className="space-y-3">
                    {content.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                        <p className="text-sm text-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                  {pdfUrl && (
                    <div className="mt-6 p-4 rounded-lg bg-medical-gradient-light">
                      <h4 className="font-semibold text-foreground mb-2">PDF Resource</h4>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => window.open(pdfUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                          View PDF
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = pdfUrl;
                            link.download = `${title.replace(/\s+/g, '_')}_Guidelines.pdf`;
                            link.click();
                          }}
                        >
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            
          </div>
          
          <div className="text-sm text-muted-foreground">
            {content.length} guidelines • Click to view full details
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// GuidelinesHero Component
const GuidelinesHero = () => {
  return (
    <div className="relative overflow-hidden bg-grid-pattern">
      <div className="bg-medical-gradient text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              SJMSR Guidelines Hub
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 text-blue-100 animate-slide-up">
              Comprehensive guidelines for authors, reviewers, and editorial excellence
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="font-semibold">Submission</h3>
                <p className="text-sm text-blue-100">Clear submission process</p>
              </div>
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="font-semibold">Review</h3>
                <p className="text-sm text-blue-100">Peer review standards</p>
              </div>
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="font-semibold">Ethics</h3>
                <p className="text-sm text-blue-100">COPE & ICMJE compliance</p>
              </div>
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="font-semibold">Editorial</h3>
                <p className="text-sm text-blue-100">Editorial excellence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// GuidelinesFooter Component
const GuidelinesFooter = () => {
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (isChecked) {
      navigate('/login');
    }
  };

  return (
    <div className="mt-16 pb-16">
      <Card className="medical-card border-2 border-primary/20">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-medical-gradient rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gradient mb-2">
                Ready to Submit Your Journal?
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                By checking the box below, you confirm that you have read and understood all the SJMSR guidelines.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 py-4">
              <Checkbox 
                id="guidelines-confirmation" 
                checked={isChecked}
                onCheckedChange={(checked) => setIsChecked(checked === true)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label 
                htmlFor="guidelines-confirmation" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Yes, I have gone through all the guidelines
              </label>
            </div>

            <Button 
  size="lg"
  disabled={!isChecked}
  onClick={() => window.location.href = "/login"} // change "/login" to your actual login path
  className="btn-medical px-8 py-4 text-lg font-semibold flex items-center gap-2 focus-ring"
>
  Let's Start Submitting Journals
  <ArrowRight className="h-5 w-5" />
</Button>

            {!isChecked && (
              <p className="text-xs text-muted-foreground">
                Please confirm that you have read all guidelines to proceed
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Index Component
const Index = () => {
  const guidelines = [
    {
      title: "Submission Guidelines",
      description: "Comprehensive instructions for manuscript submission, formatting, and requirements.",
      category: "Submission",
      content: [
        "Manuscripts must be submitted electronically through our online submission system",
        "All submissions should follow the standard medical journal format (IMRAD: Introduction, Methods, Results, and Discussion)",
        "Maximum word count: 4000 words for original research, 2500 for reviews, 1000 for case reports",
        "Include a structured abstract of 250 words maximum with Background, Methods, Results, and Conclusion",
        "Provide 3-6 keywords using MeSH terminology when possible",
        "All references should follow Vancouver style numbering system",
        "Include conflict of interest disclosure and funding sources",
        "Ensure ethical approval documentation is attached for human/animal studies"
      ],
      pdfUrl: "https://example.com/submission-guidelines.pdf"
    },
    {
      title: "Author Guidelines",
      description: "Essential requirements and responsibilities for authors contributing to SJMSR.",
      category: "Authors",
      content: [
        "All authors must meet ICMJE authorship criteria: substantial contribution to conception, data acquisition, analysis, or interpretation",
        "Corresponding author serves as primary point of contact and ensures all co-authors approve final manuscript",
        "Authors must disclose all financial and personal relationships that could bias their work",
        "Plagiarism screening: All manuscripts undergo similarity checking using professional software",
        "Data sharing: Authors should be prepared to share raw data upon reasonable request",
        "Copyright: Authors retain copyright while granting SJMSR publication rights",
        "Author order: Changes to authorship after submission require written consent from all authors",
        "ORCID IDs are strongly recommended for all authors to ensure proper attribution"
      ],
      pdfUrl: "https://pdf.ac/lURshcabO"
    },
    {
      title: "Journal Policies for SJMSR",
      description: "Official policies governing publication standards, ethics, and editorial decisions.",
      category: "Policies",
      content: [
        "Open access policy: All articles are freely available immediately upon publication",
        "Peer review: Double-blind review process with 2-3 expert reviewers per manuscript",
        "Publication ethics: Strict adherence to COPE (Committee on Publication Ethics) guidelines",
        "Retraction policy: Articles may be retracted for scientific misconduct, plagiarism, or significant errors",
        "Editorial independence: Editorial decisions are based solely on scientific merit and journal scope",
        "Appeals process: Authors may appeal editorial decisions with substantial new evidence or corrections",
        "Archival policy: All content is permanently archived in multiple digital repositories",
        "Language: Manuscripts accepted in English; professional language editing services available"
      ],
      pdfUrl: "https://journal-policy-sjmsr-pdf-20250724-085446-0000.tiiny.site"
    },
    {
      title: "Editorial Policy of SJMSR",
      description: "Guidelines defining editorial scope, decision-making processes, and quality standards.",
      category: "Editorial",
      content: [
        "Scope: Focus on innovative research in medical sciences, clinical studies, and healthcare advancement",
        "Editorial board: Comprises leading experts across medical specialties with diverse geographical representation",
        "Manuscript categories: Original research, systematic reviews, case reports, brief communications, letters to editor",
        "Decision criteria: Scientific rigor, novelty, clinical relevance, methodological soundness, and clear presentation",
        "Turnaround time: Initial editorial decision within 14 days, peer review completed within 8 weeks",
        "Revision policy: Authors given opportunity to address reviewer comments with guided revisions",
        "Quality assurance: Statistical review for quantitative studies, methodology validation for clinical trials",
        "International standards: Compliance with ICMJE, COPE, and WHO publication standards"
      ],
      pdfUrl: "https://pdf.ac/EmwlnUmP"
    },
    {
      title: "Editorial & Governance Structure",
      description: "Organizational framework detailing editorial board structure and governance protocols.",
      category: "Governance",
      content: [
        "Editor-in-Chief: Overall responsibility for journal direction, quality, and editorial independence",
        "Associate Editors: Specialized expertise in specific medical fields, handle manuscript assignments",
        "Editorial Board: International experts providing strategic guidance and peer review oversight",
        "Student Editorial Committee: Medical students involved in initial manuscript screening and learning",
        "Editorial meetings: Monthly board meetings to discuss policy, quality metrics, and strategic direction",
        "Term limits: Editorial board members serve 3-year renewable terms to ensure fresh perspectives",
        "Conflict management: Clear protocols for handling conflicts of interest among editorial board members",
        "Performance metrics: Regular assessment of editorial efficiency, reviewer quality, and publication impact"
      ],
      pdfUrl: "https://pdf.ac/xoUKmW05"
    },
    {
      title: "Reviewer Guidelines",
      description: "Comprehensive instructions for peer reviewers ensuring consistent, high-quality review process.",
      category: "Review",
      content: [
        "Reviewer qualifications: Doctorate in relevant field with demonstrated expertise and publication record",
        "Review timeline: Complete reviews within 3 weeks of acceptance, extensions available upon request",
        "Confidentiality: Strict confidentiality of manuscript content and review process maintained",
        "Review criteria: Assess originality, methodology, statistical analysis, clinical relevance, and presentation quality",
        "Constructive feedback: Provide specific, actionable comments to help authors improve their work",
        "Recommendation categories: Accept, minor revision, major revision, or reject with detailed justification",
        "Reviewer recognition: Annual recognition program and certificates for outstanding reviewer contributions",
        "Training resources: Access to reviewer training modules and best practice guidelines"
      ],
      pdfUrl: "https://pdf.ac/DP3OVinVe8"
    },
    {
      title: "Peer Review & Ethics",
      description: "Transparent, respected peer-review policy ensuring faculty-guided, student-enabled excellence.",
      category: "Ethics",
      content: [
        "Double-blind review: Both author and reviewer identities concealed to ensure unbiased evaluation",
        "Faculty oversight: Senior faculty members supervise student reviewers to maintain quality standards",
        "Ethical standards: Strict adherence to COPE guidelines for publication ethics and research integrity",
        "ICMJE compliance: Full compliance with International Committee of Medical Journal Editors recommendations",
        "Plagiarism detection: Advanced software screening for similarity and originality verification",
        "Research misconduct: Clear protocols for investigating and addressing allegations of misconduct",
        "Editorial integrity: Independent editorial decisions free from commercial or institutional pressure",
        "Transparency: Clear communication of review process, timelines, and decision criteria to all stakeholders"
      ],
      pdfUrl: "https://example.com/peer-review-ethics.pdf"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <GuidelinesHero />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold section-header mb-4">
              Complete Guidelines Overview
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about submitting, reviewing, and maintaining excellence in medical research publication.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {guidelines.map((guideline, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <GuidelineCard {...guideline} />
              </div>
            ))}
          </div>

          <GuidelinesFooter />
        </div>
      </div>
    </div>
  );
};

export default Index;
