// components/AnnouncementDisplay.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import VITE_DATA from '../config/config.jsx';

const AnnounceDisplay = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncements, setShowAnnouncements] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${VITE_DATA}/announcement/active/view`);
        setAnnouncements(res?.data);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  if (!showAnnouncements || announcements.length === 0) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 3: return 'text-red-800';
      case 2: return 'text-yellow-800';
      default: return 'text-blue-800';
    }
  };

  // Combine all messages with separators
  const combinedMessages = announcements
    .map(ann => ann.message)
    .join(' || '); // Using bullet separator

  // Get highest priority color (for cases with multiple announcements)
  const highestPriority = announcements.length > 0 
    ? Math.max(...announcements.map(ann => ann.priority))
    : 1;

  return (
    <div 
      className={`relative min-w-xl w-full ${getPriorityColor(highestPriority)}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-0.5 max-h-[calc(100vh)]">
        <div className="flex justify-between items-center">
          <div className="flex items-center overflow-hidden w-full">
            <div className="marquee-container whitespace-nowrap">
              <div 
                className={`marquee-content font-semibold ${isHovered ? 'pause-animation' : ''}`}
              >
                {combinedMessages}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAnnouncements(false)}
            className="text-gray-500 hover:text-gray-700 ml-2 shrink-0"
            aria-label="Close announcement"
          >
            &times;
          </button>
        </div>
      </div>

      <style>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        .marquee-content {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 30s linear infinite;
          white-space: nowrap;
        }
        .pause-animation {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default AnnounceDisplay;