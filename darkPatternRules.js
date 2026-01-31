/**
 * Dark Pattern Rules Database
 * Contains rule-based definitions for detecting common dark patterns
 */

const DarkPatternRules = {
  // Rule categories
  categories: {
    URGENCY: 'Urgency & Scarcity',
    MISDIRECTION: 'Misdirection',
    SNEAKING: 'Sneaking',
    OBSTRUCTION: 'Obstruction',
    FORCED_ACTION: 'Forced Action',
    SOCIAL_PROOF: 'Social Proof',
    VISUAL_INTERFERENCE: 'Visual Interference',
    CONFIRMSHAMING: 'Confirmshaming',
    BAIT_AND_SWITCH: 'Bait and Switch',
    HIDDEN_COSTS: 'Hidden Costs'
  },

  // Rule definitions
  rules: [
    {
      id: 'urgency-countdown',
      category: 'URGENCY',
      name: 'Fake Urgency Timer',
      severity: 'high',
      patterns: [
        /only\s+\d+\s+(left|remaining)/i,
        /hurry|act\s+now|limited\s+time/i,
        /expires?\s+(in|within)/i,
        /\d+:\d+:\d+/,
        /sale\s+ends\s+(soon|today)/i
      ],
      checkElement: (element) => {
        const text = element.textContent?.toLowerCase() || '';
        const hasTimer = element.querySelector('[class*="timer"], [class*="countdown"]');
        const hasUrgentText = /only|hurry|limited|expires/i.test(text);
        return hasTimer && hasUrgentText;
      }
    },
    {
      id: 'scarcity-stock',
      category: 'URGENCY',
      name: 'Fake Scarcity',
      severity: 'high',
      patterns: [
        /only\s+\d+\s+left\s+in\s+stock/i,
        /\d+\s+people\s+(viewing|watching)/i,
        /almost\s+gone/i,
        /selling\s+fast/i
      ],
      checkElement: (element) => {
        const text = element.textContent?.toLowerCase() || '';
        return /only\s+\d+\s+(left|remaining|in\s+stock)/i.test(text);
      }
    },
    {
      id: 'confirmshaming',
      category: 'CONFIRMSHAMING',
      name: 'Confirmshaming',
      severity: 'medium',
      patterns: [
        /no,?\s+i\s+don'?t\s+want/i,
        /no\s+thanks,?\s+i\s+(prefer|like)\s+to/i,
        /i\s+hate\s+(money|savings|deals)/i,
        /no,?\s+i'?ll\s+pay\s+(full|more)/i,
        /i\s+don'?t\s+want\s+to\s+(save|win)/i
      ],
      checkElement: (element) => {
        const text = element.textContent?.toLowerCase() || '';
        const isButton = element.tagName === 'BUTTON' || element.tagName === 'A';
        const hasShaming = /no,?\s+i\s+(don'?t|hate|prefer)/i.test(text);
        return isButton && hasShaming;
      }
    },
    {
      id: 'forced-continuity',
      category: 'SNEAKING',
      name: 'Forced Continuity',
      severity: 'high',
      patterns: [
        /free\s+trial.*automatically\s+charged/i,
        /cancel\s+anytime.*billing\s+starts/i,
        /trial.*card\s+required/i
      ],
      checkElement: (element) => {
        const text = element.textContent?.toLowerCase() || '';
        return /free.*trial/i.test(text) && /card|billing|charge/i.test(text);
      }
    },
    {
      id: 'hidden-costs',
      category: 'HIDDEN_COSTS',
      name: 'Hidden Costs',
      severity: 'high',
      patterns: [
        /\+\s*fees?/i,
        /additional\s+charges/i,
        /taxes?\s+and\s+fees/i,
        /handling\s+fee/i
      ],
      checkElement: (element) => {
        const hasHiddenFees = element.querySelector('[class*="fee"], [class*="charge"]');
        const styles = window.getComputedStyle(element);
        const isHidden = styles.fontSize === '10px' || parseFloat(styles.fontSize) < 12;
        return hasHiddenFees && isHidden;
      }
    },
    {
      id: 'preselection',
      category: 'SNEAKING',
      name: 'Preselected Options',
      severity: 'medium',
      patterns: [],
      checkElement: (element) => {
        if (element.tagName === 'INPUT' && (element.type === 'checkbox' || element.type === 'radio')) {
          const isChecked = element.checked || element.hasAttribute('checked');
          const label = element.labels?.[0]?.textContent?.toLowerCase() || '';
          const isNegative = /newsletter|marketing|promotional|third.party|share.*(data|info)/i.test(label);
          return isChecked && isNegative;
        }
        return false;
      }
    },
    {
      id: 'disguised-ads',
      category: 'MISDIRECTION',
      name: 'Disguised Ads',
      severity: 'medium',
      patterns: [
        /download/i,
        /continue/i,
        /next/i
      ],
      checkElement: (element) => {
        const isButton = element.tagName === 'BUTTON' || element.tagName === 'A';
        const text = element.textContent?.toLowerCase() || '';
        const hasAdClass = element.className.toLowerCase().includes('ad');
        const hasSuspiciousText = /download|continue|next/i.test(text);
        return isButton && !hasAdClass && hasSuspiciousText && element.href?.includes('ad');
      }
    },
    {
      id: 'trick-question',
      category: 'MISDIRECTION',
      name: 'Trick Questions',
      severity: 'high',
      patterns: [
        /don'?t\s+send/i,
        /unsubscribe.*no/i,
        /opt.?out.*unchecked/i
      ],
      checkElement: (element) => {
        const text = element.textContent?.toLowerCase() || '';
        const hasNegation = /don'?t|no|not|never|unsubscribe/i.test(text);
        const hasCheckbox = element.querySelector('input[type="checkbox"]');
        return hasNegation && hasCheckbox;
      }
    },
    {
      id: 'roach-motel',
      category: 'OBSTRUCTION',
      name: 'Roach Motel',
      severity: 'high',
      patterns: [
        /contact.*cancel/i,
        /call.*cancel/i,
        /email.*cancel/i
      ],
      checkElement: (element) => {
        const text = element.textContent?.toLowerCase() || '';
        const isCancellation = /cancel|unsubscribe|delete.*account/i.test(text);
        const requiresContact = /contact|call|email|phone/i.test(text);
        return isCancellation && requiresContact;
      }
    },
    {
      id: 'hard-to-cancel',
      category: 'OBSTRUCTION',
      name: 'Hard to Cancel',
      severity: 'high',
      patterns: [],
      checkElement: (element) => {
        const text = element.textContent?.toLowerCase() || '';
        const isCancelLink = /cancel|close.*account|unsubscribe/i.test(text);
        if (isCancelLink && (element.tagName === 'A' || element.tagName === 'BUTTON')) {
          const styles = window.getComputedStyle(element);
          const isHidden = styles.opacity < 0.5 || styles.fontSize === '10px' || parseFloat(styles.fontSize) < 11;
          return isHidden;
        }
        return false;
      }
    },
    {
      id: 'fake-social-proof',
      category: 'SOCIAL_PROOF',
      name: 'Fake Social Proof',
      severity: 'medium',
      patterns: [
        /\d+\s+(people|users|customers)\s+(bought|purchased|viewing)/i,
        /join\s+\d+\s+(million|thousand)/i,
        /trending\s+now/i,
        /#1\s+best.?seller/i
      ],
      checkElement: (element) => {
        const text = element.textContent?.toLowerCase() || '';
        return /\d+\s+(people|users).*?(bought|viewing|joined)/i.test(text);
      }
    },
    {
      id: 'visual-prominence',
      category: 'VISUAL_INTERFERENCE',
      name: 'Visual Prominence Imbalance',
      severity: 'low',
      patterns: [],
      checkElement: (element) => {
        if (element.tagName === 'BUTTON' || element.tagName === 'A') {
          const styles = window.getComputedStyle(element);
          const text = element.textContent?.toLowerCase() || '';
          const isAccept = /accept|agree|yes|continue|subscribe/i.test(text);
          const isDecline = /decline|no|skip|cancel/i.test(text);
          
          if (isDecline) {
            const isLowContrast = parseFloat(styles.opacity) < 0.6;
            const isSmall = parseFloat(styles.fontSize) < 14;
            return isLowContrast || isSmall;
          }
        }
        return false;
      }
    },
    {
      id: 'forced-enrollment',
      category: 'FORCED_ACTION',
      name: 'Forced Account Creation',
      severity: 'medium',
      patterns: [
        /create.*account.*continue/i,
        /sign.*up.*to.*view/i,
        /register.*required/i
      ],
      checkElement: (element) => {
        const text = element.textContent?.toLowerCase() || '';
        const hasForced = /create.*account|sign.*up|register/i.test(text);
        const hasRequired = /required|must|continue|view/i.test(text);
        return hasForced && hasRequired;
      }
    }
  ],

  /**
   * Get rules by category
   */
  getRulesByCategory(category) {
    return this.rules.filter(rule => rule.category === category);
  },

  /**
   * Get rules by severity
   */
  getRulesBySeverity(severity) {
    return this.rules.filter(rule => rule.severity === severity);
  },

  /**
   * Get all rule IDs
   */
  getAllRuleIds() {
    return this.rules.map(rule => rule.id);
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DarkPatternRules;
}
