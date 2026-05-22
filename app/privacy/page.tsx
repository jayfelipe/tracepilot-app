import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Database, Key, Eye, Users, Globe, Lock, Trash2, Mail, ExternalLink } from 'lucide-react';

const SECTIONS = [
  {
    icon: ShieldCheck,
    title: '1. Information We Collect',
    content: `TracePilot AI collects the following categories of information to provide and improve our Service:`,
    items: [
      {
        label: 'Authentication Data',
        desc: 'When you sign in via GitHub or Google OAuth, we receive your email address, display name, and profile avatar. We do not request access to your private repositories (GitHub) or drive files (Google).',
      },
      {
        label: 'API Key Data',
        desc: 'When you generate an API key, we store a hashed reference linked to your account. API keys are generated server-side and are never derived from personal information.',
      },
      {
        label: 'Trace & Telemetry Data',
        desc: 'When you use the TracePilot SDK to trace AI agent executions, we store the trace data you send us. This may include prompts, model outputs, tool call results, error logs, execution times, and token counts. This data is linked to your API key and account.',
      },
      {
        label: 'Usage & Analytics Data',
        desc: 'We collect anonymous usage data such as page views, feature interactions, and performance metrics to improve the Service. This data is aggregated and cannot identify you personally.',
      },
    ],
  },
  {
    icon: Database,
    title: '2. How We Use Your Information',
    content: `We use the information we collect for the following purposes:`,
    items: [
      { label: 'Service Delivery', desc: 'To provide, maintain, and operate the TracePilot platform, including trace storage, replay, and debugging features.' },
      { label: 'Authentication', desc: 'To verify your identity and grant access to your account and API keys.' },
      { label: 'Communication', desc: 'To send you service-related notifications, security alerts, and responses to your support requests.' },
      { label: 'Improvement', desc: 'To analyze usage patterns, fix bugs, and develop new features. We may use aggregated, anonymized trace data for this purpose.' },
      { label: 'Security', desc: 'To detect, prevent, and address fraud, abuse, and security issues.' },
    ],
  },
  {
    icon: Eye,
    title: '3. Third-Party Services',
    content: `TracePilot AI integrates with the following third-party services that may collect information:`,
    items: [
      {
        label: 'Google OAuth',
        desc: 'Used for authentication. Google may collect your email and basic profile info. Google\'s Privacy Policy: https://policies.google.com/privacy',
      },
      {
        label: 'GitHub OAuth',
        desc: 'Used for authentication. GitHub may share your public profile data. GitHub\'s Privacy Policy: https://docs.github.com/en/site-policy/privacy-policies',
      },
      {
        label: 'Supabase',
        desc: 'Used as our backend infrastructure provider for authentication and data storage. Supabase\'s Privacy Policy: https://supabase.com/privacy',
      },
    ],
    hasLinks: true,
  },
  {
    icon: Lock,
    title: '4. Data Storage & Security',
    content: `Your data is stored on secure servers managed by Supabase with industry-standard encryption (AES-256 at rest, TLS 1.3 in transit). We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    icon: Users,
    title: '5. Data Sharing',
    content: `We do not sell, trade, or rent your personal information or trace data to third parties. We may share data only in the following circumstances:`,
    items: [
      { label: 'Service Providers', desc: 'With trusted third-party services (Supabase) that help us operate the platform, subject to confidentiality obligations.' },
      { label: 'Legal Requirements', desc: 'If required by law, court order, or governmental regulation, we may disclose your data to comply with legal obligations.' },
      { label: 'Anonymized Data', desc: 'We may share aggregated, anonymized data that cannot identify you for analytical or research purposes.' },
    ],
  },
  {
    icon: Globe,
    title: '6. Data Retention',
    content: `We retain your account data for as long as your account is active. Trace data is retained for the lifetime of your account unless you request deletion. You may request deletion of your data at any time by contacting us. Upon account deletion, we will remove your personal data and associated traces within 30 days, except where retention is required by law.`,
  },
  {
    icon: Eye,
    title: '7. Your Rights',
    content: `Depending on your jurisdiction, you may have the following rights regarding your personal data:`,
    items: [
      { label: 'Access', desc: 'You can view your profile data and trace data through the TracePilot dashboard at any time.' },
      { label: 'Rectification', desc: 'You can update your account information by contacting us.' },
      { label: 'Deletion', desc: 'You can request deletion of your account and all associated data by contacting hello@tracepilotai.com.' },
      { label: 'Portability', desc: 'You can export your trace data through the API or by requesting a data export.' },
      { label: 'Objection', desc: 'You can object to the processing of your data for specific purposes by contacting us.' },
    ],
  },
  {
    icon: Trash2,
    title: '8. Data Deletion',
    content: `To request deletion of your account and all associated data, please contact us at hello@tracepilotai.com with the subject line "Data Deletion Request". We will process your request within 30 days and confirm completion via email. Please note that anonymized, aggregated data used for analytics may persist after deletion as it cannot identify you.`,
  },
  {
    icon: ShieldCheck,
    title: '9. Cookies & Tracking',
    content: `TracePilot AI uses minimal cookies necessary for the functioning of the Service, including session authentication tokens. We do not use advertising cookies or third-party tracking pixels. We may use anonymized analytics to understand usage patterns. You can control cookie settings through your browser preferences.`,
  },
  {
    icon: Users,
    title: '10. Children\'s Privacy',
    content: `TracePilot AI is not intended for use by individuals under the age of 16. We do not knowingly collect personal information from children. If we discover that we have collected data from a child under 16, we will take steps to delete that information promptly.`,
  },
  {
    icon: Globe,
    title: '11. International Transfers',
    content: `Your data may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using the Service, you consent to the transfer of your data to these countries, and we will take appropriate measures to ensure your data is protected in accordance with this Privacy Policy.`,
  },
  {
    icon: RefreshCw,
    title: '12. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. If we make material changes, we will notify you by placing a prominent notice on our website or by sending you an email. We encourage you to review this Privacy Policy periodically. Your continued use of the Service after any changes constitutes acceptance of the updated Policy.`,
  },
  {
    icon: Mail,
    title: '13. Contact Us',
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:`,
    items: [
      { label: 'Email', desc: 'hello@tracepilotai.com' },
      { label: 'Discord', desc: 'https://discord.gg/ktYCtCA8D' },
    ],
  },
];

// Reusing the same icon from lucide to avoid import issues
const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#f5f5f5] font-sans antialiased selection:bg-cyan-500/30 selection:text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-cyan-950/15 via-transparent to-transparent pointer-events-none blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-cyan-400 transition mb-10 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
          <span>Back to TracePilot AI</span>
        </Link>

        {/* Header */}
        <div className="mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider text-neutral-300">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>LEGAL DOCUMENT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-sm text-neutral-500 font-mono">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="text-sm text-neutral-400 leading-relaxed font-sans mt-4 max-w-2xl">
            At TracePilot AI, we take your privacy seriously. This Privacy Policy explains what data we collect, how we use it, and what rights you have. We encourage you to read this document carefully before using our Service.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {SECTIONS.map((section, idx) => {
            const IconComp = section.icon;
            return (
              <section
                key={idx}
                className="bg-neutral-950/40 border border-neutral-900 rounded-xl p-6 hover:border-neutral-800 transition"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 bg-neutral-900 rounded-lg border border-neutral-800 flex items-center justify-center flex-shrink-0">
                    <IconComp className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h2 className="text-base font-bold text-white font-display">{section.title}</h2>
                </div>

                {section.content && (
                  <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                    {section.content}
                  </p>
                )}

                {section.items && (
                  <ul className="space-y-3 mt-3">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-400 leading-relaxed font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="text-neutral-200 font-medium">{item.label}:</span>{' '}
                          {item.desc}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-8 border-t border-neutral-900 text-center">
          <p className="text-xs text-neutral-600 font-mono">
            © {new Date().getFullYear()} TracePilot AI. All rights reserved.
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs font-mono">
            <Link href="/terms" className="text-neutral-500 hover:text-cyan-400 transition">
              Terms of Service
            </Link>
            <span className="text-neutral-800">|</span>
            <Link href="/" className="text-neutral-500 hover:text-cyan-400 transition">
              Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
