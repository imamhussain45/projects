/**
 * AI-Based Dark Pattern Detector
 * Uses heuristics, pattern matching, and machine learning-inspired algorithms
 * to detect dark patterns that may not fit explicit rules
 */

class AIDetector {
  constructor() {
    this.suspicionThreshold = 0.6;
    this.features = {
      // Feature extractors for ML-like detection
      textSentiment: this.analyzeTextSentiment.bind(this),
      visualManipulation: this.detectVisualManipulation.bind(this),
      behavioralNudges: this.detectBehavioralNudges.bind(this),
      contextualAnomalies: this.detectContextualAnomalies.bind(this)
    };
  }

  /**
   * Main AI detection method
   * @param {HTMLElement} element - Element to analyze
   * @returns {Object} Detection result with confidence score
   */
  async detect(element) {
    const features = this.extractFeatures(element);
    const predictions = this.makePredictions(features);
    
    return {
      isDarkPattern: predictions.confidence >= this.suspicionThreshold,
      confidence: predictions.confidence,
      detectedPatterns: predictions.patterns,
      features: features,
      reasoning: predictions.reasoning
    };
  }

  /**
   * Extract features from element for analysis
   */
  extractFeatures(element) {
    return {
      text: this.extractTextFeatures(element),
      visual: this.extractVisualFeatures(element),
      behavioral: this.extractBehavioralFeatures(element),
      contextual: this.extractContextualFeatures(element)
    };
  }

  /**
   * Extract text-based features
   */
  extractTextFeatures(element) {
    const text = element.textContent || '';
    const normalizedText = text.toLowerCase().trim();
    
    return {
      length: text.length,
      hasNegativeLanguage: this.hasNegativeLanguage(normalizedText),
      hasUrgentLanguage: this.hasUrgentLanguage(normalizedText),
      hasManipulativeLanguage: this.hasManipulativeLanguage(normalizedText),
      sentimentScore: this.calculateSentiment(normalizedText),
      readabilityScore: this.calculateReadability(normalizedText),
      hasNumberClaims: /\d+/.test(normalizedText),
      hasPercentageClaims: /%/.test(normalizedText)
    };
  }

  /**
   * Extract visual features
   */
  extractVisualFeatures(element) {
    const styles = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    return {
      opacity: parseFloat(styles.opacity),
      fontSize: parseFloat(styles.fontSize),
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      zIndex: parseInt(styles.zIndex) || 0,
      position: styles.position,
      visibility: styles.visibility,
      display: styles.display,
      width: rect.width,
      height: rect.height,
      isOverlay: this.isOverlay(element, styles),
      contrastRatio: this.calculateContrastRatio(styles),
      hasAnimation: this.hasAnimation(element, styles)
    };
  }

  /**
   * Extract behavioral features
   */
  extractBehavioralFeatures(element) {
    return {
      isInteractive: this.isInteractive(element),
      isForm: this.isForm(element),
      hasPreselection: this.hasPreselection(element),
      hasHiddenInputs: this.hasHiddenInputs(element),
      hasTimeConstraint: this.hasTimeConstraint(element),
      blocksUserAction: this.blocksUserAction(element),
      hasRedirection: this.hasRedirection(element)
    };
  }

  /**
   * Extract contextual features
   */
  extractContextualFeatures(element) {
    return {
      isInModal: this.isInModal(element),
      isInPopup: this.isInPopup(element),
      appearsOnLoad: element.hasAttribute('data-onload'),
      hasExitIntent: element.hasAttribute('data-exit-intent'),
      proximityToImportantAction: this.getProximityToAction(element),
      pageContext: this.getPageContext(element)
    };
  }

