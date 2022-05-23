import * as React from 'react';

import { PLAYER_CONTAINER_CLASS } from '../../../constants';
import { useVideoProps } from '../../../contexts/VideoPropsContext';
import { isDesktop, isMobile } from '../../../utils/device';
import Dialog from '../../Dialog';
import SettingsIcon from '../../icons/SettingsIcon';
import NestedMenu from '../../NestedMenu';
import Popover from '../../Popover';
import ControlButton from '../ControlButton';
import PlaybackSpeedMenu from './PlaybackSpeedMenu';
import QualityMenu from './QualityMenu';
import SubtitleMenu from './SubtitleMenu/SubtitleMenu';

const Menu = React.memo(() => (
  <NestedMenu
    style={{
      backgroundColor: 'rgba(0,0,0,0.9)',
      maxHeight: '20rem',
      width: isMobile ? '100%' : '20rem',
      height: 'max-content',
      padding: isMobile ? '1rem' : '0.5rem',
    }}
  >
    <PlaybackSpeedMenu />
    <QualityMenu />
    <SubtitleMenu />
  </NestedMenu>
));

const selector = `.${PLAYER_CONTAINER_CLASS}`;

const SettingsButton = () => {
  const { i18n } = useVideoProps();

  return (
    <React.Fragment>
      {isMobile && (
        <Dialog
          portalSelector={selector}
          reference={
            <ControlButton>
              <SettingsIcon />
            </ControlButton>
          }
        >
          <Menu />
        </Dialog>
      )}

      {isDesktop && (
        <Popover
          portalSelector={selector}
          reference={
            <ControlButton tooltip={i18n.controls.settings}>
              <SettingsIcon />
            </ControlButton>
          }
          placement="top"
          avoidOverflowSelector={selector}
        >
          <Menu />
        </Popover>
      )}
    </React.Fragment>
  );
};

export default React.memo(SettingsButton);
