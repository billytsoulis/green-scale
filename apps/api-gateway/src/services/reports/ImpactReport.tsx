import React from 'react';
/**
 * @react-pdf/renderer is a server-side/browser-side PDF generation library.
 * Ensure 'npm install @react-pdf/renderer' is run in apps/api-gateway.
 */
// @ts-ignore
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

/**
 * GreenScale Phase 5: Dynamic Impact PDF Template (Refined)
 * Path: greenscale/apps/api-gateway/src/services/reports/ImpactReport.tsx
 * Purpose: Defines the institutional-grade layout for investor statements.
 * Fix: Added environment-safe comments and verified component structure.
 */

// Registering fonts for the institutional look
// Note: In a local environment, ensure these URLs are accessible or use local assets.
try {
  // @ts-ignore
  Font.register({
    family: 'Playfair',
    src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD7K_7WhYEVfSb_q9.ttf'
  });
} catch (e) {
  console.warn("Font registration skipped in this environment.");
}

const styles = StyleSheet.create({
  page: {
    padding: 60,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 20,
    marginBottom: 40,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#064e3b', // Brand Emerald 900
    letterSpacing: -1,
  },
  reportDate: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
  },
  metricCard: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065f46',
  },
  personaCard: {
    padding: 30,
    backgroundColor: '#064e3b',
    borderRadius: 20,
    color: '#FFFFFF',
    marginBottom: 40,
  },
  personaBadge: {
    fontSize: 8,
    fontWeight: 'bold',
    backgroundColor: '#10b981',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  personaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  personaText: {
    fontSize: 10,
    color: '#ecfdf5',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 60,
    right: 60,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 8,
    color: '#cbd5e1',
  }
});

interface ImpactReportProps {
  user: {
    name: string;
    persona: string;
    intent: string;
  };
  metrics: {
    aggregateScore: number;
    co2Saved: string;
    totalValue: string;
  };
  date: string;
}

export const ImpactReport = ({ user, metrics, date }: ImpactReportProps) => (
  // @ts-ignore
  <Document title={`GreenScale Impact Report - ${user.name}`}>
    {/* @ts-ignore */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>GreenScale.</Text>
        <Text style={styles.reportDate}>{date}</Text>
      </View>

      {/* Hero */}
      <View style={styles.heroSection}>
        <Text style={styles.title}>Impact Statement</Text>
        <Text style={styles.subtitle}>Institutional Grade Ethical Verification for {user.name}</Text>
      </View>

      {/* Primary Metrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Current ESG Score</Text>
          <Text style={styles.metricValue}>{metrics.aggregateScore}/100</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>CO2 Offset (Annual)</Text>
          <Text style={styles.metricValue}>{metrics.co2Saved} Tons</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Asset Value (Validated)</Text>
          <Text style={styles.metricValue}>€{metrics.totalValue}</Text>
        </View>
      </View>

      {/* Persona Callout */}
      <View style={styles.personaCard}>
        <View style={styles.personaBadge}>
          <Text>INVESTOR ARCHETYPE</Text>
        </View>
        <Text style={styles.personaTitle}>{user.persona}</Text>
        <Text style={styles.personaText}>
          Based on your values audit regarding "{user.intent}", your portfolio is optimized 
          to prioritize long-term planetary health and community equity. This report confirms 
          that your current holdings align with your ethical mandate.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Certified by GreenScale Audit Engine v5.0</Text>
        <Text style={styles.footerText}>Proprietary & Confidential</Text>
      </View>
    </Page>
  </Document>
);