// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const docusaurus = 'https://www.docusaurus.io/zh-CN/'

import { themes as prismThemes } from 'prism-react-renderer';

const projectName = 'Asyncraft'
const github = 'https://github.com/Async-Lab'
const githubPagesUrl = 'https://site.asyncraft.club'
const cuitUrl = 'https://www.cuit.edu.cn'
const baseUrl = '/'
const repo = 'https://github.com/Async-Lab/Asyncraft'
const officialSite = 'https://www.asynclab.club'

const math = require('remark-math');
const katex = require('rehype-katex');
const sidebars = require('./sidebars');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: projectName,
  tagline: '成信大异步实验室旗下的Minecraft社区',
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
      // image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: projectName,
        logo: {
          alt: 'My Site Logo',
          src: 'img/favicon-light.svg',
          srcDark: 'img/favicon-dark.svg',
        },
        items: [
          {
            type: 'doc',
            position: 'left',
            label: '服务器列表',
            docId: '服务器列表',
          }, {
            type: 'doc',
            position: 'left',
            label: '介绍',
            docId: '介绍',
          }, {
            type: 'docSidebar',
            position: 'left',
            label: '教程',
            sidebarId: 'tutorialSidebar',
          }, {
            type: 'doc',
            position: 'left',
            label: '资源',
            docId: '资源',
          }, {
            type: 'doc',
            position: 'left',
            label: '地图',
            docId: '地图',
          }, {
            type: 'doc',
            position: 'left',
            label: '状态',
            docId: '状态',
          }, {
            type: 'dropdown',
            label: '其他',
            position: 'left',
            items: [
              {
                type: 'doc',
                label: '组织',
                docId: '组织',
              }, {
                type: 'doc',
                label: '活动',
                docId: '活动',
              }, {
                type: 'doc',
                label: '留言板',
                docId: '留言板',
              }
            ]
          }
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '链接',
            items: [
              {
                label: '异步实验室',
                href: officialSite,
              },
              {
                label: 'Github仓库',
                href: repo,
              },
              {
                label: '成都信息工程大学',
                href: cuitUrl,
              },
            ],
          }, {
            title: '社交媒体',
            items: [
              {
                label: 'Bilibili',
                href: "https://space.bilibili.com/3494375627688733",
              }, {
                label: '知乎',
                href: "https://www.zhihu.com/people/asynclab"
              }
            ]
          }, {
            title: '横幅',
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
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['haskell', 'java'],
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
      src: '/js/VideoIframe.js',
      defer: true
    }, {
      src: '/js/ThemeStrategy.js',
      defer: true
    }, {
      src: '/js/UrlFormatter.js',
      defer: true
    }
    , {
      src: '/js/main.js',
      defer: true
    }
  ]
};

module.exports = config;