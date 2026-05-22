import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Shield, AlertTriangle, Scale, Ban, RefreshCw, Mail } from 'lucide-react';

const SECTIONS = [
  {
    icon: FileText,
    title: '1. Acceptance of Terms',
    content: `By accessing or using TracePilot AI ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, do not use the Service. These Terms apply to all visitors, users, and developers who access or use the Service.`,
  },
  {
    icon: Scale,
    title: '2. Description of Service',
    content: `TracePilot AI provides an observability and debugging platform for autonomous AI agents. The Service allows you to trace, replay, inspect, and fork AI agent executions via our SDK and web dashboard. The Service includes API key generation, trace storage, time-travel debugging, and related developer tools.`,
  },
  {
    icon: Shield,
    title: '3. Account Registration & Authentication',
    content: `You must authenticate via GitHub or Google OAuth to use the Service. You are responsible for maintaining the security of your account and API keys. You must not share your API keys with unauthorized third parties. You must provide accurate and complete information during authentication. You are responsible for all activity that occurs under your account.`,
  },
  {
    icon: AlertTriangle,
    title: '4. Acceptable Use',
    content: `You agree to use the Service only for lawful purposes and in accordance with these Terms. You are responsible for all content, data, and agent executions you transmit through the Service. You must ensure that your use of AI agents traced by TracePilot complies with all applicable laws and regulations, including data protection and privacy laws.`,
  },
  {
    icon: Ban,
    title: '5. Prohibited Activities',
    items: [
      'Using the Service to trace, debug, or facilitate AI agents that generate illegal, harmful, threatening, abusive, or defamatory content.',
      'Attempting to reverse engineer, decompile, disassemble, or otherwise access the source code of the Service.',
      'Using the Service to infringe upon the intellectual property rights of others.',
      'Reselling, sublicensing, or redistributing access to the Service without written permission.',
      'Circumventing, disabling, or interfering with security features of the Service.',
      'Using the Service to launch attacks, spam, or abuse against third-party APIs or systems.',
      'Attempting to access other users\' traces, API keys, or account data without authorization.',
      'Using automated scripts or bots to create accounts or generate API keys in bulk.',
      'Using the Service in any way that could damage, disable, overburden, or impair our infrastructure.',
    ],
  },
  {
    icon: AlertTriangle,
    title: '6. API Usage & Rate Limits',
    content: `The Service provides API access subject to rate limits and usage quotas. We reserve the right to enforce rate limits, suspend access, or terminate accounts that exceed fair usage. API keys are intended for individual developer use. You must not expose API keys in client-side code, public repositories, or unsecured environments. We reserve the right to revoke or regenerate API keys at any time for security reasons.`,
  },
  {
    icon: Scale,
    title: '7. Intellectual Property',
    content: `TracePilot AI and its original content, features, and functionality are owned by TracePilot AI and are protected by international copyright, trademark, and other intellectual property laws. Your traces, agent data, and code remain your property. We do not claim ownership over the data you send through our SDK. We may use aggregated, anonymized data to improve the Service and for analytics purposes.`,
  },
  {
    icon: AlertTriangle,
    title: '8. Limitation of Liability',
    content: `The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. TracePilot AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service. TracePilot AI does not guarantee that the Service will be uninterrupted, timely, secure, or error-free. In no event shall TracePilot AI's total liability exceed the amount paid by you to the Service in the twelve (12) months preceding the claim. You acknowledge that AI agent behavior is inherently unpredictable and TracePilot AI is not responsible for the actions, outputs, or decisions of your AI agents.`,
  },
  {
    icon: RefreshCw,
    title: '9. Modifications to Terms',
    content: `We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. Your continued use of the Service after any changes constitutes acceptance of the new Terms.`,
  },
  {
    icon: Scale,
    title: '10. Termination',
    content: `We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we determine, in our sole discretion, violates these Terms or is harmful to other users, us, or third parties. Upon termination, your right to use the Service will immediately cease. Provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.`,
  },
  {
    icon: Scale,
    title: '11. Governing Law',
    content: `These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes arising from these Terms or the Service shall be resolved in the courts of the applicable jurisdiction.`,
  },
  {
    icon: Mail,
    title: '12. Contact',
    content: `If you have any questions about these Terms, please contact us at hello@tracepilotai.com or join our Discord community at https://discord.gg/ktYCtCA8D.`,
  },
];

export default function TermsPage() {
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
            <FileText className="w-3 h-3 text-cyan-400" />
            <span>LEGAL DOCUMENT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-sm text-neutral-500 font-mono">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
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
                  <ul className="space-y-2.5 mt-1">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-400 leading-relaxed font-sans">
                        <span className="text-red-400 font-bold font-mono mt-0.5 text-xs flex-shrink-0">✕</span>
                        <span>{item}</span>
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
            <Link href="/privacy" className="text-neutral-500 hover:text-cyan-400 transition">
              Privacy Policy
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
