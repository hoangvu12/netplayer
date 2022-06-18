import * as React from 'react';
import { useVideoProps } from '../../contexts/VideoPropsContext';
import { useVideoState } from '../../contexts/VideoStateContext';
import SubtitleIcon from '../icons/SubtitleIcon';
import SubtitleOffIcon from '../icons/SubtitleOffIcon';
import ControlButton from './ControlButton';

const SubtitleButton = () => {
  const { state, setState } = useVideoState();
  const { i18n } = useVideoProps();

  const toggle = React.useCallback(() => {
    setState((prev) => ({
      isSubtitleDisabled: !prev.isSubtitleDisabled,
    }));
  }, [setState]);

  return state?.subtitles?.length ? (
    <ControlButton
      tooltip={
        state.isSubtitleDisabled
          ? i18n.controls.enableSubtitle
          : i18n.controls.disableSubtitle
      }
      onClick={toggle}
    >
      {state.isSubtitleDisabled ? <SubtitleOffIcon /> : <SubtitleIcon />}
    </ControlButton>
  ) : null;
};

export default React.memo(SubtitleButton);
