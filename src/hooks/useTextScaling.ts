// https://github.com/nirsky/react-native-size-matters/blob/master/lib/scaling-utils.js

import { useCallback, useEffect, useState } from 'react';
import { PLAYER_CONTAINER_CLASS } from '../constants';

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const getDimension = () => {
  let width = window.screen.width;
  let height = window.screen.height;

  const containerEl = document.querySelector('.' + PLAYER_CONTAINER_CLASS);

  if (containerEl) {
    const { width: containerWidth, height: containerHeight } =
      containerEl.getBoundingClientRect();

    width = containerWidth;
    height = containerHeight;
  }

  const [shortDimension, longDimension] =
    width < height ? [width, height] : [height, width];

  return [shortDimension, longDimension];
};

const useTextScaling = () => {
  const [[shortDimension, longDimension], setDimension] =
    useState(getDimension);

  useEffect(() => {
    const containerEl = document.querySelector('.' + PLAYER_CONTAINER_CLASS);

    const handleResize = () => {
      setDimension(getDimension());
    };

    if (containerEl) {
      containerEl.addEventListener('resize', handleResize);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      containerEl?.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const update = useCallback(() => {
    const [shortDimension, longDimension] = getDimension();

    setDimension([shortDimension, longDimension]);
  }, []);

  const scale = useCallback(
    (size: number) => (shortDimension / guidelineBaseWidth) * size,
    [shortDimension]
  );
  const verticalScale = useCallback(
    (size: number) => (longDimension / guidelineBaseHeight) * size,
    [longDimension]
  );
  const moderateScale = useCallback(
    (size: number, factor = 0.5) => size + (scale(size) - size) * factor,
    [scale]
  );
  const moderateVerticalScale = useCallback(
    (size: number, factor = 0.5) =>
      size + (verticalScale(size) - size) * factor,
    [verticalScale]
  );

  return {
    scale,
    verticalScale,
    moderateScale,
    moderateVerticalScale,
    update,
  };
};

export default useTextScaling;
