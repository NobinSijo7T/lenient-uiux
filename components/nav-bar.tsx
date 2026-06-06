"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './nav-bar.module.css';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navBar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navLinks}>
        <Link href="/" className={styles.navLink}>
          HOME
        </Link>
        <Link href="/about" className={styles.navLink}>
          ABOUT
        </Link>
        <Link href="/projects" className={styles.navLink}>
          PROJECTS
        </Link>
        <Link href="/contact" className={styles.navLink}>
          CONTACT
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
