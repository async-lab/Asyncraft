import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx(styles.heroBanner)}>
      <center>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
        </div>
      </center>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <center>
          <h1>Java版/基岩版互通</h1>
          <div>
            <img className='qq' src="/img/qrcode-dark.png" width="300px" style={{ margin: "0 30px" }}></img>
            {/* <iframe className='kook' src="https://kookapp.cn/widget?id=5570057485746728&theme=dark" width="300" height="374.47" allowtransparency="true" frameborder="0"></iframe> */}
            <a href="https://kook.top/ZpHV6s">
              <img className='qq' src="/img/kook.png" width="300px" style={{ margin: "0 30px" }}>
              </img>
            </a>
          </div>
          <div style={{height:"200px"}}></div>
        </center>
      </main>
    </ Layout>
  );
}
