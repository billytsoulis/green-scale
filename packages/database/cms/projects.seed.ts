/**
 * Project Content: Initial Investment Opportunities
 * Path: packages/database/cms/projects.seed.ts
 */

export const projectsData = [
  {
    slug: "solar-ark-messinia",
    category: "Renewable Energy",
    status: "ACTIVE",
    targetIrr: "8.50",
    minInvestment: "50000.00",
    esgScore: 94,
    location: {
      city: "Messinia",
      country: "Greece",
      coordinates: { lat: 37.03, lng: 22.11 }
    },
    contentEn: {
      title: "Solar Ark Messinia",
      description: "A utility-scale solar facility providing clean energy to 15,000 households.",
      impactSummary: "Estimated CO2 reduction of 12,000 tonnes annually."
    },
    contentEl: {
      title: "Ηλιακή Κιβωτός Μεσσηνίας",
      description: "Μια ηλιακή εγκατάσταση μεγάλης κλίμακας που παρέχει καθαρή ενέργεια σε 15.000 νοικοκυριά.",
      impactSummary: "Εκτιμώμενη μείωση CO2 κατά 12.000 τόνους ετησίως."
    },
    fundingStatus: {
      totalGoal: 2500000,
      currentRaised: 1850000,
      investorCount: 42
    }
  },
  {
    slug: "aegean-wind-iv",
    category: "Renewable Energy",
    status: "ACTIVE",
    targetIrr: "11.20",
    minInvestment: "100000.00",
    esgScore: 88,
    location: {
      city: "Evia",
      country: "Greece"
    },
    contentEn: {
      title: "Aegean Wind IV",
      description: "Offshore wind farm expansion in the South Euboean Gulf.",
      impactSummary: "High-yield energy production with minimal land footprint."
    },
    contentEl: {
      title: "Αιγαιακός Άνεμος IV",
      description: "Επέκταση υπεράκτιου αιολικού πάρκου στον Νότιο Ευβοϊκό Κόλπο.",
      impactSummary: "Παραγωγή ενέργειας υψηλής απόδοσης με ελάχιστο αποτύπωμα γης."
    },
    fundingStatus: {
      totalGoal: 5000000,
      currentRaised: 1200000,
      investorCount: 12
    }
  }
];