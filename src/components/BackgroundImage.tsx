import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const transitionDuration = 2000;
const stayDuration = 10000;
const maxOpacity = 0.15;

const BackgroundImageComponent = () => {
  const [images] = useState(() => {
    const imageContext = require.context('../../static/img/背景', false, /\.(png|jpe?g|svg)$/);
    return imageContext.keys()
      .map(key => key.replace('./', ''))
      .sort(() => Math.random() - 0.5);
  });

  const [imageIndex, setImageIndex] = useState(0);
  const [opacity, setOpacity] = useState(0);

  const handleImgLoad = useCallback(() => {
    setOpacity(maxOpacity);
    const fadeOutTimeout = setTimeout(() => { setOpacity(0); }, stayDuration);
    const changeImageTimeout = setTimeout(() => { setImageIndex(prevIndex => (prevIndex + 1) % images.length); }, stayDuration + transitionDuration);
    return () => {
      clearTimeout(fadeOutTimeout);
      clearTimeout(changeImageTimeout);
    };
  }, []);

  useEffect(() => {
    if (!images || images.length === 0) {
      return;
    }

    setOpacity(0);

    const img = new window.Image();
    const currentImageSrc = `/img/背景/${images[imageIndex]}`;
    img.src = currentImageSrc;

    let cleanup = () => { };

    const onLoad = () => {
      cleanup = handleImgLoad();
    };
    img.addEventListener('load', onLoad);

    if (img.complete) {
      onLoad();
    }

    return () => {
      img.removeEventListener('load', onLoad);
      cleanup();
    };
  }, [imageIndex, images, handleImgLoad]);

  if (images.length === 0) {
    return null;
  }

  return (
    <img
      src={`/img/背景/${images[imageIndex]}`}
      style={{
        position: 'fixed',
        zIndex: -999,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: `blur(1.5px) opacity(${opacity})`,
        transition: `filter ${transitionDuration}ms ease`,
        left: 0,
        top: 0,
      }}
      draggable={false}
      alt=""
    />
  );
};

export default BackgroundImageComponent;