  /**
   * Make predictions based on extracted features
   */
  makePredictions(features) {
    const scores = [];
    const patterns = [];
    const reasoning = [];

    // Text-based predictions
    if (features.text.hasNegativeLanguage && features.text.sentimentScore < -0.3) {
      scores.push(0.8);
      patterns.push('manipulative-language');
      reasoning.push('Uses negative/guilt-inducing language');
    }

    if (features.text.hasUrgentLanguage && features.text.hasNumberClaims) {
      scores.push(0.7);
      patterns.push('false-urgency');
      reasoning.push('Creates false sense of urgency with specific numbers');
    }

    // Visual manipulation predictions
    if (features.visual.opacity < 0.5 && features.behavioral.isInteractive) {
      scores.push(0.85);
      patterns.push('visual-obstruction');
      reasoning.push('Important interactive element has low visibility');
    }

    if (features.visual.contrastRatio < 3 && features.behavioral.isInteractive) {
      scores.push(0.75);
      patterns.push('low-contrast-deception');
      reasoning.push('Low contrast used to hide important options');
    }

    if (features.visual.isOverlay && features.contextual.isInModal) {
      scores.push(0.65);
      patterns.push('forced-interaction');
      reasoning.push('Overlay forces user interaction');
    }

    // Behavioral predictions
    if (features.behavioral.hasPreselection && features.behavioral.isForm) {
      scores.push(0.8);
      patterns.push('sneaky-preselection');
      reasoning.push('Form has pre-selected options that benefit the company');
    }

    if (features.behavioral.blocksUserAction) {
      scores.push(0.9);
      patterns.push('forced-continuity');
      reasoning.push('Element blocks user from completing desired action');
    }

    if (features.behavioral.hasTimeConstraint && features.text.hasUrgentLanguage) {
      scores.push(0.85);
      patterns.push('pressure-tactics');
      reasoning.push('Combines time pressure with urgent language');
    }

    // Contextual predictions
    if (features.contextual.isInPopup && features.contextual.appearsOnLoad) {
      scores.push(0.6);
      patterns.push('intrusive-popup');
      reasoning.push('Popup appears immediately on page load');
    }

    // Calculate overall confidence
    const confidence = scores.length > 0 
      ? scores.reduce((a, b) => a + b, 0) / scores.length 
      : 0;

    return {
      confidence,
      patterns: [...new Set(patterns)],
      reasoning
    };
  }

