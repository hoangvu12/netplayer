import isHotkey from '../utils/hotkey';
import { useEffect } from 'react';
import { useVideoProps } from '../contexts/VideoPropsContext';

const useGlobalHotKeys = (videoEl: HTMLVideoElement) => {
  const { hotkeys } = useVideoProps();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const focusEl = document.activeElement;

      if (
        focusEl &&
        ((focusEl.tagName.toLowerCase() == 'input' &&
          // @ts-ignore
          focusEl?.type == 'text') ||
          focusEl.tagName.toLowerCase() == 'textarea')
      )
        return;

      const matchedHotKey = hotkeys.find(hotkey =>
        isHotkey(hotkey.hotKey, event)
      );

      if (!matchedHotKey) return;

      matchedHotKey.fn(videoEl);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoEl]);
};

export default useGlobalHotKeys;
