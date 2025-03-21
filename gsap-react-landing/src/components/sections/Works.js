import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTextSplit } from '../../hooks/useTextSplit';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const WorksSection = styled.section`
  padding: 120px 0;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 80px 0;
  }
`;

const WorksContainer = styled.div`
  width: 90%;
  max-width: var(--max-width);
  margin: 0 auto;
  position: relative;
`;

const SectionHeader = styled.div`
  margin-bottom: 80px;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2.5rem, 4vw, 4rem);
  margin-bottom: 20px;
  overflow: hidden;
`;

const SectionSubtitle = styled.div`
  color: var(--text-secondary);
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  max-width: 600px;
  opacity: 0;
  transform: translateY(30px);
`;

const Categories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 40px;
`;

const CategoryButton = styled.button`
  background-color: ${props => props.active ? 'var(--primary)' : 'rgba(30, 30, 30, 0.5)'};
  color: ${props => props.active ? 'var(--dark)' : 'var(--text-secondary)'};
  padding: 8px 20px;
  border-radius: 30px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary)' : 'rgba(50, 50, 50, 0.5)'};
    transform: translateY(-2px);
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  height: 0;
  padding-bottom: 70%;
  cursor: none;
  opacity: 0;
  transform: translateY(50px);
  
  &:hover .project-overlay {
    opacity: 1;
  }
  
  &:hover .project-image {
    transform: scale(1.1);
  }
  
  &:hover .project-title {
    transform: translateY(0);
    opacity: 1;
  }
  
  &:hover .project-category {
    transform: translateY(0);
    opacity: 0.7;
  }
  
  &:nth-child(even) {
    margin-top: 50px;
    
    @media (max-width: 768px) {
      margin-top: 0;
    }
  }
`;

const ProjectImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
`;

const ProjectOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.1));
  opacity: 0;
  transition: opacity 0.5s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 30px;
`;

const ProjectTitle = styled.h3`
  color: var(--light);
  font-size: clamp(1.2rem, 2vw, 1.8rem);
  margin-bottom: 8px;
  transform: translateY(20px);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1),
              opacity 0.5s ease;
`;

const ProjectCategory = styled.span`
  color: var(--text-secondary);
  font-size: 0.9rem;
  transform: translateY(20px);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) 0.1s,
              opacity 0.5s ease 0.1s;
`;

// Sample projects data
const projectsData = [
  {
    id: 1,
    title: 'Enterprise Team Integration',
    category: 'Case Study',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 2,
    title: 'Remote Team Coordination',
    category: 'Case Study',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 3,
    title: 'Agency Workflow Optimization',
    category: 'Success Story',
    image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 4,
    title: 'Healthcare Team Coordination',
    category: 'Case Study',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 5,
    title: 'Educational Institution Implementation',
    category: 'Success Story',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 6,
    title: 'Startup Scaling Solution',
    category: 'Success Story',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80'
  }
];

const Works = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState(projectsData);
  
  const titleRef = useTextSplit({ type: 'chars', staggerValue: 0.02 });
  const subtitleRef = useRef(null);
  const projectsRef = useRef(null);
  
  const categories = ['All', 'Case Study', 'Success Story'];
  
  useEffect(() => {
    // Filter projects based on active category
    if (activeCategory === 'All') {
      setFilteredProjects(projectsData);
    } else {
      setFilteredProjects(projectsData.filter(project => project.category === activeCategory));
    }
  }, [activeCategory]);
  
  useEffect(() => {
    // Animation for subtitle
    if (subtitleRef.current) {
      gsap.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: subtitleRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }
    
    // Animation for projects
    const animateProjects = () => {
      if (projectsRef.current) {
        const projects = projectsRef.current.querySelectorAll('.project-card');
        
        gsap.to(projects, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: projectsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });
      }
    };
    
    // Run animation with a small delay to allow for DOM updates
    const animationTimeout = setTimeout(animateProjects, 100);
    
    return () => clearTimeout(animationTimeout);
  }, [filteredProjects]);
  
  return (
    <WorksSection id="works">
      <WorksContainer>
        <SectionHeader>
          <SectionTitle ref={titleRef}>
            Success Stories & Case Studies
          </SectionTitle>
          
          <SectionSubtitle ref={subtitleRef}>
            See how Team-Sync has transformed team collaboration and boosted productivity for organizations across industries.
          </SectionSubtitle>
        </SectionHeader>
        
        <Categories>
          {categories.map((category, index) => (
            <CategoryButton
              key={index}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </CategoryButton>
          ))}
        </Categories>
        
        <ProjectsGrid ref={projectsRef}>
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} className="project-card">
              <ProjectImage 
                className="project-image"
                style={{ backgroundImage: `url(${project.image})` }}
              />
              <ProjectOverlay className="project-overlay">
                <ProjectTitle className="project-title">{project.title}</ProjectTitle>
                <ProjectCategory className="project-category">{project.category}</ProjectCategory>
              </ProjectOverlay>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </WorksContainer>
    </WorksSection>
  );
};

export default Works; 