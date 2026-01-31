# Dark Pattern Detection Module

A comprehensive dark pattern detection system combining **rule-based** and **AI-powered** approaches to identify manipulative UX patterns on web pages.

## 🎯 Overview

This module detects common dark patterns that manipulate users into actions they might not otherwise take. It uses a hybrid approach:

1. **Rule-Based Detection**: Explicit pattern matching against known dark pattern signatures
2. **AI-Based Detection**: Machine learning-inspired heuristics to detect novel or subtle manipulations

## 📦 Components

### Core Files

- **`darkPatternDetector.js`** - Main detection engine
- **`darkPatternRules.js`** - Rule definitions for common dark patterns
- **`aiDetector.js`** - AI-based detection using heuristics and feature extraction
- **`darkPatternDetector.html`** - Demo interface and testing page

## 🚀 Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <script src="darkPatternRules.js"></script>
    <script src="aiDetector.js"></script>
    <script src="darkPatternDetector.js"></script>
</head>
<body>
    <script>
        // Initialize detector
        const detector = new DarkPatternDetector();
        
        // Scan entire page
        detector.scanPage().then(results => {
            console.log('Found', results.detections.length, 'dark patterns');
            console.log('Summary:', results.summary);
            
            // Highlight patterns on page
            detector.highlightDetections();
        });
    </script>
</body>
</html>
```

### Analyze Single Element

```javascript
const element = document.querySelector('.suspicious-button');
const result = await detector.analyzeElement(element);

