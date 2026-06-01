import type { MetaFunction } from '@vercel/remix';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => [
  { title: 'Privacy Policy | Nanny — Plant-Based Hospitality OS' },
  { name: 'description', content: 'Privacy Policy for the Nanny plant-based hospitality platform.' },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF7', color: '#1A1A18' }}>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          to="/nanny"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium"
          style={{ color: '#2D5016' }}
        >
          ← Back to Nanny
        </Link>

        <h1 className="mb-2 text-4xl font-bold tracking-tight" style={{ color: '#2D5016' }}>
          Privacy Policy
        </h1>
        <p className="mb-12 text-sm text-gray-500">Effective date: June 1, 2026 · Last updated: June 1, 2026</p>

        <Section title="1. Data We Collect">
          <p>We collect the following categories of data when you use Nanny:</p>
          <ul className="mt-3 list-inside list-disc space-y-1 pl-2">
            <li>
              <strong>Account data:</strong> Name, email address, and authentication credentials when you register.
            </li>
            <li>
              <strong>Event data:</strong> Guest counts, event types, dietary restrictions, budget parameters, and
              service times you provide when generating menus or runbooks.
            </li>
            <li>
              <strong>Media:</strong> Images you upload for visual ingredient analysis. These are processed in memory
              and not stored permanently unless you explicitly save them.
            </li>
            <li>
              <strong>Voice recordings:</strong> Audio captured during voice-dispatch sessions. Audio is transmitted to
              our transcription provider and is not retained on Nanny servers after transcription is complete.
            </li>
            <li>
              <strong>Usage data:</strong> Pages visited, features used, session duration, and device/browser metadata
              collected automatically via server logs and analytics.
            </li>
            <li>
              <strong>Payment data:</strong> Billing information processed by our payment processor (Stripe). We do not
              store full payment card numbers.
            </li>
          </ul>
        </Section>

        <Section title="2. How We Use Data">
          <p>We use your data to:</p>
          <ul className="mt-3 list-inside list-disc space-y-1 pl-2">
            <li>Provide, operate, and improve the Nanny Service</li>
            <li>Generate AI-powered menus, provisioning lists, and service runbooks based on your inputs</li>
            <li>Authenticate your identity and maintain session security</li>
            <li>Process subscription billing and manage your account</li>
            <li>Send transactional emails (receipts, password resets, service notices)</li>
            <li>Analyze aggregate, anonymized usage patterns to improve the Service</li>
            <li>Comply with legal obligations and enforce our Terms of Service</li>
          </ul>
          <p className="mt-3">
            We do not sell, rent, or trade your personal data to third parties for their marketing purposes.
          </p>
        </Section>

        <Section title="3. LLM Processing">
          <p>
            Nanny&apos;s core intelligence features rely on large language models (LLMs). When you request a menu,
            provisioning list, service runbook, or other AI-generated content, the relevant parameters you provide
            (event details, dietary needs, cuisine preferences) are transmitted to our AI processing infrastructure.
          </p>
          <p className="mt-3">
            <strong>Menu and provisioning generation prompts are processed by Anthropic&apos;s Claude API.</strong> This
            means your event parameters are sent to Anthropic&apos;s servers to generate responses. Anthropic&apos;s use
            of this data is governed by their{' '}
            <a
              href="https://www.anthropic.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2D5016', textDecoration: 'underline' }}
            >
              Privacy Policy
            </a>
            . As of the effective date of this policy, Anthropic does not use API inputs to train their models by
            default. Please review Anthropic&apos;s current policy for up-to-date information.
          </p>
          <p className="mt-3">
            Voice transcription is processed by OpenAI&apos;s Whisper API when an OpenAI API key is configured. Audio
            data is transmitted to OpenAI&apos;s servers for transcription and is subject to{' '}
            <a
              href="https://openai.com/policies/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2D5016', textDecoration: 'underline' }}
            >
              OpenAI&apos;s Privacy Policy
            </a>
            .
          </p>
          <p className="mt-3">
            We recommend that you avoid including personally identifiable information about your end clients (e.g.,
            guest names, addresses) in prompts submitted to Nanny.
          </p>
        </Section>

        <Section title="4. Third-Party Services">
          <p>Nanny integrates with the following third-party providers:</p>
          <div className="mt-3 space-y-4">
            <ThirdParty
              name="Anthropic"
              purpose="LLM inference for menu generation, provisioning, runbooks, and vision analysis"
              url="https://www.anthropic.com/privacy"
            />
            <ThirdParty
              name="OpenAI"
              purpose="Whisper speech-to-text transcription for voice-dispatch features"
              url="https://openai.com/policies/privacy-policy"
            />
            <ThirdParty
              name="Convex"
              purpose="Real-time backend database and server functions for storing menus, events, and user data"
              url="https://www.convex.dev/privacy"
            />
            <ThirdParty
              name="WorkOS"
              purpose="Enterprise SSO, authentication, and directory sync"
              url="https://workos.com/privacy-policy"
            />
            <ThirdParty
              name="Stripe"
              purpose="Subscription billing and payment processing"
              url="https://stripe.com/privacy"
            />
          </div>
          <p className="mt-4">
            Each provider has its own privacy policy and data processing terms. We encourage you to review them. We
            select providers that meet appropriate security and privacy standards.
          </p>
        </Section>

        <Section title="5. Data Retention">
          <p>We retain your data for as long as your account is active or as needed to provide the Service:</p>
          <ul className="mt-3 list-inside list-disc space-y-1 pl-2">
            <li>
              <strong>Account data:</strong> Retained until you delete your account, plus 30 days for backup recovery
              purposes.
            </li>
            <li>
              <strong>Generated content (menus, runbooks, etc.):</strong> Retained for 12 months after creation, or
              until you delete it, whichever comes first. Pro and Enterprise subscribers may configure longer retention
              periods.
            </li>
            <li>
              <strong>Voice audio:</strong> Not retained. Audio is transcribed in real-time and discarded immediately
              after transcription.
            </li>
            <li>
              <strong>Uploaded images:</strong> Not retained beyond the processing session unless you explicitly save
              the analysis results.
            </li>
            <li>
              <strong>Payment records:</strong> Retained for 7 years as required by tax and accounting law.
            </li>
            <li>
              <strong>Server logs:</strong> Retained for 90 days for security and debugging purposes.
            </li>
          </ul>
        </Section>

        <Section title="6. Your Rights">
          <p>
            Depending on your location, you may have the following rights regarding your personal data. We honor these
            rights for all users regardless of geography:
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 pl-2">
            <li>
              <strong>Access:</strong> Request a copy of the personal data we hold about you.
            </li>
            <li>
              <strong>Correction:</strong> Request that we correct inaccurate or incomplete data.
            </li>
            <li>
              <strong>Deletion:</strong> Request that we delete your personal data (&quot;right to be forgotten&quot;).
              Some data may be retained where required by law.
            </li>
            <li>
              <strong>Portability:</strong> Receive your data in a structured, machine-readable format.
            </li>
            <li>
              <strong>Restriction:</strong> Request that we restrict processing of your data in certain circumstances.
            </li>
            <li>
              <strong>Objection:</strong> Object to processing of your data where we rely on legitimate interests as our
              legal basis.
            </li>
            <li>
              <strong>Withdraw consent:</strong> Where processing is based on your consent, withdraw it at any time
              without affecting prior processing.
            </li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:privacy@nanny.kitchen" style={{ color: '#2D5016', textDecoration: 'underline' }}>
              privacy@nanny.kitchen
            </a>
            . We will respond within 30 days (or sooner where required by applicable law). We may need to verify your
            identity before processing certain requests.
          </p>
          <p className="mt-3">
            If you are located in the European Economic Area or United Kingdom, you have the right to lodge a complaint
            with your local data protection authority if you believe we have not handled your data in accordance with
            applicable law.
          </p>
        </Section>

        <Section title="7. Contact">
          <p>
            If you have questions, concerns, or requests related to this Privacy Policy or our data practices, please
            contact our Data Protection team:
          </p>
          <address className="mt-3 not-italic">
            <strong>Nanny Technologies, Inc.</strong>
            <br />
            Data Protection Officer
            <br />
            Email:{' '}
            <a href="mailto:privacy@nanny.kitchen" style={{ color: '#2D5016', textDecoration: 'underline' }}>
              privacy@nanny.kitchen
            </a>
            <br />
            We aim to respond to all privacy inquiries within 5 business days.
          </address>
        </Section>

        <div className="mt-16 border-t pt-8" style={{ borderColor: '#E5E5E0' }}>
          <div className="flex gap-6 text-sm" style={{ color: '#2D5016' }}>
            <Link to="/nanny/terms" className="underline">
              Terms of Service
            </Link>
            <Link to="/nanny" className="underline">
              Back to Nanny
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold" style={{ color: '#2D5016' }}>
        {title}
      </h2>
      <div className="space-y-2 leading-relaxed text-gray-700">{children}</div>
    </section>
  );
}

function ThirdParty({ name, purpose, url }: { name: string; purpose: string; url: string }) {
  return (
    <div className="rounded-lg border p-4" style={{ borderColor: '#E5E5E0', backgroundColor: '#F5F5F0' }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="font-semibold" style={{ color: '#1A1A18' }}>
            {name}
          </span>
          <p className="mt-1 text-sm text-gray-600">{purpose}</p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs underline"
          style={{ color: '#2D5016' }}
        >
          Privacy Policy →
        </a>
      </div>
    </div>
  );
}
