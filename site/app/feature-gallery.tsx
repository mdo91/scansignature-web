'use client';

import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const features = [
  {
    title: 'Paper in. PDF out.',
    label: 'SCAN DOCUMENTS',
    description:
      'Scan automatically or capture manually. Adjust corners, correct perspective, and combine multiple pages into one PDF.',
    image: 'scan-document-to-pdf.png',
    alt: 'SignDocs scan editor with adjustable page corners and Scan More and Create PDF buttons.',
  },
  {
    title: 'Your signature, captured.',
    label: 'CAPTURE YOUR SIGNATURE',
    description:
      'Sign a piece of paper and line it up with the camera guide. Capture your handwriting, just as you wrote it.',
    image: 'scan-ink-signature.png',
    alt: 'The dedicated signature camera guide framing a handwritten red-ink signature on paper.',
  },
  {
    title: 'Keep the ink. Lose the paper.',
    label: 'REFINE THE DETAILS',
    description:
      'Crop away the paper and remove its background. Choose Clean, Balanced, or Bold while preserving black, red, or dark blue ink.',
    image: 'select-best-version-of-scanned-signature.png',
    alt: 'Clean and Balanced extraction previews showing a red signature with the paper background removed.',
  },
  {
    title: 'Ready for the next time.',
    label: 'SAVE YOUR SIGNATURES',
    description:
      'Keep signatures on your device and use them again whenever you need. Rename or delete them at any time.',
    image: 'select-saved-signature.png',
    alt: 'Saved Signatures showing reusable handwritten signatures stored on the device.',
  },
  {
    title: 'Place it. Save it. Send it.',
    label: 'SIGN YOUR PDF',
    description:
      'Open a PDF from Files or a fresh scan. Choose a page, then drag and pinch your signature into place. Save a new signed copy.',
    image: 'place-signature.png',
    alt: 'A handwritten signature placed on a PDF with resize handles, a page picker, and a Save File button.',
  },
];

export default function FeatureGallery() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  return (
    <section
      id="features"
      className="features-section"
      aria-labelledby="features-title"
    >
      <div className="wrap section-heading">
        <div>
          <p className="eyebrow">A CLOSER LOOK</p>
          <h2 id="features-title">
            Small steps.
            <br />
            <span>Paperwork, done.</span>
          </h2>
        </div>
        <p>
          From the first scan to the final signature.
          <br className="desktop-break" /> All in one place, on your device.
        </p>
      </div>
      <Carousel
        className="feature-gallery"
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
          breakpoints: { '(prefers-reduced-motion: reduce)': { duration: 0 } },
        }}
        aria-label="Explore five SignDocs features"
        tabIndex={0}
      >
        <div className="gallery-window">
          <CarouselContent className="gallery-track">
            {features.map((feature, index) => (
              <CarouselItem
                key={feature.image}
                className="feature-slide"
                aria-label={`${index + 1} of ${features.length}: ${feature.title}`}
              >
                <article className="feature-card">
                  <div className={`screen-stage stage-${index}`}>
                    <span className="feature-number" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <img
                      src={`${basePath}/mockup/${feature.image}`}
                      width="450"
                      height="920"
                      alt={feature.alt}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                  <div className="feature-copy">
                    <p className="feature-label">{feature.label}</p>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
        <div className="gallery-controls wrap">
          <p className="gallery-hint">A few taps. A little less paperwork.</p>
          <div className="gallery-dots" aria-label="Choose a feature">
            {features.map((feature, index) => (
              <button
                key={feature.image}
                type="button"
                className="gallery-dot"
                aria-label={`Show feature ${index + 1}: ${feature.title}`}
                aria-current={current === index ? 'true' : undefined}
                onClick={() => api?.scrollTo(index)}
              >
                <span />
              </button>
            ))}
          </div>
          <div className="gallery-arrows">
            <CarouselPrevious className="carousel-arrow" />
            <CarouselNext className="carousel-arrow" />
          </div>
        </div>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Feature {current + 1} of {features.length}: {features[current].title}
        </p>
      </Carousel>
      <noscript>
        <style>{`.gallery-window [data-slot="carousel-content"] { overflow-x: auto; } .gallery-controls { display: none; } .gallery-track { scroll-snap-type: x mandatory; } .feature-slide { scroll-snap-align: start; }`}</style>
      </noscript>
    </section>
  );
}
