import React, { JSX, useRef } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import BackgroundImageComponent from '../components/BackgroundImage';
import ParticleFirework from '../components/ParticleFirework';

import styles from './index.module.css';

function HomepageHeader(): JSX.Element {
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

const socialLinks = [
    {
        href: 'https://qm.qq.com/q/yh2Rk8uxH2',
        src: '/img/qrcode-dark.png',
        imgClass: 'qq',
        alt: 'QQ Group QR Code'
    },
    {
        href: 'https://kook.top/ZpHV6s',
        src: '/img/kook.png',
        imgClass: '',
        alt: 'KOOK Server QR Code'
    },
];

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
    const parentRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    return (
        <Layout
            title={`Hello from ${siteConfig.title}`}
            description="Description will go into a meta tag in <head />">

            <div className={styles.pageContent}>
                <HomepageHeader />
                <main>
                    <center>
                        <h1 className="sub__title">Java版/基岩版互通</h1>
                        <div style={{ marginTop: "50px", marginBottom: "200px" }}>
                            {socialLinks.map((link, i) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    ref={el => { parentRefs.current[i] = el }}
                                    className={styles.socialLink}
                                    style={{ position: 'relative', display: "inline-block" }}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <img
                                        className={link.imgClass}
                                        src={link.src}
                                        height="400px"
                                        style={{ margin: "0 30px" }}
                                        alt={link.alt}
                                    />
                                    {/* <ParticleFirework show={hoveredIndex == i} parentRef={{ current: parentRefs.current[i] }} /> */}
                                </a>
                            ))}
                        </div>
                    </center>
                </main>
            </div>
            <BackgroundImageComponent />
        </Layout>
    );
}