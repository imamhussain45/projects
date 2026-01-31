/**
 * Integration Examples for Dark Pattern Detector
 * Various ways to integrate the detector into your projects
 */

// ============================================
// Example 1: Basic Page Scan on Load
// ============================================
async function basicScanExample() {
    const detector = new DarkPatternDetector();
    
    // Wait for page to fully load
    window.addEventListener('DOMContentLoaded', async () => {
        console.log('🔍 Running dark pattern scan...');
        
        const results = await detector.scanPage();
        
        if (results.detections.length > 0) {
            console.warn(`⚠️ Found ${results.detections.length} dark patterns`);
            detector.highlightDetections();
        } else {
            console.log('✅ No dark patterns detected');
        }
    });
}

// ============================================
// Example 2: Scan Before Form Submission
// ============================================
function scanFormExample() {
    const detector = new DarkPatternDetector();
    
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Scan form for dark patterns
            const result = await detector.analyzeElement(form);
            
            if (result.detected && result.severity === 'high') {
                const confirm = window.confirm(
                    'This form contains potential dark patterns. Continue anyway?'
                );
                
                if (!confirm) return;
            }
            
            // Continue with submission
            form.submit();
        });
    });
}

// ============================================
// Example 3: Real-time Monitoring
// ============================================
class DarkPatternMonitor {
    constructor() {
        this.detector = new DarkPatternDetector();
        this.observer = null;
        this.debounceTimer = null;
    }
    
    start() {
        // Watch for DOM changes
        this.observer = new MutationObserver((mutations) => {
            clearTimeout(this.debounceTimer);
            
            // Debounce scans
            this.debounceTimer = setTimeout(() => {
                this.scanNewElements(mutations);
            }, 500);
        });
        
        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ Dark pattern monitor started');
    }
    
    async scanNewElements(mutations) {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const result = await this.detector.analyzeElement(node);
                    
                    if (result.detected) {
                        console.warn('🚨 New dark pattern detected:', result);
                        this.handleDetection(result);
                    }
                }
            }
        }
    }
    
    handleDetection(result) {
        // Add visual indicator
        if (result.element) {
            result.element.style.outline = '3px solid red';
            result.element.title = `Dark Pattern: ${result.ruleMatches.map(r => r.ruleName).join(', ')}`;
        }
    }
    
    stop() {
        if (this.observer) {
            this.observer.disconnect();
            console.log('👁️ Dark pattern monitor stopped');
        }
    }
}

// Usage:
// const monitor = new DarkPatternMonitor();
// monitor.start();

// ============================================
// Example 4: Analytics Integration
// ============================================
async function analyticsIntegration() {
    const detector = new DarkPatternDetector();
    const results = await detector.scanPage();
    
    // Track in Google Analytics (or similar)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'dark_pattern_scan', {
            'event_category': 'UX Audit',
            'event_label': window.location.pathname,
            'value': results.detections.length,
            'high_severity': results.summary.bySeverity.high || 0,
            'medium_severity': results.summary.bySeverity.medium || 0,
            'low_severity': results.summary.bySeverity.low || 0
        });
    }
    
    // Send to custom analytics
    fetch('/api/analytics/dark-patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            url: window.location.href,
            timestamp: results.timestamp,
            detections: results.summary,
            userAgent: navigator.userAgent
        })
    });
}

// ============================================
// Example 5: A/B Testing Integration
// ============================================
async function abTestingExample() {
    const detector = new DarkPatternDetector();
    
    // Variant A: Current design
    // Variant B: Improved design without dark patterns
    
    const results = await detector.scanPage();
    const hasDarkPatterns = results.detections.length > 0;
    
    // Track variant performance
    const variantData = {
        variant: hasDarkPatterns ? 'A' : 'B',
        darkPatternCount: results.detections.length,
        conversionRate: calculateConversionRate(),
        bounceRate: calculateBounceRate(),
        userSatisfaction: getUserSatisfaction()
    };
    
    // Send to A/B testing platform
    console.log('A/B Test Data:', variantData);
}

// ============================================
// Example 6: Automated Reporting
// ============================================
class DarkPatternReporter {
    constructor(apiEndpoint) {
        this.detector = new DarkPatternDetector();
        this.apiEndpoint = apiEndpoint;
    }
    
    async generateReport() {
        const results = await this.detector.scanPage();
        
        const report = {
            metadata: {
                url: window.location.href,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            },
            summary: results.summary,
            detections: results.detections.map(d => ({
                severity: d.severity,
                confidence: d.confidence,
                element: d.elementInfo,
                patterns: d.ruleMatches.map(r => r.ruleName),
                recommendations: d.recommendations
            })),
            screenshots: await this.captureScreenshots(results.detections)
        };
        
        return report;
    }
    
