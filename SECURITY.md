# 🔐 Security Policy

We take the security of Pageant Empress seriously. This document outlines our security practices, how to report vulnerabilities, and what you can expect from us.

## 🛡️ Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 1.0.x   | ✅ **Supported**   | Current stable release |
| 0.9.x   | ⚠️ **Limited**     | Security fixes only until EOL |
| < 0.9   | ❌ **Unsupported** | Please upgrade |

## 🚨 Reporting Security Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

### 📧 **Private Disclosure**
- **Email**: [Thepageantempress@gmail.com](mailto:Thepageantempress@gmail.com)
- **Subject**: `[SECURITY] Vulnerability Report - Pageant Empress`
- **Response Time**: We aim to respond within 48 hours

### 📋 **What to Include**
- **Description**: Clear description of the vulnerability
- **Impact**: Potential security impact and severity
- **Steps to Reproduce**: Detailed reproduction steps
- **Proof of Concept**: Code or screenshots if applicable
- **Suggested Fix**: If you have ideas for mitigation
- **Contact Info**: How we can reach you for follow-up

### ⚠️ **Please DO NOT**
- ❌ Publicly disclose the vulnerability before we've had a chance to address it
- ❌ Test the vulnerability on live websites without permission
- ❌ Access user data or disrupt services
- ❌ Perform automated scanning that could impact performance

## 🔒 Security Measures

### 🌐 **Web Security**

#### Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               img-src 'self' https: data:; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com;
               script-src 'self';
               connect-src 'self';">
