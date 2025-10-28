import { motion, useTransform, useScroll } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../styles/ThemeProvider';
import { useScrollEffects } from '../hooks/useScrollEffects';
import styles from '../styles/HeroSection.module.css';

function HeroSection() {
  const { theme } = useTheme();
  const { scrollY } = useScrollEffects();
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();

  // Parallax transforms for different layers
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const glowY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.section 
      className={styles.heroSection}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className={styles.heroContent}
        style={{ y: contentY }}
      >
        <motion.h1 
          className={styles.heroTitle}
          variants={textVariants}
        >
          Discover Premium
          <span className={styles.neonText}> Beauty</span>
        </motion.h1>
        
        <motion.p 
          className={styles.heroSubtitle}
          variants={textVariants}
        >
          Elevate your skincare routine with our curated collection of premium products
        </motion.p>
        
        <motion.div 
          className={styles.heroButtons}
          variants={textVariants}
        >
          <motion.button
            className={`${styles.ctaButton} ${styles.primary}`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => {
              const productsSection = document.getElementById('products-section');
              if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Shop Now
          </motion.button>
          
          <motion.button
            className={`${styles.ctaButton} ${styles.secondary}`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => {
              const productsSection = document.getElementById('products-section');
              if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Explore Collection
          </motion.button>
        </motion.div>
      </motion.div>
      
      <div className={styles.heroBackground}>
        <motion.div 
          className={styles.gradientOverlay}
          style={{ y: backgroundY }}
        ></motion.div>
        <motion.div 
          className={styles.neonGlow}
          style={{ y: glowY }}
        ></motion.div>
        <div className={styles.parallaxLayer1}></div>
        <div className={styles.parallaxLayer2}></div>
        <div className={styles.parallaxLayer3}></div>
      </div>
    </motion.section>
  );
}

export default HeroSection;