import { ContactSection } from "@/components/home/contact-section";
import { EditorialGallerySection } from "@/components/home/editorial-gallery-section";
import { HeroPortalSection } from "@/components/home/hero-portal-section";
import { LuxuryFooter } from "@/components/home/luxury-footer";
import { ProcessSection } from "@/components/home/process-section";
import { TrustSection } from "@/components/home/trust-section";

export function LuxuryHomepage() {
  return (
    <div className="safe-bottom bg-white">
      <HeroPortalSection />
      <ProcessSection />
      <EditorialGallerySection />
      <TrustSection />
      <ContactSection />
      <LuxuryFooter />
    </div>
  );
}
