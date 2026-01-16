import { useGLTF, useAnimations } from '@react-three/drei';
import { useRef, useEffect, type FC } from 'react';
import * as THREE from 'three';
import type { RobotModelProps } from '../../../types/interfaces';

export const RobotModel: FC<RobotModelProps> = ({
  modelPath,
  scale = 1,
  rotationY = 0,
  baseY = 0,
  currentAnim = 'idle'
}) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelPath) as any;
  const { actions, names } = useAnimations(animations, group);

  // Apply rotation and scale
  scene.rotation.y = rotationY;
  scene.scale.set(scale, scale, scale);

  // Auto-center the model on the group
  useEffect(() => {
    if (!group.current) return;

    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);

    group.current.position.set(
      -center.x,
      baseY - box.min.y,
      -center.z
    );
  }, [scene, baseY]);

  useEffect(() => {
    if (!names || names.length === 0) return;

    if (!actions[currentAnim]) {
      console.warn(`Animation: "${currentAnim}" not found!`);
      return;
    }

    Object.keys(actions).forEach((key)=>{
      if (key !== currentAnim) {
        actions[key]?.fadeOut(0.2);
      }
    });

    const action = actions[currentAnim];
    action.reset()
    action.clampWhenFinished = true;

    if (currentAnim === 'idle' || currentAnim === 'talking') {
      action.setLoop(THREE.LoopRepeat, Infinity);
    } else if (currentAnim === 'dance') {
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.clampWhenFinished = false;
    } else {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    }

    action.fadeIn(0.2).play()
    
  }, [currentAnim, actions, names]);

  return <group ref={group}><primitive object={scene} /></group>;
};
