import * as React from 'react';

import { useVideo } from '../../../contexts/VideoContext';
import { useVideoProps } from '../../../contexts/VideoPropsContext';
import PlaybackSpeedIcon from '../../icons/PlaybackSpeedIcon';
import NestedMenu from '../../NestedMenu';

const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const PlaybackSpeedMenu = () => {
  const { videoEl } = useVideo();
  const { i18n } = useVideoProps();

  const currentSpeed = videoEl?.playbackRate || 1;

  const handleChangeSpeed = (value: string) => {
    if (!videoEl) return;

    videoEl.playbackRate = Number(value);
  };

  return (
    <NestedMenu.SubMenu
      menuKey="speed"
      title={i18n.settings.playbackSpeed}
      activeItemKey={currentSpeed.toString()}
      icon={<PlaybackSpeedIcon />}
      onChange={handleChangeSpeed}
    >
      {speeds.map((speed) => (
        <NestedMenu.Item
          key={speed}
          itemKey={speed.toString()}
          title={`${speed}x`}
          value={speed.toString()}
        />
      ))}
    </NestedMenu.SubMenu>
  );
};

export default React.memo(PlaybackSpeedMenu);
