import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useEffect, useState } from 'react';

import styles from './index.module.css';

const transitionDuration = 2000;
const stayDuration = 10000;
const maxOpacity = 0.25

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

const BackgroundImageComponent = () => {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [opacity, setOpacity] = useState(0);

  const imageContext = require.context('../../static/img/背景', false, /\.(png|jpe?g|svg)$/);

  const fetchImages = () => {
    try {
      const images = imageContext.keys();
      const randomImage = images[Math.floor(Math.random() * images.length)];
      if (backgroundImage === `/img/背景/${randomImage}` && images.length > 1) {
        fetchImages();
        return;
      }
      setBackgroundImage(`/img/背景/${randomImage}`);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchImages();
    setOpacity(maxOpacity);

    const interval = setInterval(() => {
      setOpacity(0);

      setTimeout(() => {
        fetchImages();
      }, transitionDuration);
    }, transitionDuration + stayDuration);

    const bg = document.querySelector('#background-image');
    bg.addEventListener('load', () => setOpacity(maxOpacity));

    return () => clearInterval(interval);
  }, []);

  return (
    <img id='background-image' src={`${backgroundImage}`}
      style={{
        position: 'fixed',
        zIndex: -999,
        width: '100%',
        height: '100%',
        filter: `blur(1.5px) opacity(${opacity})`,
        transition: `filter ${transitionDuration}ms ease`,
      }}
    />
  );
};


export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <center>
          <h1 className="sub__title">Java版/基岩版互通</h1>
          <div>
            <img className='qq' src="/img/qrcode-dark.png" width="300px" style={{ margin: "0 30px" }} />
            <a href="https://kook.top/ZpHV6s">
              <img src="/img/kook.png" width="300px" style={{ margin: "0 30px" }} />
            </a>
          </div>
          <div style={{ height: "200px" }}></div>
        </center>
      </main>
      <BackgroundImageComponent />
    </ Layout>
  );
}
