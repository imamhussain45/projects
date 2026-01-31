/**
 * Dark Pattern Detector - Main Module
 * Combines rule-based and AI-based detection approaches
 */

class DarkPatternDetector {
  constructor() {
    this.aiDetector = new AIDetector();
    this.rules = DarkPatternRules;
    this.detectionResults = [];
    this.config = {
      enableRuleBased: true,
      enableAIBased: true,
      minConfidence: 0.5,
      scanDepth: 'full', // 'full' or 'surface'
      excludeSelectors: ['.dark-pattern-badge']
    };
  }

  /**
   * Scan entire page for dark patterns
   * @returns {Promise<Object>} Scan results
   */
  async scanPage() {
    console.log('🔍 Starting dark pattern scan...');
    const startTime = performance.now();
    
    this.detectionResults = [];
    const allElements = this.getAllRelevantElements();
    
    console.log(`📊 Scanning ${allElements.length} elements...`);
    
    for (const element of allElements) {
      const result = await this.analyzeElement(element);
      if (result.detected) {
        this.detectionResults.push(result);
      }
    }
    
    const endTime = performance.now();
    const scanTime = (endTime - startTime).toFixed(2);
    
    const summary = this.generateSummary();
    console.log(`✅ Scan complete in ${scanTime}ms`);
    console.log(`🚨 Found ${this.detectionResults.length} dark patterns`);
    
    return {
      timestamp: new Date().toISOString(),
      scanTime,
      totalElements: allElements.length,
      detections: this.detectionResults,
      summary
    };
  }

  /**
   * Analyze a single element for dark patterns
   * @param {HTMLElement} element - Element to analyze
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeElement(element) {
    const ruleResults = this.config.enableRuleBased ? this.applyRules(element) : [];
    const aiResult = this.config.enableAIBased ? await this.aiDetector.detect(element) : null;
    
    // Combine results
    const detected = ruleResults.length > 0 || (aiResult && aiResult.isDarkPattern);
    
    if (!detected) {
      return { detected: false };
    }
    
    return {
      detected: true,
      element: element,
      elementInfo: this.getElementInfo(element),
      ruleMatches: ruleResults,
      aiDetection: aiResult,
      confidence: this.calculateOverallConfidence(ruleResults, aiResult),
      severity: this.determineSeverity(ruleResults, aiResult),
      recommendations: this.generateRecommendations(ruleResults, aiResult)
    };
  }

  /**
   * Apply rule-based detection
   */
  applyRules(element) {
    const matches = [];
    
    for (const rule of this.rules.rules) {
      let isMatch = false;
      
      // Check text patterns
      const text = element.textContent || '';
      for (const pattern of rule.patterns) {
        if (pattern.test(text)) {
          isMatch = true;
          break;
        }
      }
      
      // Check custom element function
      if (!isMatch && rule.checkElement) {
        try {
          isMatch = rule.checkElement(element);
        } catch (error) {
          console.warn(`Error checking rule ${rule.id}:`, error);
        }
      }
      
      if (isMatch) {
        matches.push({
          ruleId: rule.id,
          ruleName: rule.name,
          category: rule.category,
          severity: rule.severity,
          confidence: 0.9 // Rule-based has high confidence
        });
      }
    }
    
    return matches;
  }

  /**
   * Get all relevant elements to scan
   */
  getAllRelevantElements() {
    const elements = [];
    
    // Get all interactive elements
    const interactiveSelectors = [
      'button',
      'a',
      'input',
      'form',
      '[onclick]',
      '[role="button"]',
      '.button',
      '.btn'
    ];
    
    // Get elements with suspicious classes/text
    const suspiciousSelectors = [
      '[class*="timer"]',
      '[class*="countdown"]',
      '[class*="urgent"]',
      '[class*="limited"]',
      '[class*="modal"]',
      '[class*="popup"]',
      '[class*="overlay"]'
    ];
    
    const allSelectors = [...interactiveSelectors, ...suspiciousSelectors];
    
    allSelectors.forEach(selector => {
      try {
        const found = document.querySelectorAll(selector);
        found.forEach(el => {
          // Exclude elements we should skip
          const shouldExclude = this.config.excludeSelectors.some(
            excludeSelector => el.matches(excludeSelector)
          );
          if (!shouldExclude && !elements.includes(el)) {
            elements.push(el);
          }
        });
      } catch (error) {
        console.warn(`Invalid selector: ${selector}`);
      }
    });
    
    // Also check elements with manipulative text
    const allText = document.querySelectorAll('*');
    allText.forEach(el => {
      const text = el.textContent?.toLowerCase() || '';
      const hasManipulativeText = /only\s+\d+\s+left|hurry|limited|act\s+now|don'?t\s+miss/i.test(text);
      if (hasManipulativeText && !elements.includes(el)) {
        elements.push(el);
      }
    });
    
    return elements;
  }

