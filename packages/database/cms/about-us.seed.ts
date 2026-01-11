/**
 * CMS Content: About Us Page (Modular Data)
 * Path: packages/database/cms/about-us.seed.ts
 * * Updated: Translated flat strings into GS-17 JSONB structures.
 */

export const aboutPageData = {
  slug: "about-us",
  title: "About GreenScale",
  seo: {
    description: "GreenScale was founded to bring radical transparency to ESG data.",
    keywords: ["ESG", "Sustainability", "Data Integrity"]
  },
  sections: [
    {
      type: "HERO",
      orderIndex: 1,
      contentEn: {
        badge: "Our Vision",
        title: "A Legacy of Purpose & Performance.",
        description: "GreenScale was founded on a single premise: Capital has the power to fix the world, but only if it's guided by data that cannot be greenwashed."
      },
      contentEl: {
        badge: "Το Όραμά Μας",
        title: "Κληρονομιά με Σκοπό & Απόδοση.",
        description: "Η GreenScale ιδρύθηκε με μια απλή παραδοχή: Το κεφάλαιο έχει τη δύναμη να διορθώσει τον κόσμο, αλλά μόνο αν καθοδηγείται από δεδομένα που δεν επιδέχονται greenwashing."
      }
    },
    {
      type: "NARRATIVE",
      orderIndex: 2,
      contentEn: {
        title: "Radical Accountability",
        paragraph1: "For decades, ESG reporting has been a black box. Companies self-reported their sustainability metrics, and banks simply consumed them. At GreenScale, we don't believe in 'trusting' reports—we believe in 'auditing' reality.",
        paragraph2: "Based in the heart of Greece, we leverage the Mediterranean’s unique perspective on climate resilience to build a platform that serves the next generation of European wealth.",
        auditTitle: "The AI Audit",
        auditDesc: "Our ml-engine cross-references satellite thermal data with corporate energy claims to ensure your 'Green Bond' is actually green.",
        strategyTitle: "Human Strategy",
        strategyDesc: "Our Wealth Managers translate complex ESG scores into a personalized investment strategy that protects your capital and your values."
      },
      contentEl: {
        title: "Ριζική Λογοδοσία",
        paragraph1: "Για δεκαετίες, η αναφορά ESG ήταν ένα μαύρο κουτί. Οι εταιρείες ανέφεραν μόνες τους τα στοιχεία τους. Στην GreenScale, δεν πιστεύουμε στην 'εμπιστοσύνη' των αναφορών—πιστεύουμε στον 'έλεγχο' της πραγματικότητας.",
        paragraph2: "Με έδρα την καρδιά της Ελλάδας, αξιοποιούμε τη μοναδική προοπτική της Μεσογείου για την κλιματική ανθεκτικότητα για να δημιουργήσουμε μια πλατφόρμα που εξυπηρετεί την επόμενη γενιά ευρωπαϊκού πλούτου.",
        auditTitle: "Ο Έλεγχος AI",
        auditDesc: "Η μηχανή μας διασταυρώνει δορυφορικά δεδομένα με εταιρικούς ισχυρισμούς για να διασφαλίσει ότι το πράσινο ομόλογό σας είναι όντως πράσινο.",
        strategyTitle: "Ανθρώπινη Στρατηγική",
        strategyDesc: "Οι διαχειριστές μας μετατρέπουν τα πολύπλοκα σκορ ESG σε μια εξατομικευμένη στρατηγική που προστατεύει το κεφάλαιό σας."
      }
    },
    {
      type: "TEAM_GRID",
      orderIndex: 3,
      contentEn: {
        title: "The Specialists",
        members: [
          { id: "staff-1", name: "Eleni Kosta", role: "Chief ESG Strategist", bio: "Former Lead Analyst at MSCI European Sustainable Funds.", imageUrl: "" },
          { id: "staff-2", name: "Dr. Nikos Vane", role: "Architect / AI Lead", bio: "Specialist in high-integrity data auditing and satellite analytics.", imageUrl: "" },
          // { id: "staff-3", name: "Placeholder Member", role: "Associate", bio: "Bio coming soon.", imageUrl: "" },
          // { id: "staff-4", name: "Placeholder Member", role: "Associate", bio: "Bio coming soon.", imageUrl: "" }
        ]
      },
      contentEl: {
        title: "Οι Ειδικοί Μας",
        members: [
          { id: "staff-1", name: "Ελένη Κώστα", role: "Επικεφαλής Στρατηγικής ESG", bio: "Πρώην Κύρια Αναλύτρια στα Ευρωπαϊκά Βιώσιμα Ταμεία της MSCI.", imageUrl: "" },
          { id: "staff-2", name: "Δρ. Νίκος Βέιν", role: "Αρχιτέκτονας / Επικεφαλής AI", bio: "Ειδικός στον έλεγχο δεδομένων υψηλής ακεραιότητας και δορυφορική ανάλυση.", imageUrl: "" },
          // { id: "staff-3", name: "Μέλος", role: "Συνεργάτης", bio: "Σύντομα διαθέσιμο.", imageUrl: "" },
          // { id: "staff-4", name: "Μέλος", role: "Συνεργάτης", bio: "Σύντομα διαθέσιμο.", imageUrl: "" }
        ]
      }
    }
  ]
};