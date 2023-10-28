import React, { useEffect, useState } from 'react';
import { SvgIconProps } from '@mui/material';

interface MovingIconProps {
  IconComponent: React.ComponentType<SvgIconProps>;
  startPosition?: { x: number, y: number };
}

const MovingIcon: React.FC<MovingIconProps> = ({ IconComponent, startPosition }) => {
  const [position, setPosition] = useState<{ x: number, y: number }>(startPosition || { x: 50, y: 50 });
  const [direction, setDirection] = useState<{ x: number, y: number }>({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
  });

  useEffect(() => {
    const moveIcon = () => {
      setPosition((prevPosition) => {
        let newX = prevPosition.x + direction.x;
        let newY = prevPosition.y + direction.y;

        if (newX <= 0 || newX >= window.innerWidth - 50) {
          setDirection((prevDirection) => ({ ...prevDirection, x: -prevDirection.x }));
          newX = prevPosition.x + direction.x;
        }

        if (newY <= 0 || newY >= window.innerHeight - 50) {
          setDirection((prevDirection) => ({ ...prevDirection, y: -prevDirection.y }));
          newY = prevPosition.y + direction.y;
        }

        return { x: newX, y: newY };
      });
    };

    const intervalId = setInterval(moveIcon, 10);
    return () => clearInterval(intervalId);
  }, [direction]);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
      }}
    >
      <IconComponent style={{ fontSize: 50, color: 'white' }} />
    </div>
  );
};

export default MovingIcon;
