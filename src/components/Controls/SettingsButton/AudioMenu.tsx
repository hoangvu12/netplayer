import React from 'react';
import { useVideoProps } from '../../../contexts/VideoPropsContext';
import { useVideoState } from '../../../contexts/VideoStateContext';
import AudioIcon from '../../icons/AudioIcon';
import NestedMenu from '../../NestedMenu';

const AudioMenu = () => {
  const { state, setState } = useVideoState();
  const { i18n } = useVideoProps();

  const handleAudioChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      currentAudio: value,
    }));
  };

  return state.audios.length ? (
    <NestedMenu.SubMenu
      menuKey="audios"
      title={i18n.settings.audio}
      activeItemKey={
        !state.currentAudio ? state?.audios?.[0]?.lang : state.currentAudio
      }
      icon={<AudioIcon />}
      onChange={handleAudioChange}
    >
      {state.audios.map((audio) => (
        <NestedMenu.Item
          key={audio.lang}
          itemKey={audio.lang}
          title={audio.language}
          value={audio.lang}
        />
      ))}
    </NestedMenu.SubMenu>
  ) : null;
};

export default React.memo(AudioMenu);
