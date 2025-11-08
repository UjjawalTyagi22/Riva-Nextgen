import React, { useState, useRef, useEffect } from 'react';
import FaceCard from './FaceCard';
import './Showcase.css';


const Showcase = ({ teachers, onMoveToRiva }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const resumePositions = useRef({});
  const introVideoRef = useRef(null);
  const backgroundVideoRef = useRef(null);
  const welcomeAudioRef = useRef(null);


  // Play intro video WITH welcome audio (with delay) - ONLY ONCE on mount
  useEffect(() => {
    if (introVideoRef.current && welcomeAudioRef.current) {
      introVideoRef.current.play();
      console.log('✓ Intro video playing');


      // DELAY AUDIO START - Change this number to control delay (in milliseconds)
      const audioDelay = 10000; // 7 seconds delay - ADJUST THIS VALUE


      const delayTimer = setTimeout(() => {
        welcomeAudioRef.current.currentTime = 0;
        welcomeAudioRef.current.play().catch(err => {
          console.error('Audio play failed:', err);
        });
        console.log(`✓ Welcome audio playing after ${audioDelay}ms delay`);
      }, audioDelay);


      return () => clearTimeout(delayTimer);
    }
  }, []);


  // When intro video ends, show FaceCards and auto-start first card after 4 seconds
  const handleIntroEnded = () => {
    console.log('✓ Intro video ended');
    setShowIntro(false);
    setShowContent(true);
    
    // START background video when content (FaceCards) shows
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.currentTime = 0;
      backgroundVideoRef.current.play();
      console.log('✓ Background video playing behind FaceCards from 0 seconds');
    }

    // AUTO-START first FaceCard after 4 seconds delay
    setTimeout(() => {
      setActiveIndex(0);
      setIsPlaying(true);
      setIsSpeaking(true);
      setIsPaused(false);
      setIsComplete(false);
      resumePositions.current = {};
      console.log('✓ First FaceCard auto-started after 4 second delay');
    }, 4000); // 4 second delay
  };


  // Start background video when showContent becomes true
  useEffect(() => {
    if (showContent && backgroundVideoRef.current) {
      backgroundVideoRef.current.currentTime = 0;
      backgroundVideoRef.current.play();
      console.log('✓ Background video playing behind FaceCards from 0 seconds');
    }
  }, [showContent]);


  // AUTO-MOVE TO RIVA after 4 seconds when showcase completes
  useEffect(() => {
    if (isComplete) {
      console.log('✓ Showcase complete - moving to Riva Chatbot after 4 second delay');
      const moveTimer = setTimeout(() => {
        handleMoveToRiva();
      }, 4000); // 4 second delay

      return () => clearTimeout(moveTimer);
    }
  }, [isComplete]);


  const handleStart = () => {
    setIsPlaying(true);
    setIsSpeaking(true);
    setIsPaused(false);
    setIsComplete(false);
    resumePositions.current = {};
  };


  const handlePlayPause = () => {
    if (!isPlaying) {
      handleStart();
      return;
    }


    if (isPaused) {
      setIsPaused(false);
      setIsSpeaking(true);
      console.log('✓ Resumed from pause');
    } else if (isSpeaking) {
      setIsPaused(true);
      setIsSpeaking(false);
      console.log('✓ Paused');
    } else {
      resumePositions.current[activeIndex] = 0;
      setIsSpeaking(true);
      setIsPaused(false);
      const current = activeIndex;
      setActiveIndex(null);
      setTimeout(() => setActiveIndex(current), 50);
    }
  };


  const handleNext = () => {
    window.speechSynthesis.cancel();
    const nextIndex = activeIndex + 1;


    if (nextIndex < teachers.length) {
      setActiveIndex(nextIndex);
      setIsSpeaking(isPlaying);
      setIsPaused(false);
      resumePositions.current[nextIndex] = 0;
    } else {
      setActiveIndex(0);
      setIsPlaying(false);
      setIsSpeaking(false);
      setIsComplete(true);
    }
  };


  // Handle move to Riva Chatbot - UPDATED TO CALL PARENT PROP
  const handleMoveToRiva = () => {
    console.log('✓ Moving to Riva Chatbot...');
    window.speechSynthesis.cancel();
    
    // Call the parent callback function
    if (onMoveToRiva) {
      onMoveToRiva();
    }
  };


  const handleSpeechStart = () => {
    setIsSpeaking(true);
    if (isPaused) setIsPaused(false);
  };


  const handleSpeechEnd = (position) => {
    if (isPaused) {
      resumePositions.current[activeIndex] = position;
    } else {
      resumePositions.current[activeIndex] = 0;
    }
  };


  const handleCardEnded = () => {
    if (isPaused || !isPlaying) {
      return;
    }


    setIsSpeaking(false);
    const nextIndex = activeIndex + 1;


    if (nextIndex < teachers.length) {
      setTimeout(() => {
        setActiveIndex(nextIndex);
        setIsSpeaking(true);
      }, 1000);
    } else {
      setActiveIndex(0);
      setIsPlaying(false);
      setIsSpeaking(false);
      setIsComplete(true);
    }
  };


  return (
    <div className="showcase-container">
      {/* Background video - only plays behind FaceCards */}
      {showContent && (
        <video 
          ref={backgroundVideoRef}
          className="background-video"
          style={{ display: showContent ? 'block' : 'none' }}
          src="/background_3.mp4"
          loop
          muted
          playsInline
        />
      )}


      {/* Intro video - plays first WITH welcome audio (NO FADE ANIMATION) */}
      {showIntro && (
        <video 
          ref={introVideoRef}
          className="background-video intro-overlay-no-fade"
          src="/intro.mp4"
          muted={false}
          playsInline
          onEnded={handleIntroEnded}
        />
      )}


      {/* Welcome audio - plays WITH intro video from start with delay */}
      <audio 
        ref={welcomeAudioRef}
        src="/welcome-audio.mp3"
        preload="auto"
        controls={false}
      />


      {/* Content - Facecard WITH background video */}
      {showContent && (
        <>
          {/* Face Cards Stage */}
          <div className="card-stage">
            {teachers.map((teacher, index) => (
              <FaceCard
                key={index}
                teacher={teacher}
                teacherIndex={index}
                isActive={activeIndex === index && isPlaying && !isPaused}
                isPaused={isPaused && activeIndex === index}
                isVisible={activeIndex === index}
                resumePosition={resumePositions.current[index] || 0}
                onEnded={handleCardEnded}
                onSpeechStart={handleSpeechStart}
                onSpeechEnd={handleSpeechEnd}
              />
            ))}
          </div>


          {/* Controls */}
          <button 
            className="control-icon left-control" 
            onClick={handlePlayPause}
            title={isSpeaking && !isPaused ? 'Pause' : 'Play'}
          >
            {isSpeaking && !isPaused ? <PauseIcon /> : <PlayIcon />}
          </button>


          <button 
            className="control-icon right-control" 
            onClick={handleNext}
            title="Next"
          >
            <NextIcon />
          </button>


          {isComplete && (
            <button 
              className="control-icon center-control move-to-riva-btn" 
              onClick={handleMoveToRiva} 
              title="Move to Riva"
            >
              <RivaIcon />
            </button>
          )}
        </>
      )}
    </div>
  );
};


const PlayIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);


const PauseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
  </svg>
);


const NextIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 4l12 8-12 8V4zm13 0v16h2V4h-2z"/>
  </svg>
);


const RivaIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9"/>
    <path d="M9 12h6M12 9v6M16 12h2M12 8V6"/>
  </svg>
);


export default Showcase;
