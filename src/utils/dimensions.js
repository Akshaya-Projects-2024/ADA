import {Dimensions, PixelRatio} from 'react-native';

// Guideline base sizes (match your design baseline)
export const DesignWidth = 375;
export const DesignHeight = 812;

// Convenience getters for current window/screen sizes
const getWindow = () => Dimensions.get('window');
const getScreen = () => Dimensions.get('screen');

// Static exports (evaluated at module load)
export const screenWidth = getWindow().width;
export const screenHeight = getWindow().height;
export const screenFullHeight = getScreen().height;

// Scaling helpers (computed from current window size when called)
export const scale = (size) => (getWindow().width / DesignWidth) * size;
export const verticalScale = (size) => (getWindow().height / DesignHeight) * size;
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Legacy normalize kept for compatibility; uses horizontal scale and rounds
export function normalize(size) {
  return PixelRatio.roundToNearestPixel(scale(size));
}

// Percent-of-window helpers (use window, not screen)
export const vw = (width) => {
  const widthRatio = width / DesignWidth;
  return PixelRatio.roundToNearestPixel(getWindow().width * widthRatio);
};

export const vh = (height) => {
  const heightRatio = height / DesignHeight;
  return PixelRatio.roundToNearestPixel(getWindow().height * heightRatio);
};
