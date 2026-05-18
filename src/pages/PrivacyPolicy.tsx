import { Link } from "react-router-dom";
import { FiArrowLeft, FiShield } from "react-icons/fi";

const LAST_UPDATED = "May 18, 2025";
const APP_NAME = "AppHub";
const CONTACT_EMAIL = "privacy@apphub.app";

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-4 md:px-6">
      <Link
        to="/account"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <FiArrowLeft size={16} />
        Back to Account
      </Link>

      <div className="mb-10 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950">
          <FiShield size={22} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-foreground">

        <Section title="1. Introduction">
          <p>
            Welcome to <strong>{APP_NAME}</strong>. We respect your privacy and are committed to
            being transparent about how we collect, use, and protect your data. This Privacy
            Policy explains our data practices when you use the {APP_NAME} platform — a curated
            hub for discovering and downloading Android applications.
          </p>
          <p>
            By using {APP_NAME}, you agree to the collection and use of information in accordance
            with this policy. If you do not agree with any part of this policy, please discontinue
            use of our service.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect the following categories of data:</p>

          <SubSection title="2.1 Account Information">
            <ul>
              <li>
                <strong>Email address</strong> — collected when you register with email/password,
                or sign in with Google or GitHub. Used to identify your account and communicate
                with you.
              </li>
              <li>
                <strong>Display name and profile photo</strong> — if provided by your OAuth
                provider (Google or GitHub), we store and display these to personalise your
                experience.
              </li>
              <li>
                <strong>Unique User ID (UID)</strong> — a randomly generated identifier assigned
                by Firebase Authentication to your account. This is never publicly visible.
              </li>
            </ul>
          </SubSection>

          <SubSection title="2.2 Push Notification Token (FCM Token)">
            <p>
              When you grant notification permissions in your browser, we store your{" "}
              <strong>Firebase Cloud Messaging (FCM) token</strong> alongside your email and a
              timestamp in our database. This token is used exclusively to send you push
              notifications about new app releases or important platform announcements. You may
              revoke notification permissions at any time through your browser settings, which
              will prevent future notifications.
            </p>
          </SubSection>

          <SubSection title="2.3 Activity Data">
            <ul>
              <li>
                <strong>App downloads</strong> — we maintain a counter of total downloads per
                application. This counter is incremented each time a download is initiated, but
                is not linked to your individual user account.
              </li>
              <li>
                <strong>App ratings</strong> — when you rate an application, we store your{" "}
                <strong>User ID, your numeric rating (1–5), and timestamps</strong> for when the
                rating was created and last updated. Your rating is used solely to calculate the
                average rating displayed on each app's page.
              </li>
            </ul>
          </SubSection>

          <SubSection title="2.4 Anonymous Usage">
            <p>
              You may use {APP_NAME} anonymously without creating an account. In anonymous mode,
              no email or personal identifier is collected. An anonymous session UID is
              temporarily assigned by Firebase Authentication; ratings submitted anonymously are
              stored against this temporary ID.
            </p>
          </SubSection>

          <SubSection title="2.5 Technical Data">
            <p>
              Like most web services, our infrastructure and third-party providers (Firebase /
              Google Cloud) may automatically record standard technical information such as IP
              address, browser type, operating system, and page visit timestamps. This data is
              collected for security, abuse prevention, and service diagnostics. We do not use
              this data for advertising.
            </p>
          </SubSection>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul>
            <li>To create and manage your user account</li>
            <li>To allow you to rate and review applications</li>
            <li>To send you push notifications (only if you have opted in)</li>
            <li>To display personalised content (e.g., recommended apps)</li>
            <li>To detect and prevent fraudulent or abusive behaviour</li>
            <li>To maintain the security and integrity of our platform</li>
            <li>
              To comply with legal obligations and enforce our{" "}
              <Link to="/terms" className="font-medium underline underline-offset-2 hover:text-foreground">
                Terms & Conditions
              </Link>
            </li>
          </ul>
          <p>
            We do <strong>not</strong> sell, rent, or trade your personal data to third parties.
            We do <strong>not</strong> use your data for targeted advertising.
          </p>
        </Section>

        <Section title="4. Third-Party Services">
          <p>
            {APP_NAME} is built on and integrates with the following third-party services, each
            of which has its own privacy policy:
          </p>
          <ul>
            <li>
              <strong>Firebase (Google LLC)</strong> — provides authentication, database
              (Firestore), file storage, and push messaging. Data may be stored on Google's
              servers in the United States or other regions.{" "}
              <a
                href="https://firebase.google.com/support/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2"
              >
                Firebase Privacy Policy
              </a>
            </li>
            <li>
              <strong>Google OAuth</strong> — used as an optional sign-in method. We only
              request access to your public profile and email address.{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2"
              >
                Google Privacy Policy
              </a>
            </li>
            <li>
              <strong>GitHub OAuth</strong> — used as an optional sign-in method. We only
              request access to your public profile and email address.{" "}
              <a
                href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2"
              >
                GitHub Privacy Statement
              </a>
            </li>
          </ul>
        </Section>

        <Section title="5. Data Retention">
          <p>
            We retain your account data for as long as your account is active. If you delete
            your account, your email, FCM token, and associated ratings will be removed from our
            database within 30 days. Aggregate, non-identifiable data (such as total download
            counts) may be retained indefinitely.
          </p>
        </Section>

        <Section title="6. Data Security">
          <p>
            We implement industry-standard security measures including Firestore Security Rules
            that restrict read/write access to authorised users only. Your personal data is
            accessible only by you and designated platform administrators. No security system is
            completely impenetrable, and we cannot guarantee absolute security; however, we take
            reasonable steps to protect your information.
          </p>
        </Section>

        <Section title="7. Your Rights">
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data ("right to be forgotten")</li>
            <li>Object to or restrict certain processing of your data</li>
            <li>Withdraw consent at any time (e.g., revoke notification permissions)</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>
            {APP_NAME} is not directed at children under the age of 13. We do not knowingly
            collect personal information from children under 13. If you believe we have
            inadvertently collected such information, please contact us immediately and we will
            take steps to delete it.
          </p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. When we do, we will update the
            "Last updated" date at the top of this page. We encourage you to review this policy
            periodically. Continued use of {APP_NAME} after changes are posted constitutes your
            acceptance of the revised policy.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy,
            please contact us at:
          </p>
          <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
            <p className="font-semibold text-foreground">{APP_NAME}</p>
            <p className="text-muted-foreground">
              Email:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-foreground underline underline-offset-2"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-bold tracking-tight text-foreground">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-base font-semibold text-foreground">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
