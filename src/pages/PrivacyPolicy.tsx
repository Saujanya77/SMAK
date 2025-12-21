import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString();
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Razorpay requirements • Last updated: {lastUpdated}</p>

          <p className="mb-6 text-slate-700 dark:text-slate-300">
            Society for Medical Academia and Knowledge (SMAK) ("we", "our", "us") is committed to protecting the privacy and personal information of its members, collaborators, and participants. This Privacy Policy explains how we collect, use, store, and protect information when you engage with our website, programs, events, and digital platforms.
          </p>

          <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Personal details (name, email address, phone number)</li>
            <li>Academic details (college, course, year of study)</li>
            <li>Membership and participation records</li>
            <li>Research or survey data shared voluntarily</li>
            <li>Usage data for improving platforms and services</li>
            <li>Payment information (processed securely via payment gateways)</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-3">How We Use Information</h2>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>To manage memberships and registrations</li>
            <li>To communicate about events, workshops, and opportunities</li>
            <li>To provide academic, research, and mentorship services</li>
            <li>To improve user experience and organizational operations</li>
            <li>To generate anonymized academic or research insights</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-3">Data Protection & Security</h2>
          <p className="mb-6 text-slate-700 dark:text-slate-300">
            We implement reasonable technical and organizational safeguards to protect personal data. Sensitive data is access-restricted and handled responsibly.
          </p>

          <h2 className="text-2xl font-semibold mb-3">Data Sharing</h2>
          <p className="mb-3 text-slate-700 dark:text-slate-300">We do not sell or rent personal data. Information may be shared only with:</p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Authorized service providers (e.g., payment gateways)</li>
            <li>Partner organizations for joint programs</li>
            <li>Legal/regulatory authorities (if required)</li>
            <li>Aggregated/anonymized data for academic purposes</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-3">User Rights</h2>
          <p className="mb-6 text-slate-700 dark:text-slate-300">Users may request access, correction, or deletion of their personal data.</p>

          <h2 className="text-2xl font-semibold mb-3">Contact</h2>
          <p className="mb-6 text-slate-700 dark:text-slate-300">📧 contact@smak.in</p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
