import * as React from 'react';

import { useSubtitleSettings } from '../../../../contexts/SubtitleSettingsContext';
import { useVideoProps } from '../../../../contexts/VideoPropsContext';
import NestedMenu, { SubMenuProps } from '../../../NestedMenu/NestedMenu';

const opacities = [0, 25, 50, 75, 100];

const SubtitleFontOpacity: React.FC<Partial<SubMenuProps>> = (props) => {
  const { state, setState } = useSubtitleSettings();
  const { i18n } = useVideoProps();

  return (
    <NestedMenu.SubMenu
      {...props}
      menuKey="subtitle_font_opacity"
      title={i18n.settings.subtitleFontOpacity}
      onChange={(value) => {
        setState(() => ({ fontOpacity: Number(value) / 100 }));
      }}
      activeItemKey={(state.fontOpacity * 100).toString()}
    >
      {opacities.map((opacity) => (
        <NestedMenu.Item
          itemKey={opacity.toString()}
          title={`${opacity}%`}
          value={opacity.toString()}
          key={opacity}
        ></NestedMenu.Item>
      ))}
    </NestedMenu.SubMenu>
  );
};

export default SubtitleFontOpacity;
