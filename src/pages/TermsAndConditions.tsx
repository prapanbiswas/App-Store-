import { Link } from "react-router-dom";
import { FiArrowLeft, FiFileText } from "react-icons/fi";

const LAST_UPDATED = "May 18, 2025";
const APP_NAME = "AppHub";
const CONTACT_EMAIL = "legal@apphub.app";

export default function TermsAndConditions() {
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
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-950">
          <FiFileText size={22} className="text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Terms &amp; Conditions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
          <strong>Important:</strong> Please read these Terms &amp; Conditions carefully before
          using {APP_NAME}. By accessing or using our service, you agree to be bound by these
          terms. If you do not agree, do not use {APP_NAME}.
        </p>
      </div>

      <div className="space-y-8 text-foreground">

        <Section title="1. Acceptance of Terms">
          <p>
            These Terms &amp; Conditions ("Terms") constitute a legally binding agreement between
            you ("User", "you", or "your") and <strong>{APP_NAME}</strong> ("we", "us", or "our").
            By registering an account, browsing the platform, or downloading any application
            through {APP_NAME}, you confirm that you have read, understood, and agree to be bound
            by these Terms and our{" "}
            <Link to="/privacy" className="font-medium underline underline-offset-2 hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of
            material changes by updating the "Last updated" date. Your continued use of the
            platform after changes are posted constitutes acceptance of the revised Terms.
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>
            You must be at least <strong>13 years of age</strong> to use {APP_NAME}. If you are
            under 18, you represent that you have obtained parental or guardian consent to use
            the platform. By using {APP_NAME}, you represent and warrant that you meet these
            eligibility requirements.
          </p>
        </Section>

        <Section title="3. The {APP_NAME} Service">
          <p>
            {APP_NAME} is a platform that curates and hosts Android Application Package (APK)
            files and associated metadata (descriptions, screenshots, version information) for
            the purpose of discovery and download by users. {APP_NAME} acts solely as a
            distributor of content uploaded by authorised administrators.
          </p>
          <p>
            We reserve the right to add, modify, suspend, or remove any application listing at
            any time without prior notice. We also reserve the right to modify, suspend, or
            discontinue the {APP_NAME} service (or any part thereof) at any time.
          </p>
        </Section>

        <Section title="4. APK Downloads — Critical Disclaimer">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">
              By downloading any APK file from {APP_NAME}, you expressly acknowledge and agree
              to all of the following:
            </p>
          </div>
          <ul>
            <li>
              <strong>You assume full responsibility</strong> for any APK file you choose to
              download and install on your device. Android APK files obtained outside of the
              official Google Play Store carry an inherent security risk, and you accept this
              risk entirely.
            </li>
            <li>
              <strong>{APP_NAME} makes no warranties</strong>, express or implied, regarding the
              safety, security, fitness for purpose, or absence of malware in any APK file
              hosted on the platform. All APKs are provided "as is."
            </li>
            <li>
              <strong>You are solely responsible</strong> for ensuring that your device's
              security settings allow installation from unknown sources, and for any consequences
              of enabling that setting.
            </li>
            <li>
              <strong>{APP_NAME} shall not be held liable</strong> for any damage to your
              device, data loss, privacy breaches, financial loss, or any other harm arising
              directly or indirectly from the download or installation of any APK obtained
              through our platform.
            </li>
            <li>
              You confirm that downloading and installing the application does not violate any
              laws, regulations, or third-party rights applicable in your jurisdiction.
            </li>
          </ul>
        </Section>

        <Section title="5. User Accounts">
          <ul>
            <li>
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activity that occurs under your account.
            </li>
            <li>
              You must provide accurate and truthful information when creating your account.
            </li>
            <li>
              You may not create accounts for the purpose of abusing, spamming, or harassing
              other users or circumventing any access restrictions.
            </li>
            <li>
              You must notify us immediately if you suspect unauthorised access to your account.
            </li>
            <li>
              We reserve the right to suspend or terminate your account at our sole discretion,
              with or without notice, if we determine you have violated these Terms.
            </li>
          </ul>
        </Section>

        <Section title="6. Ratings & Reviews">
          <p>
            Users may submit ratings (1–5 stars) for applications listed on {APP_NAME}. By
            submitting a rating, you represent that it reflects your genuine experience with the
            application. We reserve the right to remove ratings that we determine to be
            fraudulent, abusive, or in violation of these Terms.
          </p>
          <p>
            {APP_NAME} is not responsible for the accuracy or reliability of user-submitted
            ratings. You should use your own judgment when evaluating an application based on
            ratings.
          </p>
        </Section>

        <Section title="7. Push Notifications">
          <p>
            If you grant notification permissions, you consent to receiving push notifications
            from {APP_NAME} regarding new app listings, platform updates, and other relevant
            information. You may withdraw this consent at any time by disabling notification
            permissions in your browser or device settings. Withdrawal of consent will not
            affect the lawfulness of notifications sent prior to withdrawal.
          </p>
        </Section>

        <Section title="8. Intellectual Property">
          <p>
            All content on {APP_NAME} that is not the property of a third party — including but
            not limited to our logo, interface design, original text, and code — is owned by or
            licensed to {APP_NAME} and is protected by applicable intellectual property laws.
          </p>
          <p>
            Application names, logos, screenshots, and other app metadata are the property of
            their respective owners. Their presence on {APP_NAME} does not imply any affiliation
            with or endorsement by {APP_NAME}.
          </p>
          <p>
            You may not copy, reproduce, distribute, or create derivative works of any {APP_NAME}
            content without our express written permission.
          </p>
        </Section>

        <Section title="9. Prohibited Conduct">
          <p>You agree not to:</p>
          <ul>
            <li>Use the platform for any unlawful purpose or in violation of any applicable laws</li>
            <li>Attempt to gain unauthorised access to any part of the platform or its systems</li>
            <li>Upload, transmit, or distribute malware, viruses, or any malicious code</li>
            <li>Scrape, crawl, or use automated means to access the platform without our prior written consent</li>
            <li>Impersonate any person or entity or falsely represent your affiliation with anyone</li>
            <li>Interfere with or disrupt the integrity or performance of the platform</li>
            <li>Submit fraudulent or manipulated ratings to misrepresent an application's quality</li>
          </ul>
        </Section>

        <Section title="10. Disclaimer of Warranties">
          <p>
            {APP_NAME} IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTY
            OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT
            WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL
            COMPONENTS.
          </p>
        </Section>

        <Section title="11. Limitation of Liability">
          <p>
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, {APP_NAME.toUpperCase()} AND ITS
            OPERATORS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES ARISING OUT OF OR
            RELATED TO YOUR USE OF, OR INABILITY TO USE, THE SERVICE OR ANY APK DOWNLOADED
            THROUGH IT — INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, DEVICE
            DAMAGE, OR PERSONAL INJURY — EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF
            SUCH DAMAGES.
          </p>
          <p>
            IN JURISDICTIONS THAT DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR
            CONSEQUENTIAL OR INCIDENTAL DAMAGES, OUR LIABILITY IS LIMITED TO THE MAXIMUM EXTENT
            PERMITTED BY LAW.
          </p>
        </Section>

        <Section title="12. Indemnification">
          <p>
            You agree to indemnify, defend, and hold harmless {APP_NAME} and its operators,
            directors, employees, and agents from and against any and all claims, liabilities,
            damages, losses, costs, and expenses (including reasonable attorneys' fees) arising
            out of or related to: (a) your use of the platform; (b) your violation of these
            Terms; (c) your violation of any third-party rights; or (d) any APK you download,
            install, or distribute as a result of using {APP_NAME}.
          </p>
        </Section>

        <Section title="13. Governing Law & Dispute Resolution">
          <p>
            These Terms shall be governed by and construed in accordance with applicable laws,
            without regard to conflict of law principles. Any dispute arising from or relating to
            these Terms or your use of {APP_NAME} shall first be attempted to be resolved through
            good-faith negotiation. If the parties cannot reach a resolution within 30 days, the
            dispute shall be submitted to binding arbitration before resorting to litigation.
          </p>
          <p>
            Nothing in this section prevents either party from seeking injunctive or other
            equitable relief in a court of competent jurisdiction to prevent irreparable harm.
          </p>
        </Section>

        <Section title="14. Termination">
          <p>
            We may terminate or suspend your access to {APP_NAME} immediately and without prior
            notice for any breach of these Terms. Upon termination, your right to use the
            platform will immediately cease. Provisions of these Terms that by their nature
            should survive termination shall survive, including but not limited to Sections 4,
            8, 10, 11, 12, and 13.
          </p>
        </Section>

        <Section title="15. Entire Agreement">
          <p>
            These Terms, together with our{" "}
            <Link to="/privacy" className="font-medium underline underline-offset-2 hover:text-foreground">
              Privacy Policy
            </Link>
            , constitute the entire agreement between you and {APP_NAME} with respect to your
            use of the platform and supersede all prior agreements, communications, and
            understandings, whether written or oral.
          </p>
        </Section>

        <Section title="16. Contact Us">
          <p>
            If you have any questions about these Terms &amp; Conditions, please contact us at:
          </p>
          <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
            <p className="font-semibold text-foreground">{APP_NAME} Legal</p>
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
