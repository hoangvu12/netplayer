import * as React from 'react';

import { useSubtitleSettings } from '../../../../contexts/SubtitleSettingsContext';
import { useVideoProps } from '../../../../contexts/VideoPropsContext';
import NestedMenu, { SubMenuProps } from '../../../NestedMenu/NestedMenu';

const SubtitleTextStyle: React.FC<Partial<SubMenuProps>> = (props) => {
  const { state, setState } = useSubtitleSettings();
  const { i18n } = useVideoProps();

  return (
    <NestedMenu.SubMenu
      {...props}
      menuKey="subtitle_text_style"
      title={i18n.settings.subtitleTextStyle}
      onChange={(value) => {
        // @ts-ignore
        setState(() => ({ textStyle: value }));
      }}
      activeItemKey={state.textStyle}
    >
      <NestedMenu.Item
        itemKey="none"
        title={i18n.settings.none}
        value="none"
      ></NestedMenu.Item>
      <NestedMenu.Item
        itemKey="outline"
        title="Outline"
        value="outline"
      ></NestedMenu.Item>
    </NestedMenu.SubMenu>
  );
};

export default SubtitleTextStyle;
