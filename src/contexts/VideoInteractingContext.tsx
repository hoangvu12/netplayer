import React, { useContext, useState } from 'react'

interface ContextValue {
  isInteracting: boolean
  setIsInteracting: React.Dispatch<React.SetStateAction<boolean>>
}

interface VideoContextProviderProps {
  defaultValue?: boolean
}

export const VideoInteractingContext = React.createContext<ContextValue>({
  isInteracting: false,
  setIsInteracting: () => {}
})

export const VideoInteractingContextProvider: React.FC<
  VideoContextProviderProps
> = ({ children, defaultValue = false }) => {
  const [isInteracting, setIsInteracting] = useState(defaultValue)

  return (
    <VideoInteractingContext.Provider
      value={{ isInteracting, setIsInteracting }}
    >
      {children}
    </VideoInteractingContext.Provider>
  )
}

export const useInteract = () => {
  return useContext(VideoInteractingContext)
}
