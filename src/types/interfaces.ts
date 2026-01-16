// interfaces
export interface ChatAIProps {
  setRobotAnim: (anim: 'idle' | 'wave' | 'talking' | 'dance') => void;
}

export interface AiTypeResponse {
    reply: string;
    source?: 'Eorix' | 'openSourceAi' | 'none';
    intent?: string;
}

export interface RobotProps {
  currentAnimation: 'idle' | 'wave' | 'talking' | 'dance';
}

export interface RobotModelProps { 
  modelPath: string; 
  scale?: number; 
  rotationY?: number; 
  baseY?: number;
  currentAnim?: 'idle' | 'wave' | 'talking' | 'dance'
}