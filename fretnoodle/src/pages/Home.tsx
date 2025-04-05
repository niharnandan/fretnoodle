import React, { useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardMedia,
  Divider,
  useTheme,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import BuildIcon from '@mui/icons-material/Build';
import TimelineIcon from '@mui/icons-material/Timeline';
import KeyboardIcon from '@mui/icons-material/Keyboard';

import LOGO_PATH from "../assets/images/logo2.png";

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  delay?: number;
}

// Feature images - update with your actual paths
const VISUALIZER_IMAGE = "/images/inputchordgif.gif";
const MEMORY_GAME_IMAGE = "/images/transitiongif.gif";
const TUNER_IMAGE = "/images/timstuner (1).gif";

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Refs for sections with proper HTML element typing
  const featuresSectionRef = useRef<HTMLDivElement>(null);
  const toolsSectionRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  
  // Refs to track if animations have played
  const featuresAnimPlayed = useRef(false);
  const toolsAnimPlayed = useRef(false);
  const aboutAnimPlayed = useRef(false);

  useEffect(() => {
    // Wait for the DOM to be fully ready
    const setupObservers = () => {
      // Create a single options object for all observers
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
      };

      // Create observers for each section
      if (featuresSectionRef.current) {
        const featuresObserver = new IntersectionObserver((entries) => {
          if (entries[0]?.isIntersecting && !featuresAnimPlayed.current) {
            featuresAnimPlayed.current = true;
            if (featuresSectionRef.current instanceof HTMLElement) {
              featuresSectionRef.current.classList.add('animate-section');
            }
            featuresObserver.disconnect();
          }
        }, observerOptions);
        
        featuresObserver.observe(featuresSectionRef.current);
      }
      
      if (toolsSectionRef.current) {
        const toolsObserver = new IntersectionObserver((entries) => {
          if (entries[0]?.isIntersecting && !toolsAnimPlayed.current) {
            toolsAnimPlayed.current = true;
            if (toolsSectionRef.current instanceof HTMLElement) {
              toolsSectionRef.current.classList.add('animate-section');
            }
            toolsObserver.disconnect();
          }
        }, observerOptions);
        
        toolsObserver.observe(toolsSectionRef.current);
      }
      
      if (aboutSectionRef.current) {
        const aboutObserver = new IntersectionObserver((entries) => {
          if (entries[0]?.isIntersecting && !aboutAnimPlayed.current) {
            aboutAnimPlayed.current = true;
            if (aboutSectionRef.current instanceof HTMLElement) {
              aboutSectionRef.current.classList.add('animate-section');
            }
            aboutObserver.disconnect();
          }
        }, observerOptions);
        
        aboutObserver.observe(aboutSectionRef.current);
      }
      
      // Return cleanup function
      return () => {
        // No need to explicitly disconnect as we're already disconnecting after triggering
      };
    };
    
    // Setup after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(setupObservers, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Feature Card Component - now uses CSS classes for animation
  const FeatureCard = ({ title, description, image, buttonText, buttonLink, delay = 0 }: FeatureCardProps) => (
    <Card 
      className="feature-card"
      style={{ 
        animationDelay: `${delay}ms`,
        opacity: 0, // Start invisible, animation will make it visible
      }}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[10]
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, flexGrow: 1 }}>
          {description}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(buttonLink)}
          sx={{ 
            borderRadius: 8, 
            py: 1.2,
            alignSelf: 'flex-start',
            boxShadow: 3
          }}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );

  // Tool Feature Component - uses CSS classes for animation
  const ToolFeature = ({ 
    icon, 
    title, 
    description, 
    delay = 0 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    delay?: number;
  }) => (
    <Box 
      className="tool-feature"
      style={{ 
        animationDelay: `${delay}ms`,
        opacity: 0, // Start invisible, animation will make it visible
      }}
      sx={{ 
        textAlign: 'center',
        p: 3,
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)',
        borderRadius: 4,
        boxShadow: 2,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)'
        }
      }}
    >
      <Box 
        sx={{ 
          color: theme.palette.primary.main, 
          display: 'flex', 
          justifyContent: 'center',
          mb: 2
        }}
      >
        {icon}
      </Box>
      <Typography 
        variant="h5" 
        component="h3" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          color: theme.palette.mode === 'dark' ? 'white' : 'inherit'
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="body1"
        sx={{ 
          color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'inherit' 
        }}
      >
        {description}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-section .section-title {
          animation: fadeIn 1s ease forwards;
        }
        
        .animate-section .section-subtitle {
          animation: fadeIn 1s ease 0.2s forwards;
        }
        
        .animate-section .feature-card {
          animation: scaleIn 0.8s ease forwards;
        }
        
        .animate-section .tool-feature {
          animation: scaleIn 0.8s ease forwards;
        }
        
        .animate-section .about-content {
          animation: slideUp 0.8s ease forwards;
        }
        
        .animate-section .cta-button {
          animation: fadeIn 1s ease 0.4s forwards;
        }
      `}</style>

      <Box 
        sx={{
          pt: { xs: 12, md: 16 },
          pb: { xs: 10, md: 16 },
          position: 'relative',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(45deg, #1a1a1a 0%, #2d2d2d 100%)' 
            : 'linear-gradient(45deg, #f3f4f6 0%, #e5e7eb 100%)',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.05,
            zIndex: 0,
            backgroundImage: 'url("/images/guitar-pattern.png")',
            backgroundSize: '400px',
            animation: 'moveBackground 60s linear infinite',
            '@keyframes moveBackground': {
              '0%': { backgroundPosition: '0 0' },
              '100%': { backgroundPosition: '400px 400px' }
            }
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box 
            className="hero-content"
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              textAlign: 'center',
              mb: 6,
              animation: 'fadeIn 1.5s ease'
            }}
          >
            <Box 
              component="img" 
              src={LOGO_PATH} 
              alt="FretNoodle Logo" 
              sx={{ 
                width: { xs: 150, md: 220 }, 
                mb: 3,
                animation: 'pulse 3s infinite ease-in-out',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                  '100%': { transform: 'scale(1)' }
                }
              }}
            />
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                fontWeight: 800, 
                fontSize: { xs: '3rem', md: '4.5rem' },
                bgGradient: 'linear(to-r, #3182ce, #805ad5)',
                mb: 2,
                letterSpacing: '-0.02em',
                color: theme.palette.primary.main
              }}
            >
              FretNoodle
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4, 
                maxWidth: '800px',
                fontWeight: 400,
                color: theme.palette.text.secondary
              }}
            >
              Innovative software tools for guitar players. Take your improvisation, composition, 
              and creativity to new heights by exploring new sonic possibilities.
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate('/fretboard')}
              sx={{ 
                borderRadius: 8, 
                py: 1.8, 
                px: 4, 
                fontSize: '1.1rem', 
                fontWeight: 600,
                boxShadow: 4,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              Try Fretboard Visualizer
            </Button>
          </Box>

          <Box 
            sx={{ 
              mt: 4, 
              width: '100%', 
              maxWidth: '1200px', 
              mx: 'auto',
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: 8,
              animation: 'slideUp 0.8s ease 0.5s both'
            }}
          >
            <Box 
              component="img" 
              src="/images/fretboard-demo.jpg" 
              alt="Fretboard Visualizer Demo" 
              sx={{ 
                width: '100%', 
                height: { xs: '200px', md: '400px' },
                objectFit: 'cover'
              }}
            />
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                p: 3
              }}
            >
              <Typography variant="h4" component="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
                Master the Fretboard
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', maxWidth: '700px' }}>
                Visualize notes, chords, and scales across the entire guitar neck
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box 
        ref={featuresSectionRef} 
        sx={{ 
          py: { xs: 8, md: 12 },
          background: theme.palette.background.default
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              className="section-title"
              variant="h2" 
              component="h2"
              style={{ opacity: 0 }}
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                letterSpacing: '-0.01em'
              }}
            >
              Our Tools
            </Typography>
            <Typography 
              className="section-subtitle"
              variant="h6" 
              color="textSecondary"
              style={{ opacity: 0 }}
              sx={{ 
                maxWidth: '700px', 
                mx: 'auto', 
                mb: 2,
                fontWeight: 400
              }}
            >
              FretNoodle provides innovative apps and games to make learning guitar easier, more engaging, and fun
            </Typography>
            <Divider 
              className="section-divider"
              sx={{ width: '80px', mx: 'auto', borderWidth: 2, borderColor: theme.palette.primary.main }} 
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <FeatureCard 
                title="Fretboard Visualizer" 
                description="Map out any inputted note across the guitar fretboard. Visualize triads, arpeggios, or scales all over the neck to open up new sonic possibilities for improvisation and composition."
                image={VISUALIZER_IMAGE}
                buttonText="Try Now"
                buttonLink="/fretboard"
                delay={0}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FeatureCard 
                title="Memorize the Fretboard" 
                description="A simple yet effective game to help you memorize all the intervallic positions and notes across the fretboard. Play regularly to ensure all notes and intervals are burned into your memory."
                image={MEMORY_GAME_IMAGE}
                buttonText="Coming Soon"
                buttonLink="#"
                delay={200}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FeatureCard 
                title="Guitar Tuner" 
                description="A simple yet accurate tuner using machine learning pitch detection. Fine-tune your instrument to standard tuning or experiment with alternative tuning systems."
                image={TUNER_IMAGE}
                buttonText="Try Now"
                buttonLink="/tuner"
                delay={400}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Box 
        ref={toolsSectionRef}
        sx={{ 
          py: { xs: 8, md: 12 },
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(to right, #1a1a2e, #16213e)' 
            : 'linear-gradient(to right, #e3f2fd, #bbdefb)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              className="section-title"
              variant="h2" 
              component="h2"
              style={{ opacity: 0 }}
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                color: theme.palette.mode === 'dark' ? 'white' : 'inherit'
              }}
            >
              Improve Your Playing
            </Typography>
            <Typography 
              className="section-subtitle"
              variant="h6"
              style={{ opacity: 0 }}
              sx={{ 
                maxWidth: '700px', 
                mx: 'auto', 
                mb: 2,
                color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'inherit'
              }}
            >
              Discover how our tools can enhance your guitar journey
            </Typography>
            <Divider sx={{ width: '80px', mx: 'auto', borderWidth: 2, borderColor: theme.palette.primary.main }} />
          </Box>

          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={5} 
            sx={{ justifyContent: 'center' }}
          >
            {[
              {
                icon: <MusicNoteIcon sx={{ fontSize: 50 }} />,
                title: "Master Music Theory",
                description: "Understand intervals, scales, and chord construction through intuitive visualization.",
                delay: 0
              },
              {
                icon: <BuildIcon sx={{ fontSize: 50 }} />,
                title: "Develop Technique",
                description: "Practice with purpose and build muscle memory for scales and chord shapes.",
                delay: 200
              },
              {
                icon: <TimelineIcon sx={{ fontSize: 50 }} />,
                title: "Track Progress",
                description: "See your improvement over time as you master the fretboard and develop your ear.",
                delay: 400
              },
              {
                icon: <KeyboardIcon sx={{ fontSize: 50 }} />,
                title: "Creative Freedom",
                description: "Break out of patterns and discover new ways to express yourself on the guitar.",
                delay: 600
              }
            ].map((item, index) => (
              <ToolFeature 
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                delay={item.delay}
              />
            ))}
          </Stack>
        </Container>
      </Box>

      <Box 
        ref={aboutSectionRef}
        sx={{ 
          py: { xs: 8, md: 12 }, 
          background: theme.palette.background.default
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              className="section-title"
              variant="h2" 
              component="h2"
              style={{ opacity: 0 }}
              sx={{ 
                fontWeight: 700, 
                mb: 2
              }}
            >
              About FretNoodle
            </Typography>
            <Typography 
              className="section-subtitle"
              variant="h6" 
              color="textSecondary" 
              style={{ opacity: 0 }}
              sx={{ mb: 2 }}
            >
              Our mission is to make learning guitar more engaging and accessible
            </Typography>
            <Divider sx={{ width: '80px', mx: 'auto', borderWidth: 2, borderColor: theme.palette.primary.main }} />
          </Box>

          <Box 
            className="about-content"
            style={{ opacity: 0 }}
            sx={{ 
              p: 4, 
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              borderRadius: 4,
              boxShadow: 2
            }}
          >
            <Typography variant="body1" paragraph>
              FretNoodle was created to help guitarists visualize new shapes and highlight chord tones for tasteful improvisation while playing over key changes. Our tools serve as a virtual whiteboard to explore musical concepts and develop a deeper understanding of the instrument.
            </Typography>
            <Typography variant="body1" paragraph>
              We're passionate about creating useful applications for music education and are constantly improving our tools. Whether you're just starting out or are an experienced player looking to break through creative barriers, FretNoodle is designed to enhance your musical journey.
            </Typography>
            <Typography variant="body1">
              Our applications combine music theory with interactive technology to make the learning process more engaging, effective, and enjoyable.
            </Typography>
          </Box>

          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Button 
              className="cta-button"
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate('/fretboard')}
              style={{ opacity: 0 }}
              sx={{ 
                borderRadius: 8, 
                py: 1.5, 
                px: 4,
                fontSize: '1.1rem',
                boxShadow: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              Start Exploring Now
            </Button>
          </Box>
        </Container>
      </Box>

      <Box 
        sx={{ 
          py: { xs: 6, md: 8 }, 
          background: theme.palette.primary.main,
          color: 'white'
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
              Ready to transform your guitar playing?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 400 }}>
              Dive into our interactive tools and take your skills to the next level
            </Typography>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large"
              onClick={() => navigate('/howto')}
              sx={{ 
                borderRadius: 8, 
                py: 1.5, 
                px: 4,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Learn How to Use Our Tools
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;