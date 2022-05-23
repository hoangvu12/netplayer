import * as React from 'react';

import { createPortal } from 'react-dom';

interface PortalProps {
  element?: Element;
}

const Portal: React.FC<PortalProps> = ({
  element = document.body,
  children,
}) => {
  return createPortal(<React.Fragment>{children}</React.Fragment>, element);
};

export default Portal;
