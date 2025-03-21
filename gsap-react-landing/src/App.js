import React, { useEffect, useRef } from 'react';
import { GlobalStyles } from './styles/GlobalStyles';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Services from './components/sections/Services';
import Works from './components/sections/Works';
import Contact from './components/sections/Contact';
import CustomCursor from './components/animations/CustomCursor';
import Preloader from './components/animations/Preloader';
import SideMenu from './components/SideMenu';
import TextParallax from './components/animations/TextParallax';
import './App.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const AppContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const MainContent = styled.main`
  position: relative;
  background-color: #0f0f0f;
  color: #ffffff;
`;

const SectionOverlay = styled.div`
  position: relative;
  background: linear-gradient(to bottom, rgba(15, 15, 15, 0.7), #0f0f0f);
  z-index: 4;
`;

function App() {
  const appRef = useRef(null);
  const mainRef = useRef(null);
  const cursorRef = useRef(null);
  const preloaderRef = useRef(null);

  useEffect(() => {
    // Initialize GSAP smooth scrolling
    const ctx = gsap.context(() => {
      // Preloader Animation
      const preloader = preloaderRef.current;
      if (preloader) {
        const tl = gsap.timeline();
        
        tl.to(preloader.querySelector('.loader-wrapper'), {
          duration: 2,
          width: '100%',
          ease: 'power3.inOut'
        })
        .to(preloader.querySelectorAll('.loader-content span'), {
          y: 0,
          stagger: 0.2,
          duration: 1,
          ease: 'power3.out',
          opacity: 1
        }, '-=1.5')
        .to(preloader, {
          y: '-100%',
          duration: 1.5,
          ease: 'power4.inOut',
          delay: 0.5
        })
        .from(mainRef.current.querySelectorAll('.fade-in'), {
          opacity: 0,
          y: 50,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out'
        }, '-=1');
      }

      // Initialize Scroll Triggers
      ScrollTrigger.batch('.reveal', {
        onEnter: elements => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 1,
            ease: 'power3.out'
          });
        },
        once: true
      });

      // Parallax effects
      gsap.utils.toArray('.parallax').forEach(section => {
        const depth = section.dataset.depth || 0.2;
        
        gsap.to(section, {
          y: -100 * depth + '%',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });

      // Set up custom cursor
      const cursor = cursorRef.current;
      if (cursor) {
        document.addEventListener('mousemove', (e) => {
          gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.5,
            ease: 'power2.out'
          });
        });

        // Add hover effect to all interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .interactive');
        
        interactiveElements.forEach(el => {
          el.addEventListener('mouseenter', () => {
            gsap.to(cursor, {
              scale: 1.5,
              opacity: 0.8,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              duration: 0.3,
              ease: 'power2.out'
            });
          });
          
          el.addEventListener('mouseleave', () => {
            gsap.to(cursor, {
              scale: 1,
              opacity: 1,
              backgroundColor: 'rgba(255, 255, 255, 1)',
              duration: 0.3,
              ease: 'power2.out'
            });
          });
        });
      }
    }, appRef);

    return () => ctx.revert(); // Cleanup animations on unmount
  }, []);

  return (
    <AppContainer ref={appRef}>
      <GlobalStyles />
      <CustomCursor ref={cursorRef} />
      <Preloader ref={preloaderRef} />
      <SideMenu />
      <MainContent ref={mainRef}>
        <Hero />
        <TextParallax phrases={['Team', 'Sync', 'Growth']} />
        <SectionOverlay>
          <About />
        </SectionOverlay>
        <TextParallax phrases={['Productivity', 'Efficiency', 'Success']} />
        <SectionOverlay>
          <Services />
        </SectionOverlay>
        <TextParallax phrases={['Solutions', 'Platform', 'Vision']} />
        <SectionOverlay>
          <Works />
        </SectionOverlay>
        <TextParallax phrases={['Connect', 'Progress', 'Achieve']} />
        <SectionOverlay>
          <Contact />
        </SectionOverlay>
      </MainContent>
    </AppContainer>
  );
}

export default App;
