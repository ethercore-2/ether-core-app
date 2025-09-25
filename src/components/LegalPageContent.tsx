import { LegalPage, parseContent, formatLastUpdated } from '@/lib/legal-utils';

interface LegalPageContentProps {
  legalPage: LegalPage;
}

export default function LegalPageContent({ legalPage }: LegalPageContentProps) {
  // Split content into sections based on markdown headings
  const sections = legalPage.content.split(/(?=^#{1,6}\s)/m).filter(section => section.trim());
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-gray-300">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          📌 {legalPage.title}
        </h1>
        <p className="text-gray-400 mb-2">
          Last updated: {formatLastUpdated(legalPage.last_updated)}
        </p>
        {legalPage.version && (
          <p className="text-gray-500 text-sm">
            Version: {legalPage.version}
          </p>
        )}
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => {
          // Check if section starts with a heading
          const headingMatch = section.match(/^(#{1,6})\s+(.+?)(?:\n|$)/);
          
          if (headingMatch) {
            const [, hashes, headingText] = headingMatch;
            const level = hashes.length;
            const content = section.replace(/^#{1,6}\s+.+?\n/, '').trim();
            
            // Determine heading classes based on level
            const headingClasses = level === 2 ? 'text-2xl font-semibold mt-8 mb-4 text-teal-300' :
                                  level === 3 ? 'text-xl font-semibold mt-6 mb-3 text-white' :
                                  'text-lg font-semibold mt-4 mb-2 text-gray-200';
            
            return (
              <section key={index} className="legal-section">
                {level === 2 && (
                  <h2 className={headingClasses}>
                    {headingText.trim()}
                  </h2>
                )}
                {level === 3 && (
                  <h3 className={headingClasses}>
                    {headingText.trim()}
                  </h3>
                )}
                {level > 3 && (
                  <h4 className={headingClasses}>
                    {headingText.trim()}
                  </h4>
                )}
                {content && (
                  <div 
                    className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: parseContent(content)
                    }}
                  />
                )}
              </section>
            );
          } else {
            // Regular content without heading
            return (
              <div 
                key={index}
                className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: parseContent(section)
                }}
              />
            );
          }
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-12 pt-8 border-t border-gray-700">
        <p className="text-gray-500 text-sm">
          If you have any questions about this {legalPage.title.toLowerCase()}, 
          please contact us at{' '}
          <a 
            href="mailto:admin@ether-core.com" 
            className="text-teal-400 hover:underline"
          >
            admin@ether-core.com
          </a>
          .
        </p>
      </div>
    </div>
  );
} 