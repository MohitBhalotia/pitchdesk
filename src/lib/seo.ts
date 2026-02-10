import type { Metadata } from 'next';

interface SEOMetadataProps {
    title: string;
    description: string;
    canonical: string;
    ogImage?: string;
    keywords?: string[];
    type?: 'website' | 'article';
}

export function generateSEOMetadata({
    title,
    description,
    canonical,
    ogImage = '/og-image.png',
    keywords = [],
    type = 'website',
}: SEOMetadataProps): Metadata {
    const fullTitle = `${title} | PitchDesk`;
    const url = `https://pitchdesk.com${canonical}`;

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: url,
        },
        openGraph: {
            type,
            url,
            title: fullTitle,
            description,
            siteName: 'PitchDesk',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [ogImage],
            creator: '@pitchdesk',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

// JSON-LD structured data generators
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PitchDesk',
        url: 'https://pitchdesk.com',
        logo: 'https://pitchdesk.com/logo.png',
        description: 'AI-powered pitch practice platform for startup founders and VCs',
        sameAs: [
            'https://twitter.com/pitchdesk',
            'https://linkedin.com/company/pitchdesk',
            'https://github.com/pitchdesk',
        ],
    };
}

export function generateSoftwareApplicationSchema(feature: {
    name: string;
    description: string;
    url: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: feature.name,
        description: feature.description,
        url: feature.url,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
    };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `https://pitchdesk.com${item.url}`,
        })),
    };
}
