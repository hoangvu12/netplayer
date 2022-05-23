import * as React from 'react';

import { useSubtitleSettings } from '../../../../contexts/SubtitleSettingsContext';
import { useVideoProps } from '../../../../contexts/VideoPropsContext';
import NestedMenu, { SubMenuProps } from '../../../NestedMenu/NestedMenu';

const fontSizes = [
  '0.5rem',
  '0.75rem',
  '1rem',
  '1.5rem',
  '2rem',
  '3rem',
  '4rem',
];

const SubtitleFontSize: React.FC<Partial<SubMenuProps>> = props => {
  const { state, setState } = useSubtitleSettings();
  const { i18n } = useVideoProps();

  return (
    <NestedMenu.SubMenu
      {...props}
      menuKey="subtitle_font_size"
      title={i18n.settings.subtitleFontSize}
      onChange={value => {
        setState(() => ({ fontSize: value }));
      }}
      activeItemKey={state.fontSize}
    >
      {fontSizes.map(size => (
        <NestedMenu.Item
          itemKey={size}
          title={`${Number(size.replace('rem', '')) * 100}%`}
          value={size}
          key={size}
        ></NestedMenu.Item>
      ))}
    </NestedMenu.SubMenu>
  );
};

export default SubtitleFontSize;
