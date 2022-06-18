// https://github.com/nirsky/react-native-size-matters/blob/master/lib/scaling-utils.js

import { useCallback, useEffect, useState } from 'react';

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const getDimension = () => {
  const { width, height } = window.screen;
  const [shortDimension, longDimension] =
    width < height ? [width, height] : [height, width];

  return [shortDimension, longDimension];
};

const useTextScaling = () => {
  const [[shortDimension, longDimension], setDimension] =
    useState(getDimension);

  useEffect(() => {
    const handleResize = () => {
      setDimension(getDimension());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
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
  };
};

export default useTextScaling;
