/**
 * Service for querying email client compatibility data
 *
 * @module compatibility
 */

import type {
  CompatibilityInfo,
  CompatibilityQuery,
  EmailClient,
  PropertySupport,
  SupportStatistics,
} from './compatibility.types';
import { SupportLevel } from './compatibility.types';
import {
  COMPATIBILITY_DATABASE,
  getAllProperties,
  getPropertyInfo,
} from './compatibility-data';
import { EMAIL_CLIENT_LABELS } from './compatibility.types';

/**
 * Service for querying CSS property compatibility across email clients
 *
 * @example
 * ```ts
 * const service = new CompatibilityService();
 *
 * // Get support for border-radius
 * const stats = service.getPropertyStatistics('border-radius');
 * console.log(`Support score: ${stats.supportScore}%`);
 *
 * // Get support for a specific client
 * const support = service.getPropertySupportForClient('border-radius', 'outlook-2016-win');
 * console.log(`Outlook 2016: ${support.level}`);
 *
 * // Get workarounds
 * const workarounds = service.getWorkarounds('border-radius', 'outlook-2016-win');
 * ```
 */
export class CompatibilityService {
  /**
   * Get compatibility information for a CSS property
   *
   * @param property - CSS property name (e.g., 'border-radius', 'box-shadow')
   * @returns Compatibility info or undefined if property not found
   */
  public getPropertyInfo(property: string): CompatibilityInfo | undefined {
    return getPropertyInfo(property);
  }

  /**
   * Get support information for a specific property and email client
   *
   * @param property - CSS property name
   * @param client - Email client identifier
   * @returns Support information or undefined if not found
   */
  public getPropertySupportForClient(
    property: string,
    client: EmailClient
  ): PropertySupport | undefined {
    const info = this.getPropertyInfo(property);
    if (!info) {
      return undefined;
    }
    return info.support[client];
  }

  /**
   * Calculate support statistics for a CSS property
   *
   * Calculates percentage of clients supporting the property and
   * assigns a support level (high/medium/low)
   *
   * @param property - CSS property name
   * @returns Support statistics
   */
  public getPropertyStatistics(property: string): SupportStatistics | undefined {
    const info = this.getPropertyInfo(property);
    if (!info) {
      return undefined;
    }

    const clients = Object.keys(info.support) as EmailClient[];
    const totalClients = clients.length;

    let fullSupport = 0;
    let partialSupport = 0;
    let noSupport = 0;
    let unknownSupport = 0;

    clients.forEach((client) => {
      const support = info.support[client];
      switch (support.level) {
        case SupportLevel.FULL:
          fullSupport++;
          break;
        case SupportLevel.PARTIAL:
          partialSupport++;
          break;
        case SupportLevel.NONE:
          noSupport++;
          break;
        case SupportLevel.UNKNOWN:
          unknownSupport++;
          break;
      }
    });

    // Calculate score: full=1.0, partial=0.5, none=0.0, unknown=0.0
    const score =
      (fullSupport * 1.0 + partialSupport * 0.5) / (totalClients - unknownSupport || 1);
    const supportScore = Math.round(score * 100);

    // Determine support level
    let supportLevel: 'high' | 'medium' | 'low' | 'unknown';
    if (unknownSupport === totalClients) {
      supportLevel = 'unknown';
    } else if (supportScore >= 75) {
      supportLevel = 'high';
    } else if (supportScore >= 40) {
      supportLevel = 'medium';
    } else {
      supportLevel = 'low';
    }

    return {
      property,
      totalClients,
      fullSupport,
      partialSupport,
      noSupport,
      unknownSupport,
      supportScore,
      supportLevel,
    };
  }

  /**
   * Get all properties supported by a specific email client
   *
   * @param client - Email client identifier
   * @returns Array of property names with their support levels
   */
  public getClientSupportedProperties(
    client: EmailClient
  ): Array<{ property: string; support: PropertySupport }> {
    const properties = getAllProperties();
    const supported: Array<{ property: string; support: PropertySupport }> = [];

    properties.forEach((property) => {
      const info = this.getPropertyInfo(property);
      if (info) {
        const support = info.support[client];
        if (support) {
          supported.push({ property, support });
        }
      }
    });

    return supported;
  }

  /**
   * Get workarounds for a CSS property
   *
   * @param property - CSS property name
   * @param client - Optional specific email client
   * @returns Array of workaround suggestions
   */
  public getWorkarounds(property: string, client?: EmailClient): string[] {
    const info = this.getPropertyInfo(property);
    if (!info) {
      return [];
    }

    const workarounds: string[] = [];

    // Add safe alternatives (general workarounds)
    if (info.safeAlternatives) {
      workarounds.push(...info.safeAlternatives);
    }

    // Add client-specific workarounds
    if (client) {
      const support = info.support[client];
      if (support?.workarounds) {
        workarounds.push(...support.workarounds);
      }
    } else {
      // Collect all unique workarounds from all clients
      const allWorkarounds = new Set<string>();
      Object.values(info.support).forEach((support) => {
        if (support.workarounds) {
          support.workarounds.forEach((w) => allWorkarounds.add(w));
        }
      });
      workarounds.push(...Array.from(allWorkarounds));
    }

    return [...new Set(workarounds)]; // Remove duplicates
  }