if (result.detected) {
    console.log('Dark pattern found!');
    console.log('Severity:', result.severity);
    console.log('Confidence:', result.confidence);
    console.log('Recommendations:', result.recommendations);
}
```

## 🔍 Detection Capabilities

### Dark Pattern Categories

1. **Urgency & Scarcity**
   - Fake countdown timers
   - False stock scarcity claims
   - Artificial time pressure

2. **Confirmshaming**
   - Guilt-inducing decline buttons
   - Manipulative negative language
   - Shame-based opt-out text

3. **Sneaking**
   - Hidden costs and fees
   - Pre-selected checkboxes
   - Forced continuity (auto-renewal)

4. **Obstruction**
   - Hard-to-cancel subscriptions
   - Roach motel patterns
   - Hidden unsubscribe options

5. **Misdirection**
   - Disguised advertisements
   - Trick questions
   - Confusing UI elements

6. **Visual Interference**
   - Low contrast decline buttons
   - Hidden cancellation links
   - Unequal visual prominence

7. **Forced Action**
   - Forced account creation
   - Mandatory information collection
   - Blocked functionality

8. **Social Proof**
   - Fake review counts
   - Misleading popularity claims
   - False "people viewing" notifications

9. **Bait and Switch**
   - Changed terms after commitment
   - Different product than advertised

10. **Hidden Costs**
    - Undisclosed fees
    - Hidden subscription charges
    - Surprise additional costs

### AI Detection Features

The AI detector analyzes:

- **Text Sentiment**: Detects manipulative language patterns
- **Visual Manipulation**: Identifies deceptive styling (low contrast, hidden elements)
- **Behavioral Nudges**: Recognizes psychological pressure tactics
- **Contextual Anomalies**: Detects suspicious timing and placement

## 📊 API Reference

### DarkPatternDetector

#### Methods

##### `scanPage()`
Scans the entire page for dark patterns.

```javascript
const results = await detector.scanPage();
// Returns: {
//   timestamp: string,
//   scanTime: string,
//   totalElements: number,
//   detections: Array,
//   summary: Object
// }
```

##### `analyzeElement(element)`
Analyzes a single DOM element.

```javascript
const result = await detector.analyzeElement(element);
// Returns: {
//   detected: boolean,
//   element: HTMLElement,
//   elementInfo: Object,
//   ruleMatches: Array,
//   aiDetection: Object,
//   confidence: number,
//   severity: string,
//   recommendations: Array
// }
```

##### `highlightDetections()`
Visually highlights detected dark patterns on the page.

```javascript
detector.highlightDetections();
```

##### `removeHighlights()`
Removes all visual highlights.

```javascript
detector.removeHighlights();
```

##### `exportResults()`
Exports detection results as JSON.

```javascript
const json = detector.exportResults();
console.log(json);
```

##### `getStatistics()`
Returns detection statistics.

```javascript
const stats = detector.getStatistics();
// Returns: {
//   total: number,
//   bySeverity: Object,
//   avgConfidence: number
// }
```

##### `setConfig(config)`
Updates detector configuration.

```javascript
detector.setConfig({
    enableRuleBased: true,
    enableAIBased: true,
    minConfidence: 0.5,
    scanDepth: 'full'
});
```

### Configuration Options

```javascript
{
    enableRuleBased: true,      // Enable rule-based detection
    enableAIBased: true,         // Enable AI detection
    minConfidence: 0.5,          // Minimum confidence threshold (0-1)
    scanDepth: 'full',           // 'full' or 'surface'
    excludeSelectors: []         // CSS selectors to exclude from scanning
}
```

## 🎨 Detection Results

### Result Structure

```javascript
{
    detected: true,
    severity: "high",              // "high", "medium", or "low"
    confidence: 0.85,              // 0-1 scale
    elementInfo: {
        tagName: "BUTTON",
        className: "decline-btn",
        text: "No thanks, I hate savings",
        xpath: "/html/body/div[1]/button",
        selector: "body > div.modal > button",
        position: { x: 100, y: 200, width: 150, height: 40 }
    },
    ruleMatches: [
        {
            ruleId: "confirmshaming",
            ruleName: "Confirmshaming",
            category: "CONFIRMSHAMING",
            severity: "medium",
            confidence: 0.9
        }
    ],
    aiDetection: {
        isDarkPattern: true,
        confidence: 0.75,
        detectedPatterns: ["manipulative-language"],
        reasoning: ["Uses negative/guilt-inducing language"]
    },
    recommendations: [
        "Use neutral language for decline options",
        "Respect user choice without guilt-inducing language"
    ]
}
```

## 🧪 Testing

### Open Demo Page

1. Open `darkPatternDetector.html` in a browser
2. Click "Scan Page" to detect patterns in the test examples
3. Use "Highlight Patterns" to see visual indicators
4. Export results to JSON for analysis

### Example Test Cases

The demo page includes test examples for:
- Fake urgency timers
- Confirmshaming buttons
- Scarcity manipulation
- Pre-selected checkboxes
- Hidden cost disclosures

## 🔧 Advanced Usage

### Custom Rules

Add custom detection rules to `darkPatternRules.js`:

```javascript
DarkPatternRules.rules.push({
    id: 'custom-pattern',
    category: 'MISDIRECTION',
    name: 'Custom Dark Pattern',
    severity: 'high',
    patterns: [/your-regex-pattern/i],
    checkElement: (element) => {
        // Custom detection logic
        return element.matches('.suspicious-class');
    }
});
```

### Integrate with Existing Site

```javascript
// Add to your existing site
document.addEventListener('DOMContentLoaded', async () => {
    const detector = new DarkPatternDetector();
    
    // Run scan
    const results = await detector.scanPage();
    
    // Send to analytics
    if (results.detections.length > 0) {
        analytics.track('dark_patterns_detected', {
            count: results.detections.length,
            severity: results.summary.bySeverity
        });
    }
    
    // Auto-fix (optional - use with caution)
    results.detections.forEach(detection => {
        if (detection.severity === 'high') {
            // Flag for manual review
            console.warn('High severity dark pattern:', detection);
        }
    });
});
```

### Browser Extension Integration

```javascript
// content-script.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scan') {
        const detector = new DarkPatternDetector();
        detector.scanPage().then(results => {
            sendResponse(results);
        });
        return true; // Async response
    }
});
```

## 📈 Performance

- **Average scan time**: 100-500ms (depends on page complexity)
- **Memory usage**: ~5-10MB
- **Element analysis**: ~1-2ms per element
- **Supports**: Modern browsers (ES6+)

## ⚠️ Limitations

1. **False Positives**: Some legitimate urgency messages may be flagged
2. **Context Awareness**: Cannot fully understand business context
3. **Dynamic Content**: May miss patterns loaded after initial scan
4. **Language**: Currently optimized for English text
5. **Visual Analysis**: Limited to computed styles (doesn't analyze images)

## 🛡️ Best Practices

### For Developers
1. Run scans during development to catch patterns early
2. Review flagged items - not all urgency is manipulation
3. Use recommendations to improve UX
4. Test with real user scenarios

### For Auditors
1. Export results for documentation
2. Compare scans over time to track improvements
3. Use confidence scores to prioritize fixes
4. Combine with manual review

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Image analysis (using ML models)
- [ ] Real-time monitoring mode
- [ ] Integration with accessibility tools
- [ ] Cloud-based pattern database
- [ ] A/B testing integration
- [ ] Automated fix suggestions
- [ ] Browser extension

## 📄 License

This module is provided as-is for educational and auditing purposes.

## 🤝 Contributing

To add new dark pattern rules:
1. Define pattern in `darkPatternRules.js`
2. Add test case in `darkPatternDetector.html`
3. Document pattern category and severity
4. Test across different scenarios

## 📚 References

- [Dark Patterns Tipline](https://darkpatterns.org/)
- [Deceptive Design](https://www.deceptive.design/)
- [FTC Guidelines on Dark Patterns](https://www.ftc.gov/)
- [Nielsen Norman Group - Dark Patterns](https://www.nngroup.com/articles/dark-patterns/)

## 💡 Examples

### E-commerce Site Audit

```javascript
const detector = new DarkPatternDetector();
const results = await detector.scanPage();

console.log(`Audit Results for ${window.location.href}`);
console.log(`Total Issues: ${results.summary.totalDetections}`);
console.log(`High Severity: ${results.summary.bySeverity.high}`);
console.log(`Top Categories:`, results.summary.topIssues);

// Export for compliance report
const report = detector.exportResults();
// Send to compliance system
```

### Continuous Monitoring

```javascript
// Run scan every 5 minutes
setInterval(async () => {
    const detector = new DarkPatternDetector();
    const results = await detector.scanPage();
    
    if (results.detections.length > 0) {
        // Alert development team
        notifyTeam({
            type: 'dark_pattern_alert',
            count: results.detections.length,
            url: window.location.href,
            timestamp: results.timestamp
        });
    }
}, 5 * 60 * 1000);
```

---

**Built with ❤️ for ethical UX design**
