import { HelpCircle } from 'lucide-react';
import ChatAI from './components/chat/Chat.AI';
import Robot from './components/robot.holder/robot';
import { useState } from 'react';

import Player  from 'lottie-react';
import robotAnimation from '../public/assets/robot.json';
import './App.css';

function App() {
  const [robotAnim, setRobotAnim] = useState<'idle' | 'wave' | 'talking' | 'dance'>('idle');
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const handleAnimationComplete = () => {
    setFadeOut(true);
    setTimeout(() => setShowSplash(false), 500);  
  };

  if (showSplash) {
    return (
      <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
        <Player
          autoplay
          loop={false}
          animationData={robotAnimation}
          style={{ height: 300, width: 300 }}
          onComplete={handleAnimationComplete}  
        />
      </div>
    );
  }

  return (
    <div className='app-container'> 

      <div className='chat-container'>
        <ChatAI setRobotAnim={setRobotAnim} />
      </div>

      <div className='main-container'>
        <div className='orbit-wrapper'>
          <Robot currentAnimation={robotAnim} />
        </div>

        <div className='floating-controls'>
          <div className='help-btn-container'>
            <button className='help-btn'>
              <HelpCircle size={28} />
            </button>
            <span className='help-tooltip'>
              If you have more question kindly visit my portfolio at <br />
              icodev.vercel.app
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
