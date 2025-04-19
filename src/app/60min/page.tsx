'use client'

import React, { useEffect } from 'react';
import Head from 'next/head';

export default function CalendarPage() {
  useEffect(() => {
    // Ensure iframe takes full height
    const updateHeight = () => {
      const iframe = document.getElementById('calendar-iframe') as HTMLIFrameElement;
      if (iframe) {
        iframe.style.height = `${window.innerHeight}px`;
      }
    };

    window.addEventListener('resize', updateHeight);
    updateHeight();

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <>
      <Head>
        <title>Schedule 60 Minutes with Vedaangh</title>
        <meta name="description" content="Book a 60 minute meeting with Vedaangh" />
      </Head>
      <iframe
        id="calendar-iframe"
        src="https://cal.com/vedaangh/ytxis?overlayCalendar=true"
        frameBorder="0"
        className="w-full h-screen"
        allowFullScreen
      />
    </>
  );
} 