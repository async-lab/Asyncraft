// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const docusaurus = 'https://www.docusaurus.io/zh-CN/'

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const projectName = 'Asyncraft'
const github = 'https://github.com/Async-Lab'
const githubPagesUrl = 'https://site.asyncraft.club'
const baseUrl = '/'
const repo = 'https://github.com/Async-Lab/Asyncraft'

const math = require('remark-math');
const katex = require('rehype-katex');
const sidebars = require('./sidebars');
const { languages } = require('prismjs');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: projectName,
  tagline: 'Async实验室旗下的Minecraft服务器',
  favicon: 'img/favicon-dark.svg',

  // Set the production url of your site here
  url: githubPagesUrl,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: baseUrl,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: projectName, // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          remarkPlugins: [math],
          rehypePlugins: [[katex, { strict: false }]],
          sidebarPath: require.resolve('./sidebars.js'),
          numberPrefixParser: false,
          // editUrl: repo,
        },
        blog: {
          showReadingTime: true,
          // editUrl: repo,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: projectName,
        logo: {
          alt: 'My Site Logo',
          src: 'img/favicon-dark.svg',
        },
        items: [
          {
            type: 'doc',
            position: 'left',
            label: '介绍',
            docId: '介绍',
          }, {
            type: 'doc',
            position: 'left',
            label: '教程',
            docId: '教程',
          }, {
            type: 'doc',
            position: 'left',
            label: '资源',
            docId: '资源',
          },{
            type: 'doc',
            position: 'left',
            label: '组织',
            docId: '组织',
          },{
            type: 'doc',
            position: 'left',
            label: '活动',
            docId: '活动',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Github',
            items: [
              {
                label: 'Async Lab',
                href: github,
              },
              {
                label: 'Asyncraft',
                href: repo,
              }
            ],
          }, {
            title: 'Social Media',
            items: [
              {
                label: 'Bilibili',
                href: "https://space.bilibili.com/3494375627688733",
              }, {
                label: 'Zhihu',
                href: "https://www.zhihu.com/people/asynclab"
              }
            ]
          }, {
            title: 'Banner',
            items: [
              {
                html: '<img src="https://tietu.mclists.cn/banner/purple/7069/1.jpg" ></img>'
              }, {
                html: '<img src="https://tietu.mclists.cn/banner/pink/7069/2.jpg" ></img>'
              }, {
                html: '<img src="https://tietu.mclists.cn/banner/green/7069/3.jpg" ></img>'
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ${projectName}, Inc. Built with <a href="${docusaurus}">Docusaurus</a>.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        defaultMode: 'dark',
        // disableSwitch: true,
        respectPrefersColorScheme: true,
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 5,
      },

    }),

  markdown: {
    mermaid: true,
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      ({
        hashed: true,
        language: ["en", "zh"],
      }),
    ]

  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  plugins: [

  ],

  scripts: [
    {
      src: '/js/videoIframe.js',
      async: true,
      defer: true
    }, {
      src: '/js/mobileFingerMenu.js',
      async: true,
      defer: true
    },{
      src: '/js/colorChangeIcon.js',
      async: true,
      defer: true
    },{
      src: '/js/sidebarLinkCategoryCollapsible.js',
      async: true,
      defer: true
    },{
      src: '/js/UrlFormatter.js',
      async: true,
      defer: true
    }
  ]
};

module.exports = config;