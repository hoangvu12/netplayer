import * as React from 'react';
import { useVideoProps } from '../../../contexts/VideoPropsContext';
import { useVideoState } from '../../../contexts/VideoStateContext';
import QualityIcon from '../../icons/QualityIcon';
import NestedMenu from '../../NestedMenu';

const QualityMenu = () => {
  const { state, setState } = useVideoState();
  const { i18n } = useVideoProps();

  const handleQualityChange = (value: string) => {
    setState(() => ({ currentQuality: value }));
  };

  return state.qualities.length ? (
    <NestedMenu.SubMenu
      menuKey="quality"
      title={i18n.settings.quality}
      activeItemKey={state.currentQuality || state.qualities[0]}
      icon={<QualityIcon />}
      onChange={handleQualityChange}
    >
      {state.qualities.map((quality, index) => (
        <NestedMenu.Item
          key={quality + index}
          itemKey={quality}
          title={quality}
          value={quality}
        />
      ))}
    </NestedMenu.SubMenu>
  ) : null;
};

export default React.memo(QualityMenu);