  /**
   * Get element information
   */
  getElementInfo(element) {
    const rect = element.getBoundingClientRect();
    return {
      tagName: element.tagName,
      id: element.id,
      className: element.className,
      text: element.textContent?.substring(0, 100).trim(),
      xpath: this.getXPath(element),
      selector: this.getCSSSelector(element),
      position: {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      },
      visible: this.isVisible(element)
    };
  }

  /**
   * Calculate overall confidence
   */
  calculateOverallConfidence(ruleResults, aiResult) {
    let confidence = 0;
    let count = 0;
    
    // Rule-based confidence
    if (ruleResults.length > 0) {
      const ruleConfidence = ruleResults.reduce((sum, r) => sum + r.confidence, 0) / ruleResults.length;
      confidence += ruleConfidence * 0.6; // Weight: 60%
      count++;
    }
    
    // AI-based confidence
    if (aiResult && aiResult.isDarkPattern) {
      confidence += aiResult.confidence * 0.4; // Weight: 40%
      count++;
    }
    
    return count > 0 ? confidence : 0;
  }

  /**
   * Determine severity
   */
  determineSeverity(ruleResults, aiResult) {
    // Priority: high > medium > low
    const severities = ruleResults.map(r => r.severity);
    
    if (severities.includes('high')) return 'high';
    if (severities.includes('medium')) return 'medium';
    if (severities.includes('low')) return 'low';
    
    // Use AI confidence if no rules matched
    if (aiResult && aiResult.isDarkPattern) {
      if (aiResult.confidence > 0.8) return 'high';
      if (aiResult.confidence > 0.6) return 'medium';
      return 'low';
    }
    
    return 'low';
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(ruleResults, aiResult) {
    const recommendations = [];
    const categories = new Set();
    
    // Get categories from rule matches
    ruleResults.forEach(rule => {
      categories.add(rule.category);
    });
    
    // Generate recommendations based on categories
    if (categories.has('URGENCY')) {
      recommendations.push('Remove or verify artificial urgency claims');
      recommendations.push('Ensure scarcity claims are accurate and not misleading');
    }
    
    if (categories.has('CONFIRMSHAMING')) {
      recommendations.push('Use neutral language for decline options');
      recommendations.push('Respect user choice without guilt-inducing language');
    }
    
    if (categories.has('SNEAKING')) {
      recommendations.push('Make all costs and terms transparent upfront');
      recommendations.push('Remove pre-selected options that benefit the company');
    }
    
    if (categories.has('OBSTRUCTION')) {
      recommendations.push('Make cancellation as easy as subscription');
      recommendations.push('Provide clear, accessible exit options');
    }
    
    if (categories.has('VISUAL_INTERFERENCE')) {
      recommendations.push('Ensure equal visual prominence for all options');
      recommendations.push('Maintain adequate contrast and readability');
    }
    
    // Add AI-based recommendations
    if (aiResult && aiResult.reasoning) {
      aiResult.reasoning.forEach(reason => {
        recommendations.push(`AI detected: ${reason}`);
      });
    }
    
    return [...new Set(recommendations)]; // Remove duplicates
  }

  /**
   * Generate scan summary
   */
  generateSummary() {
    const summary = {
      totalDetections: this.detectionResults.length,
      bySeverity: { high: 0, medium: 0, low: 0 },
      byCategory: {},
      topIssues: []
    };
    
    this.detectionResults.forEach(result => {
      // Count by severity
      summary.bySeverity[result.severity]++;
      
      // Count by category
      result.ruleMatches.forEach(match => {
        const category = match.category;
        summary.byCategory[category] = (summary.byCategory[category] || 0) + 1;
      });
    });
    
    // Get top issues
    const categoryEntries = Object.entries(summary.byCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    summary.topIssues = categoryEntries.map(([category, count]) => ({
      category,
      count,
      categoryName: this.rules.categories[category] || category
    }));
    
    return summary;
  }

  /**
   * Get XPath for element
   */
  getXPath(element) {
    if (element.id) {
      return `//*[@id="${element.id}"]`;
    }
    
    const parts = [];
    let current = element;
    
    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let index = 0;
      let sibling = current.previousSibling;
      
      while (sibling) {
        if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === current.nodeName) {
          index++;
        }
        sibling = sibling.previousSibling;
      }
      
      const tagName = current.nodeName.toLowerCase();
      const part = index > 0 ? `${tagName}[${index + 1}]` : tagName;
      parts.unshift(part);
      
      current = current.parentNode;
    }
    
    return '/' + parts.join('/');
  }

