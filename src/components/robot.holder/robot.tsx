 import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { RobotModel } from './robotModel/robotModel';
import '../../style/robotHolder.css';
import { GridHelper } from 'three';
import type { RobotProps } from '../../types/interfaces';

export default function Robot({ currentAnimation }: RobotProps) {
  return (
    <div className="robot-container">
      <Canvas camera={{ position: [0, 0.5, 2], fov: 70 }}>
        <ambientLight intensity={1}/>
        <directionalLight position={[5,5,5]} intensity={2}/>

        <primitive 
          object={new GridHelper(10, 10, 0x888888, 0x444444)}
          position={[0,-1, -1]}
        />

        <Stage environment={'city'} intensity={0.6} adjustCamera={false}>
          <RobotModel 
            modelPath='/robot/ROBOT.glb'
            scale={1}
            rotationY={150.9}  
            baseY={-1}
            currentAnim={currentAnimation}
          />
        </Stage>

        <OrbitControls enablePan={false}/>
      </Canvas>
    </div>
  );
}
