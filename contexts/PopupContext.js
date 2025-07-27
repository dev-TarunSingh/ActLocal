import React, { createContext, useState, useContext } from "react";

const PopupContext = createContext({
  visible: false,
  message: null,
  showPopup: (p0: { senderName: any, text: any, chatroomId: any }) => {},
});

export const usePopup = () => useContext(PopupContext);

export const PopupProvider = ({ children }) => {
  const [popupData, setPopupData] = useState({ visible: false, message: null });

  const showPopup = (message) => {
    setPopupData({ visible: true, message });
    setTimeout(() => {
      setPopupData({ visible: false, message: null });
    }, 4000);
  };

  return (
    <PopupContext.Provider value={{ ...popupData, showPopup }}>
      {children}
    </PopupContext.Provider>
  );
};