  /**
   * Get CSS selector for element
   */
  getCSSSelector(element) {
    if (element.id) {
      return `#${element.id}`;
    }
    
    const path = [];
    let current = element;
    
    while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
      let selector = current.nodeName.toLowerCase();
      
      if (current.className) {
        const classes = current.className.split(' ').filter(c => c).slice(0, 2);
        if (classes.length > 0) {
          selector += '.' + classes.join('.');
        }
      }
      
      path.unshift(selector);
      current = current.parentNode;
      
      if (path.length > 4) break; // Limit depth
    }
    
    return path.join(' > ');
  }

  /**
   * Check if element is visible
   */
  isVisible(element) {
    const styles = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    return styles.display !== 'none' &&
           styles.visibility !== 'hidden' &&
           styles.opacity !== '0' &&
           rect.width > 0 &&
           rect.height > 0;
  }

  /**
   * Highlight detected dark patterns on page
   */
  highlightDetections() {
    // Remove existing highlights
    document.querySelectorAll('.dark-pattern-badge').forEach(badge => badge.remove());
    
    this.detectionResults.forEach((result, index) => {
      const element = result.element;
      
      if (!element || !this.isVisible(element)) return;
      
      // Add highlight
      element.style.outline = `3px solid ${this.getSeverityColor(result.severity)}`;
      element.style.outlineOffset = '2px';
      
      // Add badge
      const badge = document.createElement('div');
      badge.className = 'dark-pattern-badge';
      badge.style.cssText = `
        position: absolute;
        background: ${this.getSeverityColor(result.severity)};
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: bold;
        z-index: 10000;
        pointer-events: none;
        font-family: Arial, sans-serif;
      `;
      badge.textContent = `⚠️ ${result.severity.toUpperCase()}`;
      
      const rect = element.getBoundingClientRect();
      badge.style.left = (rect.left + window.scrollX) + 'px';
      badge.style.top = (rect.top + window.scrollY - 25) + 'px';
      
      document.body.appendChild(badge);
    });
  }

  /**
   * Remove highlights
   */
  removeHighlights() {
    this.detectionResults.forEach(result => {
      if (result.element) {
        result.element.style.outline = '';
        result.element.style.outlineOffset = '';
      }
    });
    
    document.querySelectorAll('.dark-pattern-badge').forEach(badge => badge.remove());
  }

  /**
   * Get severity color
   */
  getSeverityColor(severity) {
    const colors = {
      high: '#dc2626',
      medium: '#f59e0b',
      low: '#3b82f6'
    };
    return colors[severity] || colors.low;
  }

  /**
   * Export results as JSON
   */
  exportResults() {
    const results = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      detections: this.detectionResults.map(r => ({
        severity: r.severity,
        confidence: r.confidence,
        element: r.elementInfo,
        ruleMatches: r.ruleMatches,
        aiDetection: r.aiDetection ? {
          confidence: r.aiDetection.confidence,
          patterns: r.aiDetection.patterns,
          reasoning: r.aiDetection.reasoning
        } : null,
        recommendations: r.recommendations
      })),
      summary: this.generateSummary()
    };
    
    return JSON.stringify(results, null, 2);
  }

  /**
   * Get detection statistics
   */
  getStatistics() {
    return {
      total: this.detectionResults.length,
      bySeverity: this.detectionResults.reduce((acc, r) => {
        acc[r.severity] = (acc[r.severity] || 0) + 1;
        return acc;
      }, {}),
      avgConfidence: this.detectionResults.length > 0
        ? (this.detectionResults.reduce((sum, r) => sum + r.confidence, 0) / this.detectionResults.length).toFixed(2)
        : 0
    };
  }

  /**
   * Update configuration
   */
  setConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DarkPatternDetector;
}
