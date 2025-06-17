-- ============================================
-- LEGAL PAGES CONTENT POPULATION
-- ============================================

-- Clear existing legal pages and populate with proper content
DELETE FROM legal_pages WHERE page_type IN ('privacy', 'terms', 'cookies');

-- ============================================
-- PRIVACY POLICY CONTENT
-- ============================================

INSERT INTO legal_pages (page_type, title, content, last_updated, version) VALUES (
'privacy', 
'Privacy Policy', 
'## 1. Introduction

EtherCore ("we," "us," or "our") values your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website.

## 2. Information We Collect

We collect information to provide better services to all our users:

**Personal Information:**
- Name and email address when you contact us
- Subject and message content from inquiry forms
- Communication preferences

**Technical Information:**
- IP address and browser type
- Pages visited and time spent on site
- Device information and screen resolution
- Referral source and search terms

**Cookies & Tracking:**
- Essential cookies for website functionality
- Analytics cookies for performance monitoring
- Security cookies for spam protection

## 3. How We Use Your Information

We use your information to:

- **Respond to inquiries** and provide customer support
- **Improve our website** and optimize user experience
- **Analyze traffic patterns** and enhance security
- **Send relevant updates** about our services (with consent)
- **Comply with legal obligations** and protect our rights

## 4. Cookies & Tracking

We use cookies for security, analytics, and a better user experience. Our cookies include:

- **Essential Cookies:** Required for basic website functionality
- **Analytics Cookies:** Help us understand how visitors use our site
- **Security Cookies:** Protect against spam and malicious activity

For detailed information, please read our [Cookie Policy](/cookies).

## 5. Your Rights

Under data protection laws, you have the right to:

- **Access** your personal data we hold
- **Correct** inaccurate or incomplete information
- **Delete** your data (where legally permissible)
- **Object** to processing for marketing purposes
- **Withdraw consent** at any time

To exercise these rights, contact us at **admin@ether-core.com**.

## 6. Data Security

We implement appropriate security measures to protect your personal information:

- **Encryption** of data in transit and at rest
- **Access controls** limiting who can view your data
- **Regular security audits** and system updates
- **Secure hosting** with reputable providers

However, no system is 100% secure, and we cannot guarantee absolute security.

## 7. Data Retention

We retain your information only as long as necessary:

- **Contact inquiries:** 2 years for follow-up purposes
- **Analytics data:** 12 months for performance analysis
- **Marketing data:** Until you unsubscribe or request deletion

## 8. Third-Party Services

We may use third-party services that collect information:

- **Google Analytics:** For website traffic analysis
- **Google reCAPTCHA:** For spam protection
- **Email providers:** For communication services

These services have their own privacy policies.

## 9. International Transfers

Your data may be transferred to countries outside your region. We ensure appropriate safeguards are in place to protect your information.

## 10. Changes to This Privacy Policy

We may update this policy occasionally. We will notify you of any significant changes by posting the new policy on this page.

## 11. Contact Us

If you have questions about this Privacy Policy, please contact us:

📧 **Email:** admin@ether-core.com  
🌐 **Website:** https://ether-core.com  
📍 **Address:** United Kingdom',
CURRENT_DATE,
'2.0'
);

-- ============================================
-- TERMS OF SERVICE CONTENT
-- ============================================

INSERT INTO legal_pages (page_type, title, content, last_updated, version) VALUES (
'terms',
'Terms of Service',
'## 1. Introduction

Welcome to EtherCore. By accessing our website at https://ether-core.com, you agree to these Terms of Service and our Privacy Policy.

## 2. Acceptance of Terms

By using our website, you confirm that:

- You are at least **18 years old** or have parental consent
- You agree to comply with all applicable laws and regulations
- You accept these terms in full without modification

## 3. Use of Our Website

**Permitted Use:**
- Browse our services and content
- Contact us for business inquiries
- Share our content with proper attribution

**Prohibited Use:**
- Engage in unlawful activities or harassment
- Attempt to hack, disrupt, or damage our systems
- Use automated tools to scrape our content
- Violate intellectual property rights

## 4. Our Services

EtherCore provides:

- **Web Development** services and solutions
- **AI Automation** consulting and implementation
- **Digital Marketing** support and strategy
- **Technical Consulting** for various projects

All services are subject to separate agreements and terms.

## 5. Intellectual Property

**Our Content:**
- All website content, design, and branding belong to EtherCore
- You may not copy, distribute, or modify our content without permission
- Our logo, trademarks, and service marks are protected

**Your Content:**
- You retain ownership of content you submit to us
- You grant us permission to use your content for service delivery
- You confirm your content doesn''t violate any laws or rights

## 6. User-Submitted Content

When you contact us or submit content:

- You grant us permission to use it for business purposes
- You confirm it doesn''t violate any laws or third-party rights
- You agree we may store and process it according to our Privacy Policy

## 7. Disclaimers & Limitations

**No Guarantees:**
- We provide information "as is" without warranties
- We don''t guarantee error-free or uninterrupted service
- Results from our services may vary

**Limited Liability:**
- We''re not responsible for indirect or consequential damages
- Our liability is limited to the amount you paid for our services
- We''re not liable for third-party content or external links

**External Links:**
- We may link to third-party websites for your convenience
- We don''t control or endorse external content
- Use external links at your own risk

## 8. Service Availability

- We may modify, suspend, or discontinue services without notice
- We''re not liable for service interruptions or changes
- We reserve the right to refuse service to anyone

## 9. Privacy & Data Protection

Your use of this site is governed by our [Privacy Policy](/privacy) and [Cookie Policy](/cookies). We are committed to protecting your personal information.

## 10. Governing Law

These Terms are governed by the laws of the United Kingdom. Any disputes will be resolved in UK courts.

## 11. Severability

If any part of these Terms is found invalid, the remaining provisions continue to apply.

## 12. Changes to These Terms

We may update these Terms at any time. Continued use of our website means you accept the changes.

## 13. Contact Information

For questions about these Terms of Service:

📧 **Email:** admin@ether-core.com  
🌐 **Website:** https://ether-core.com  
📱 **Business Hours:** Mon-Fri 9:00-18:00 GMT',
CURRENT_DATE,
'2.0'
);

