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
import { copy, type Locale } from '@/lib/locales';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const imageNames = ['scan-document-to-pdf.png', 'scan-ink-signature.png', 'select-best-version-of-scanned-signature.png', 'select-saved-signature.png', 'place-signature.png'];

export default function FeatureGallery({ locale = 'en' }: { locale?: Locale }) {
  const t = copy[locale];
  const features = t.features.map(([title, label, description, alt], index) => ({
    title, label, description, alt, image: imageNames[index],
  }));
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
          <p className="eyebrow">{t.galleryLabel}</p>
          <h2 id="features-title">
            {t.closerTitle}
            <br />
            <span>{t.closerTitleB}</span>
          </h2>
        </div>
        <p>
          {t.closerCopyA}
          <br className="desktop-break" /> {t.closerCopyB}
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
        aria-label={t.carouselLabel}
        tabIndex={0}
      >
        <div className="gallery-window">
          <CarouselContent className="gallery-track">
            {features.map((feature, index) => (
              <CarouselItem
                key={feature.image}
                className="feature-slide"
                aria-label={`${index + 1}: ${feature.title}`}
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
          <p className="gallery-hint">{t.galleryHint}</p>
          <div className="gallery-dots" aria-label={t.chooseFeature}>
            {features.map((feature, index) => (
              <button
                key={feature.image}
                type="button"
                className="gallery-dot"
                aria-label={`${t.showFeature} ${index + 1}: ${feature.title}`}
                aria-current={current === index ? 'true' : undefined}
                onClick={() => api?.scrollTo(index)}
              >
                <span />
              </button>
            ))}
          </div>
          <div className="gallery-arrows">
            <CarouselPrevious className="carousel-arrow" label={t.previousSlide} aria-label={t.previousSlide} />
            <CarouselNext className="carousel-arrow" label={t.nextSlide} aria-label={t.nextSlide} />
          </div>
        </div>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {t.featureLive} {current + 1} / {features.length}: {features[current].title}
        </p>
      </Carousel>
      <noscript>
        <style>{`.gallery-window [data-slot="carousel-content"] { overflow-x: auto; } .gallery-controls { display: none; } .gallery-track { scroll-snap-type: x mandatory; } .feature-slide { scroll-snap-align: start; }`}</style>
      </noscript>
    </section>
  );
}