  /**
   * Analyze text sentiment
   */
  analyzeTextSentiment(text) {
    const negativeWords = ['hate', 'never', 'lose', 'miss', 'wrong', 'bad', 'poor', 'waste'];
    const positiveWords = ['love', 'great', 'save', 'win', 'best', 'free', 'bonus'];
    
    let score = 0;
    const words = text.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      if (negativeWords.includes(word)) score -= 1;
      if (positiveWords.includes(word)) score += 1;
    });
    
    return score / Math.max(words.length, 1);
  }

  /**
   * Calculate sentiment score
   */
  calculateSentiment(text) {
    const manipulativePatterns = [
      /don'?t miss/i, /lose out/i, /regret/i, /mistake/i, 
      /foolish/i, /stupid/i, /hate/i
    ];
    
    let score = 0;
    manipulativePatterns.forEach(pattern => {
      if (pattern.test(text)) score -= 0.2;
    });
    
    return Math.max(-1, Math.min(1, score));
  }

  /**
   * Calculate readability (simplified)
   */
  calculateReadability(text) {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    return words / Math.max(sentences, 1);
  }

  /**
   * Check for negative language
   */
  hasNegativeLanguage(text) {
    const negativePatterns = [
      /no\s+thanks/i, /don'?t\s+want/i, /i\s+hate/i, 
      /not\s+interested/i, /decline/i, /refuse/i
    ];
    return negativePatterns.some(pattern => pattern.test(text));
  }

  /**
   * Check for urgent language
   */
  hasUrgentLanguage(text) {
    const urgentPatterns = [
      /now/i, /today/i, /hurry/i, /quick/i, /limited/i, 
      /expires?/i, /ending/i, /last\s+chance/i, /act\s+fast/i
    ];
    return urgentPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Check for manipulative language
   */
  hasManipulativeLanguage(text) {
    const manipulativePatterns = [
      /only\s+\d+\s+left/i, /\d+\s+people\s+watching/i,
      /don'?t\s+miss\s+out/i, /everyone\s+is/i,
      /you'?ll\s+regret/i
    ];
    return manipulativePatterns.some(pattern => pattern.test(text));
  }

  /**
   * Check if element is an overlay
   */
  isOverlay(element, styles) {
    const position = styles.position;
    const zIndex = parseInt(styles.zIndex) || 0;
    return (position === 'fixed' || position === 'absolute') && zIndex > 1000;
  }

  /**
   * Calculate contrast ratio (simplified)
   */
  calculateContrastRatio(styles) {
    const bg = styles.backgroundColor;
    const fg = styles.color;
    
    // Simplified contrast calculation
    const getBrightness = (color) => {
      const rgb = color.match(/\d+/g);
      if (!rgb) return 128;
      return (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
    };
    
    const bgBrightness = getBrightness(bg);
    const fgBrightness = getBrightness(fg);
    
    const lighter = Math.max(bgBrightness, fgBrightness);
    const darker = Math.min(bgBrightness, fgBrightness);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Check for animations
   */
  hasAnimation(element, styles) {
    return styles.animation !== 'none' || 
           styles.transition !== 'none' || 
           element.classList.contains('animate') ||
           element.classList.contains('pulse') ||
           element.classList.contains('shake');
  }

  /**
   * Check if element is interactive
   */
  isInteractive(element) {
    const interactiveTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
    return interactiveTags.includes(element.tagName) || 
           element.hasAttribute('onclick') ||
           element.style.cursor === 'pointer';
  }

  /**
   * Check if element is a form
   */
  isForm(element) {
    return element.tagName === 'FORM' || 
           element.querySelector('form') !== null ||
           element.querySelector('input, select, textarea') !== null;
  }

  /**
   * Check for preselected options
   */
  hasPreselection(element) {
    const inputs = element.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    return Array.from(inputs).some(input => input.checked || input.hasAttribute('checked'));
  }

  /**
   * Check for hidden inputs
   */
  hasHiddenInputs(element) {
    const hiddenInputs = element.querySelectorAll('input[type="hidden"]');
    return hiddenInputs.length > 0;
  }

  /**
   * Check for time constraint
   */
  hasTimeConstraint(element) {
    const text = element.textContent?.toLowerCase() || '';
    return /\d+:\d+/.test(text) || 
           element.querySelector('[class*="timer"], [class*="countdown"]') !== null;
  }

  /**
   * Check if element blocks user action
   */
  blocksUserAction(element) {
    const styles = window.getComputedStyle(element);
    return (styles.position === 'fixed' || styles.position === 'absolute') &&
           element.style.pointerEvents !== 'none' &&
           parseInt(styles.zIndex) > 100;
  }

  /**
   * Check for redirection
   */
  hasRedirection(element) {
    if (element.tagName === 'A') {
      const href = element.getAttribute('href') || '';
      return href.includes('redirect') || 
             href.includes('track') || 
             href.includes('ad');
    }
    return false;
  }

  /**
   * Check if element is in modal
   */
  isInModal(element) {
    let parent = element.parentElement;
    while (parent) {
      const classes = parent.className?.toLowerCase() || '';
      if (classes.includes('modal') || classes.includes('dialog')) {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }

  /**
   * Check if element is in popup
   */
  isInPopup(element) {
    let parent = element.parentElement;
    while (parent) {
      const classes = parent.className?.toLowerCase() || '';
      if (classes.includes('popup') || classes.includes('overlay')) {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }

  /**
   * Get proximity to important action
   */
  getProximityToAction(element) {
    const importantButtons = document.querySelectorAll('button[type="submit"], .checkout, .buy');
    let minDistance = Infinity;
    
    const rect1 = element.getBoundingClientRect();
    
    importantButtons.forEach(button => {
      const rect2 = button.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(rect1.left - rect2.left, 2) + 
        Math.pow(rect1.top - rect2.top, 2)
      );
      minDistance = Math.min(minDistance, distance);
    });
    
    return minDistance === Infinity ? null : minDistance;
  }

  /**
   * Get page context
   */
  getPageContext(element) {
    const url = window.location.href.toLowerCase();
    return {
      isCheckout: /checkout|cart|payment/.test(url),
      isLogin: /login|signin|auth/.test(url),
      isSignup: /signup|register|join/.test(url),
      isPricing: /pricing|plans|subscribe/.test(url)
    };
  }

  /**
   * Detect visual manipulation
   */
  detectVisualManipulation(element) {
    const visual = this.extractVisualFeatures(element);
    let score = 0;
    
    if (visual.opacity < 0.5) score += 0.3;
    if (visual.fontSize < 12) score += 0.2;
    if (visual.contrastRatio < 3) score += 0.3;
    if (visual.hasAnimation) score += 0.2;
    
    return Math.min(1, score);
  }

  /**
   * Detect behavioral nudges
   */
  detectBehavioralNudges(element) {
    const behavioral = this.extractBehavioralFeatures(element);
    let score = 0;
    
    if (behavioral.hasPreselection) score += 0.3;
    if (behavioral.hasTimeConstraint) score += 0.3;
    if (behavioral.blocksUserAction) score += 0.4;
    
    return Math.min(1, score);
  }

  /**
   * Detect contextual anomalies
   */
  detectContextualAnomalies(element) {
    const contextual = this.extractContextualFeatures(element);
    let score = 0;
    
    if (contextual.isInModal && contextual.appearsOnLoad) score += 0.3;
    if (contextual.isInPopup) score += 0.2;
    if (contextual.hasExitIntent) score += 0.3;
    
    return Math.min(1, score);
  }

  /**
   * Set suspicion threshold
   */
  setSuspicionThreshold(threshold) {
    this.suspicionThreshold = Math.max(0, Math.min(1, threshold));
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIDetector;
}
