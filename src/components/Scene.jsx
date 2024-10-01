'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll } from '@react-three/drei';
import { Model } from './Model';
import { useRef } from 'react';

const NUM_MODELS = 5; // Number of model instances
const MODEL_LENGTH = 30; // Adjust this to match the length of your model
const TOTAL_LENGTH = NUM_MODELS * MODEL_LENGTH;

// Speed constants
const SCROLL_SPEED_MULTIPLIER = 0.15; // Adjust this for a faster scroll effect
const ANIMATION_SPEED_MULTIPLIER = 0.5; // Keep it at 0.5 for smoother animations

function InfiniteScroll() {
  const modelRefs = useRef([]);
  const scroll = useScroll();

  useFrame(() => {
    // Calculate the scroll offset for forward movement
    const scrollOffset = scroll.offset * TOTAL_LENGTH * SCROLL_SPEED_MULTIPLIER;

    modelRefs.current.forEach((modelRef, index) => {
      if (modelRef) {
        // Update the position of the models with forward movement
        modelRef.position.z = (index * MODEL_LENGTH + scrollOffset) % TOTAL_LENGTH;

        // Reposition the model if it goes out of view to make it seamless
        if (modelRef.position.z < -MODEL_LENGTH) {
          modelRef.position.z += TOTAL_LENGTH;
        } else if (modelRef.position.z > MODEL_LENGTH) {
          modelRef.position.z -= TOTAL_LENGTH;
        }
      }
    });

    // Reset scroll position when the scroll reaches the bottom
    if (scroll.offset >= 1) {
      window.scrollTo(0, 0); // Reset scroll position to the top
    }
  });

  return (
    <>
      {Array.from({ length: NUM_MODELS }).map((_, index) => (
        <group
          key={index}
          ref={el => (modelRefs.current[index] = el)}
          position={[0, 0, index * MODEL_LENGTH]}
        >
          <Model />
        </group>
      ))}
    </>
  );
}

export default function Index() {
  return (
    <Canvas
      style={{ background: '#000000', width: '100%', height: '100%' }}
      camera={{ position: [0, 2, 10], fov: 75 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight intensity={2} position={[0, 2, 3]} />
      <ScrollControls pages={3} infinite> {/* Adjust the number of pages based on the total length */}
        <InfiniteScroll /> {/* Render the infinite scrolling models */}
      </ScrollControls>
    </Canvas>
  );
}
