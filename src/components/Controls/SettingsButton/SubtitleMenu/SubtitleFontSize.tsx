import * as React from 'react';

import { useSubtitleSettings } from '../../../../contexts/SubtitleSettingsContext';
import { useVideoProps } from '../../../../contexts/VideoPropsContext';
import NestedMenu, { SubMenuProps } from '../../../NestedMenu/NestedMenu';

const fontSizes = [0.5, 0.75, 1, 1.5, 2, 3, 4];

const SubtitleFontSize: React.FC<Partial<SubMenuProps>> = (props) => {
  const { state, setState } = useSubtitleSettings();
  const { i18n } = useVideoProps();

  return (
    <NestedMenu.SubMenu
      {...props}
      menuKey="subtitle_font_size"
      title={i18n.settings.subtitleFontSize}
      onChange={(value) => {
        setState(() => ({ fontSize: Number(value) }));
      }}
      activeItemKey={state.fontSize.toString()}
    >
      {fontSizes.map((size) => (
        <NestedMenu.Item
          itemKey={size.toString()}
          title={`${size * 100}%`}
          value={size.toString()}
          key={size}
        ></NestedMenu.Item>
      ))}
    </NestedMenu.SubMenu>
  );
};

export default SubtitleFontSize;
