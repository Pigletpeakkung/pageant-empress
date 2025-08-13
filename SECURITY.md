# Security Policy

The security of Pageant Empress and our community is our top priority. This document outlines our security policies and procedures.

## 🛡️ Supported Versions

We actively maintain security for the following versions:

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 1.2.x   | ✅ Yes             | Active |
| 1.1.x   | ✅ Yes             | LTS    |
| 1.0.x   | ⚠️ Limited Support | EOL Soon |
| < 1.0   | ❌ No              | Deprecated |

**Note:** Security updates are provided for the current major version and the previous LTS version.

## 🚨 Reporting Security Vulnerabilities

### **Please DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities responsibly through one of these channels:

### 🔒 **Primary Contact**
- **Email**: [security@pageantempress.com](mailto:security@pageantempress.com)
- **Subject**: `[SECURITY] Brief Description`
- **PGP Key**: Available on request

### 📧 **Alternative Contact**
- **Developer Email**: [Thanattsitt.info@yahoo.co.uk](mailto:Thanattsitt.info@yahoo.co.uk)
- **Subject**: `[SECURITY VULNERABILITY] Brief Description`

### 📋 **What to Include in Your Report**

Please include as much of the following information as possible:

1. **Vulnerability Type**: XSS, CSRF, Information Disclosure, etc.
2. **Location**: Specific files, URLs, or components affected
3. **Step-by-Step Reproduction**: Detailed steps to reproduce the issue
4. **Impact Assessment**: Potential impact and severity
5. **Proof of Concept**: Screenshots, code samples, or demo (if safe)
6. **Suggested Fix**: Any ideas for remediation (optional)
7. **Your Contact Information**: For follow-up communication

### ⏰ **Response Timeline**

We are committed to responding promptly to security reports:

- **Initial Response**: Within 48 hours
- **Severity Assessment**: Within 5 business days
- **Status Updates**: Weekly until resolution
- **Fix Timeline**: 
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Next scheduled release

## 🏆 **Responsible Disclosure Process**

We follow a coordinated vulnerability disclosure process:

### 1. **Report Received** ✉️
- Acknowledgment sent within 48 hours
- Internal security team notified
- Unique tracking ID assigned

### 2. **Initial Assessment** 🔍
- Vulnerability reproduced and verified
- Impact and severity determined using CVSS v3.1
- Affected versions identified

### 3. **Investigation & Development** 🛠️
- Root cause analysis performed
- Security fix developed and tested
- Documentation updated

### 4. **Fix Deployment** 🚀
- Security update released
- Users notified through appropriate channels
- Public disclosure coordinated with reporter

### 5. **Public Disclosure** 📢
- Security advisory published
- Credit given to reporter (if desired)
- Post-mortem conducted

## 🎯 **Security Scope**

### ✅ **In Scope**
The following components are covered by this security policy:

- **Core Application**: All JavaScript, CSS, and HTML files
- **Service Worker**: Offline functionality and caching
- **Progressive Web App**: Manifest and PWA features
- **Data Handling**: JSON data processing and sanitization
- **Third-party Integrations**: External APIs and services
- **Build Process**: Development and deployment scripts

### ❌ **Out of Scope**
The following are generally out of scope:

- **Hosting Platforms**: Issues with Netlify, Vercel, GitHub Pages
- **Third-party CDNs**: External image or font services
- **User's Browser**: Browser-specific vulnerabilities
- **Social Engineering**: Non-technical attacks
- **Physical Security**: Server room access, etc.
- **DoS/DDoS Attacks**: Unless causing persistent service disruption

## 🛡️ **Security Measures in Place**

### **Application Security**

#### 1. **Content Security Policy (CSP)**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               img-src 'self' https:; 
               style-src 'self' 'unsafe-inline'; 
               script-src 'self'; 
               object-src 'none'; 
               base-uri 'self';">
