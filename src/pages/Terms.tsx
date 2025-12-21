import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Terms: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString();
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent mb-4">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">Razorpay requirements • Last updated: {lastUpdated}</p>

          <h2 className="text-2xl font-semibold mb-3">By accessing or participating in SMAK programs, events, or digital platforms, you agree to the following terms:</h2>

          <h3 className="text-xl font-semibold mb-2">Use of Services</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>SMAK services are intended for students, healthcare professionals, and academicians.</li>
            <li>Users must provide accurate and truthful information.</li>
            <li>Any misuse of SMAK platforms, data, or content is prohibited.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Membership & Participation</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Membership benefits are non-transferable.</li>
            <li>SMAK may modify program structures, schedules, or offerings.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Intellectual Property</h3>
          <p className="mb-6 text-slate-700 dark:text-slate-300">All SMAK-created materials, branding, and digital content are the intellectual property of SMAK unless stated otherwise. Unauthorized reproduction or commercial use is prohibited.</p>

          <h3 className="text-xl font-semibold mb-2">Code of Conduct</h3>
          <p className="mb-6 text-slate-700 dark:text-slate-300">Members must maintain professional, ethical, and respectful conduct during programs and interactions.</p>

          <h3 className="text-xl font-semibold mb-2">Termination</h3>
          <p className="mb-6 text-slate-700 dark:text-slate-300">SMAK reserves the right to suspend or terminate access in cases of misconduct, policy violations, or misuse.</p>

          <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
          <p className="mb-6 text-slate-700 dark:text-slate-300">For any queries related to privacy, refunds, access, or general support: 📧 contact@smak.in</p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Terms;