  /**
   * Get properties that are safe to use (high support across clients)
   *
   * @param minScore - Minimum support score (0-100), default 75
   * @returns Array of safe properties with their stats
   */
  public getSafeProperties(minScore: number = 75): Array<{
    property: string;
    stats: SupportStatistics;
  }> {
    const properties = getAllProperties();
    const safe: Array<{ property: string; stats: SupportStatistics }> = [];

    properties.forEach((property) => {
      const stats = this.getPropertyStatistics(property);
      if (stats && stats.supportScore >= minScore) {
        safe.push({ property, stats });
      }
    });

    return safe.sort((a, b) => b.stats.supportScore - a.stats.supportScore);
  }

  /**
   * Get properties with poor support (likely to cause issues)
   *
   * @param maxScore - Maximum support score (0-100), default 40
   * @returns Array of problematic properties with their stats
   */
  public getProblematicProperties(maxScore: number = 40): Array<{
    property: string;
    stats: SupportStatistics;
  }> {
    const properties = getAllProperties();
    const problematic: Array<{ property: string; stats: SupportStatistics }> = [];

    properties.forEach((property) => {
      const stats = this.getPropertyStatistics(property);
      if (stats && stats.supportScore <= maxScore) {
        problematic.push({ property, stats });
      }
    });

    return problematic.sort((a, b) => a.stats.supportScore - b.stats.supportScore);
  }

  /**
   * Query properties based on filters
   *
   * @param query - Query filters
   * @returns Array of matching properties
   */
  public queryProperties(query: CompatibilityQuery): CompatibilityInfo[] {
    let results = Object.values(COMPATIBILITY_DATABASE);

    // Filter by category
    if (query.category) {
      results = results.filter((info) => info.category === query.category);
    }

    // Filter by support level
    if (query.supportLevel) {
      results = results.filter((info) => {
        const stats = this.getPropertyStatistics(info.property);
        return stats && stats.supportLevel === query.supportLevel;
      });
    }

    // Filter by minimum score
    if (query.minScore !== undefined) {
      results = results.filter((info) => {
        const stats = this.getPropertyStatistics(info.property);
        return stats && stats.supportScore >= query.minScore!;
      });
    }

    // Filter by client support
    if (query.client) {
      results = results.filter((info) => {
        const support = info.support[query.client!];
        return support && support.level !== SupportLevel.NONE;
      });
    }

    // Search by property name
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      results = results.filter((info) =>
        info.property.toLowerCase().includes(searchLower)
      );
    }

    return results;
  }

  /**
   * Get all available properties
   *
   * @returns Array of all property names
   */
  public getAllProperties(): string[] {
    return getAllProperties();
  }

  /**
   * Check if a property has compatibility data
   *
   * @param property - CSS property name
   * @returns True if property exists in database
   */
  public hasProperty(property: string): boolean {
    return this.getPropertyInfo(property) !== undefined;
  }

  /**
   * Get a summary of property support across major client categories
   *
   * Useful for quick visualization of property support
   *
   * @param property - CSS property name
   * @returns Support summary by client category
   */
  public getPropertySupportSummary(property: string): {
    property: string;
    outlookWindows: SupportLevel;
    outlookMac: SupportLevel;
    webmail: SupportLevel;
    mobileIOS: SupportLevel;
    mobileAndroid: SupportLevel;
  } | undefined {
    const info = this.getPropertyInfo(property);
    if (!info) {
      return undefined;
    }

    // Outlook Windows (worst case)
    const outlookWinSupport = [
      info.support['outlook-2016-win'],
      info.support['outlook-2019-win'],
      info.support['outlook-2021-win'],
      info.support['outlook-365-win'],
    ];
    const outlookWindows = this.getWorstSupportLevel(outlookWinSupport);

    // Outlook Mac
    const outlookMacSupport = [
      info.support['outlook-2016-mac'],
      info.support['outlook-2019-mac'],
      info.support['outlook-365-mac'],
    ];
    const outlookMac = this.getWorstSupportLevel(outlookMacSupport);

    // Webmail (worst case)
    const webmailSupport = [
      info.support['outlook-web'],
      info.support['gmail-webmail'],
      info.support['yahoo-webmail'],
      info.support['aol-webmail'],
    ];
    const webmail = this.getWorstSupportLevel(webmailSupport);

    // Mobile iOS
    const iosSupport = [
      info.support['apple-mail-ios'],
      info.support['gmail-ios'],
      info.support['outlook-ios'],
    ];
    const mobileIOS = this.getWorstSupportLevel(iosSupport);

    // Mobile Android
    const androidSupport = [
      info.support['gmail-android'],
      info.support['samsung-email'],
      info.support['outlook-android'],
    ];
    const mobileAndroid = this.getWorstSupportLevel(androidSupport);

    return {
      property,
      outlookWindows,
      outlookMac,
      webmail,
      mobileIOS,
      mobileAndroid,
    };
  }

  /**
   * Get the worst support level from an array of support data
   *
   * @param supports - Array of PropertySupport
   * @returns Worst support level
   */
  private getWorstSupportLevel(supports: PropertySupport[]): SupportLevel {
    const levels = supports.map((s) => s.level);

    if (levels.includes(SupportLevel.NONE)) {
      return SupportLevel.NONE;
    }
    if (levels.includes(SupportLevel.PARTIAL)) {
      return SupportLevel.PARTIAL;
    }
    if (levels.includes(SupportLevel.UNKNOWN)) {
      return SupportLevel.UNKNOWN;
    }
    return SupportLevel.FULL;
  }

  /**
   * Get human-readable label for an email client
   *
   * @param client - Email client identifier
   * @returns Human-readable label
   */
  public getClientLabel(client: EmailClient): string {
    return EMAIL_CLIENT_LABELS[client] || client;
  }
}
