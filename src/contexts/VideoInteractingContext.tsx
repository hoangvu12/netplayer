import React, { useContext, useState } from 'react';

interface ContextValue {
  isInteracting: boolean;
  setIsInteracting: React.Dispatch<React.SetStateAction<boolean>>;
  isShowingIndicator: boolean;
  setIsShowingIndicator: React.Dispatch<React.SetStateAction<boolean>>;
}

interface VideoContextProviderProps {
  defaultValue?: boolean;
}

export const VideoInteractingContext = React.createContext<ContextValue>({
  isInteracting: false,
  setIsInteracting: () => {},
  isShowingIndicator: false,
  setIsShowingIndicator: () => {},
});

export const VideoInteractingContextProvider: React.FC<
  VideoContextProviderProps
> = ({ children, defaultValue = false }) => {
  const [isInteracting, setIsInteracting] = useState(defaultValue);
  const [isShowingIndicator, setIsShowingIndicator] = useState(false);

  return (
    <VideoInteractingContext.Provider
      value={{
        isInteracting,
        setIsInteracting,
        isShowingIndicator,
        setIsShowingIndicator,
      }}
    >
      {children}
    </VideoInteractingContext.Provider>
  );
};

export const useInteract = () => {
  return useContext(VideoInteractingContext);
};
