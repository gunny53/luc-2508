
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://ecsite.live',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,

  
  exclude: [
    '/admin/*',
    '/sign-in',
    '/sign-up',
    '/verify-code',
    '/reset-password',
    '/verify-2fa',
    '/verify-email',
    '/oauth-google-callback',
    '/user/*',
    '/cart',
    '/checkout/*',
    '/api/*',
    '/_next/*',
    '/404',
    '/500'
  ],

  
  transform: async (config, path) => {
    
    let priority = 0.7
    let changefreq = 'daily'

    
    if (path === '/') {
      priority = 1.0
      changefreq = 'daily'
    }
    
    else if (path.includes('-cat.')) {
      priority = 0.9
      changefreq = 'daily'
    }
    
    else if (path.startsWith('/products/')) {
      priority = 0.8
      changefreq = 'weekly'
    }
    
    else if (path.startsWith('/shop/')) {
      priority = 0.7
      changefreq = 'weekly'
    }
    
    else if (path === '/policy') {
      priority = 0.5
      changefreq = 'monthly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString()
    }
  },

  
  additionalPaths: async (config) => {
    const result = []

    
    const commonCategories = [
      'thoi-trang-nam-cat.1',
      'thoi-trang-nu-cat.2',
      'giay-dep-cat.3',
      'dien-thoai-cat.4',
      'laptop-cat.5',
      'nha-cua-cat.6',
      'me-be-cat.7',
      'lam-dep-cat.8',
      'the-thao-cat.9',
      'o-to-xe-may-cat.10'
    ]

    for (const category of commonCategories) {
      result.push({
        loc: `/${category}`,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString()
      })
    }

    return result
  },

  // Robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/user/',
          '/cart',
          '/checkout/',
          '/api/',
          '/_next/',
          '/sign-in',
          '/sign-up',
          '/verify-*',
          '/oauth-*'
        ]
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/user/', '/cart', '/checkout/', '/api/']
      }
    ],
    additionalSitemaps: ['https://ecsite.live/sitemap.xml']
  }
}
