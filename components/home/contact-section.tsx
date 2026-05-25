import { ContactForm } from "@/components/home/contact-form";
import { LuxuryEyebrow, LuxurySubtitle, LuxuryTitle } from "@/components/luxury/typography";

export function ContactSection() {
  return (
    <section id="contact" className="bg-neutral-50 px-4 py-24 sm:px-8 sm:py-32 lg:py-40">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <LuxuryEyebrow en="Contact" zh="聯絡我們" />
          <LuxuryTitle en="Start Your Project" zh="開啟合作專案" />

          <div className="mt-12 space-y-8">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-800">
                Email
              </p>
              <a
                href="mailto:chris.lau@professor-cat.com"
                className="mt-2 block font-display text-xl text-neutral-950 transition hover:text-neutral-600"
              >
                chris.lau@professor-cat.com
              </a>
              <p className="mt-3 text-xs leading-relaxed text-neutral-500">
                If the form fails, please contact us directly.
              </p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                若表單傳送失敗，請直接來信聯絡我們。
              </p>
            </div>

            <LuxurySubtitle
              en="Tell us about your brand, timeline, and target markets — our team will respond with a tailored OEM/ODM proposal."
              zh="告訴我們您的品牌、時程與目標市場，我們的團隊將為您提供專屬 OEM/ODM 方案。"
            />
          </div>
        </div>

        <div className="bg-white p-8 shadow-sm ring-1 ring-neutral-200/80 sm:p-10 lg:p-12">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
