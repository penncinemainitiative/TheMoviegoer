import React from "react"

export const getResizedImage = (url, desktopSize, mobileSize) => {
  if (!url.includes("https://s3.amazonaws.com/moviegoer")) {
    return <img src={url}/>;
  }
  const cdnUrl = url.replace("https://s3.amazonaws.com/moviegoer", "http://images.pennmoviegoer.com");
  const images = {};
  const widths = [800, 600, 400, 200];
  const dot = cdnUrl.lastIndexOf('.');
  for (let i = 0; i < widths.length; i++) {
    const width = widths[i];
    images[width] = cdnUrl.substring(0, dot) + `-${width}w.` + cdnUrl.substring(dot + 1);
  }
  const srcSet = `${images[800]} 800w, ${images[600]} 600w, ${images[400]} 400w, ${images[200]} 200w`;
  const sizes = `(max-width: 550px) ${mobileSize}px, ${desktopSize}px`;
  return <img srcSet={srcSet} src={images[desktopSize]} sizes={sizes}/>
};