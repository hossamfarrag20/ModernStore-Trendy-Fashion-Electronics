import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const useGSAP = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Animate on mount
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }
    );

    return () => {
      // Cleanup
      gsap.killTweensOf(element);
    };
  }, []);

  return ref;
};

export const useStaggerAnimation = (selector: string, delay: number = 0.1) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    
    gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: 50,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: delay,
      }
    );

    return () => {
      gsap.killTweensOf(elements);
    };
  }, [selector, delay]);

  return containerRef;
};

export const useScrollAnimation = (trigger: string, animation: gsap.TweenVars) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    gsap.fromTo(
      element,
      animation.from || { opacity: 0, y: 50 },
      {
        ...animation.to,
        scrollTrigger: {
          trigger: trigger || element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      gsap.killTweensOf(element);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [trigger, animation]);

  return ref;
};

export const animatePageTransition = () => {
  const tl = gsap.timeline();
  
  tl.to('.page-transition', {
    opacity: 0,
    duration: 0.3,
    ease: 'power2.inOut',
  })
  .fromTo('.page-content', 
    { opacity: 0, y: 20 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.5, 
      ease: 'power2.out' 
    }
  );

  return tl;
};