    async captureScreenshots(detections) {
        // Capture screenshots of detected patterns
        // (Would require html2canvas or similar library)
        const screenshots = [];
        
        for (const detection of detections) {
            if (detection.element) {
                // Placeholder - implement with html2canvas
                screenshots.push({
                    element: detection.elementInfo.selector,
                    dataUrl: null // Would be base64 image data
                });
            }
        }
        
        return screenshots;
    }
    
    async submitReport(report) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(report)
            });
            
            if (response.ok) {
                console.log('✅ Report submitted successfully');
                return await response.json();
            } else {
                console.error('❌ Report submission failed');
            }
        } catch (error) {
            console.error('❌ Error submitting report:', error);
        }
    }
}

// Usage:
// const reporter = new DarkPatternReporter('/api/dark-pattern-reports');
// const report = await reporter.generateReport();
// await reporter.submitReport(report);

// ============================================
// Example 7: Chrome Extension Integration
// ============================================
const chromeExtensionExample = {
    // background.js
    background: `
        chrome.action.onClicked.addListener((tab) => {
            chrome.tabs.sendMessage(tab.id, { action: 'scan' });
        });
    `,
    
    // content-script.js
    contentScript: `
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'scan') {
                const detector = new DarkPatternDetector();
                detector.scanPage().then(results => {
                    // Show results in popup or notification
                    chrome.runtime.sendMessage({
                        action: 'showResults',
                        data: results
                    });
                    
                    // Highlight on page
                    detector.highlightDetections();
                });
            }
        });
    `,
    
    // popup.js
    popup: `
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'showResults') {
                displayResults(request.data);
            }
        });
        
        function displayResults(results) {
            document.getElementById('count').textContent = results.detections.length;
            // Display detailed results in popup UI
        }
    `
};

// ============================================
// Example 8: React Component Integration
// ============================================
const reactIntegrationExample = `
import React, { useEffect, useState } from 'react';

function DarkPatternScanner() {
    const [results, setResults] = useState(null);
    const [scanning, setScanning] = useState(false);
    
    const runScan = async () => {
        setScanning(true);
        const detector = new DarkPatternDetector();
        const scanResults = await detector.scanPage();
        setResults(scanResults);
        setScanning(false);
        
        // Highlight patterns
        detector.highlightDetections();
    };
    
    useEffect(() => {
        // Auto-scan on mount
        runScan();
    }, []);
    
    return (
        <div className="dark-pattern-scanner">
            <button onClick={runScan} disabled={scanning}>
                {scanning ? 'Scanning...' : 'Scan Page'}
            </button>
            
            {results && (
                <div className="results">
                    <h3>Found {results.detections.length} dark patterns</h3>
                    <div className="severity">
                        <span>High: {results.summary.bySeverity.high || 0}</span>
                        <span>Medium: {results.summary.bySeverity.medium || 0}</span>
                        <span>Low: {results.summary.bySeverity.low || 0}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DarkPatternScanner;
`;

// ============================================
// Example 9: Automated Testing Integration
// ============================================
async function cypressIntegration() {
    // In Cypress test
    const cypressTest = `
        describe('Dark Pattern Detection', () => {
            it('should not contain dark patterns', () => {
                cy.visit('/checkout');
                
                cy.window().then(async (win) => {
                    const detector = new win.DarkPatternDetector();
                    const results = await detector.scanPage();
                    
                    // Assert no high severity patterns
                    expect(results.summary.bySeverity.high).to.equal(0);
                    
                    // Export results for review
                    cy.writeFile(
                        'cypress/reports/dark-patterns.json',
                        results
                    );
                });
            });
        });
    `;
    
    return cypressTest;
}

// ============================================
// Example 10: CI/CD Pipeline Integration
// ============================================
const cicdIntegration = `
# GitHub Actions workflow
name: Dark Pattern Audit

on:
  pull_request:
    branches: [main]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run Dark Pattern Detection
        run: |
          npm run build
          npm run test:dark-patterns
      
      - name: Upload Report
        uses: actions/upload-artifact@v2
        with:
          name: dark-pattern-report
          path: reports/dark-patterns.json
      
      - name: Comment on PR
        if: failure()
        uses: actions/github-script@v5
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '⚠️ Dark patterns detected! Check the artifacts for details.'
            })
`;

// ============================================
// Utility Functions
// ============================================

function calculateConversionRate() {
    // Placeholder - implement based on your tracking
    return 0.0;
}

function calculateBounceRate() {
    // Placeholder - implement based on your tracking
    return 0.0;
}

function getUserSatisfaction() {
    // Placeholder - implement based on your tracking
    return 0.0;
}

// Export examples
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        basicScanExample,
        scanFormExample,
        DarkPatternMonitor,
        analyticsIntegration,
        DarkPatternReporter,
        chromeExtensionExample,
        reactIntegrationExample,
        cypressIntegration,
        cicdIntegration
    };
}