-- ============================================
-- COOKIE POLICY CONTENT
-- ============================================

INSERT INTO legal_pages (page_type, title, content, last_updated, version) VALUES (
'cookies',
'Cookie Policy',
'## 1. What Are Cookies?

Cookies are small text files stored on your device when you visit our website. They help us provide you with a better browsing experience and analyze how our site is used.

## 2. How We Use Cookies

We use cookies to:

- **Ensure website functionality** and security
- **Remember your preferences** and settings
- **Analyze website traffic** and user behavior
- **Improve performance** and user experience
- **Protect against spam** and malicious activity

## 3. Types of Cookies We Use

**Essential Cookies (Required):**
- Session management and security
- Form submission and error handling
- Basic website functionality
- *These cannot be disabled*

**Analytics Cookies (Optional):**
- Google Analytics for traffic analysis
- User behavior and interaction tracking
- Performance monitoring and optimization
- *You can opt out of these*

**Security Cookies (Required):**
- Google reCAPTCHA for spam protection
- CSRF protection for form security
- Bot detection and prevention
- *These are necessary for security*

**Functional Cookies (Optional):**
- Remember your preferences
- Improve user experience
- Store non-personal settings
- *You can disable these*

## 4. Third-Party Cookies

We use services that may set their own cookies:

**Google Analytics:**
- Tracks website usage and performance
- Provides insights into user behavior
- Helps us improve our services
- [Google Privacy Policy](https://policies.google.com/privacy)

**Google reCAPTCHA:**
- Protects against spam and abuse
- Ensures form security
- Required for contact forms
- [Google Privacy Policy](https://policies.google.com/privacy)

## 5. Managing Your Cookie Preferences

**Browser Settings:**
You can control cookies through your browser settings:

🔹 **Chrome:** Settings > Privacy > Cookies  
🔹 **Firefox:** Settings > Privacy > Cookies  
🔹 **Safari:** Preferences > Privacy > Cookies  
🔹 **Edge:** Settings > Privacy > Cookies

**Cookie Management Links:**
- [Chrome Cookie Settings](https://support.google.com/chrome/answer/95647)
- [Firefox Cookie Settings](https://support.mozilla.org/kb/enhanced-tracking-protection-firefox-desktop)
- [Safari Cookie Settings](https://support.apple.com/guide/safari/sfri11471/mac)
- [Edge Cookie Settings](https://support.microsoft.com/microsoft-edge/view-cookies-in-microsoft-edge-63947406-40ac-c3b3-2775-56bc163015f3)

## 6. Disabling Cookies

**Impact of Disabling Cookies:**
- Some website features may not work properly
- Contact forms may not function
- Security features may be compromised
- Analytics data won''t be collected

**How to Disable:**
1. Access your browser''s privacy settings
2. Find the cookies/tracking section
3. Choose to block all cookies or specific types
4. Clear existing cookies if desired

## 7. Cookie Consent

**Your Choices:**
- **Accept All:** Enable all cookies for full functionality
- **Essential Only:** Use only required cookies
- **Customize:** Choose which types to enable

**Withdrawing Consent:**
You can change your cookie preferences at any time through your browser settings.

## 8. Data Protection

**Cookie Data:**
- Most cookies don''t contain personal information
- Analytics cookies are anonymized
- We don''t sell cookie data to third parties
- Data is processed according to our Privacy Policy

## 9. Updates to This Policy

We may update this Cookie Policy occasionally. Check this page for the latest information.

## 10. Legal Basis

We use cookies based on:
- **Legitimate interests** for analytics and performance
- **Consent** for non-essential cookies
- **Legal requirements** for security cookies

## 11. Contact Us

Questions about our cookie usage?

📧 **Email:** admin@ether-core.com  
🌐 **Website:** https://ether-core.com  
📱 **Phone:** Available during business hours

For technical support with cookies, please include:
- Your browser type and version
- Operating system
- Specific issues you''re experiencing',
CURRENT_DATE,
'2.0'
);

-- ============================================
-- VERIFICATION QUERY
-- ============================================

-- Verify the content was inserted correctly
SELECT 
    page_type,
    title,
    LENGTH(content) as content_length,
    last_updated,
    version,
    is_active
FROM legal_pages 
WHERE page_type IN ('privacy', 'terms', 'cookies')
ORDER BY page_type; 