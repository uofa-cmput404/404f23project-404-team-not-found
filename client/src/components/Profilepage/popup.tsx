import React from 'react';
import './popup.css';

type PopupProps = {
  trigger: boolean;
  setTrigger: (value: boolean) => void;
  children: React.ReactNode;
};

const Popup: React.FC<PopupProps> = (props) => {
  return props.trigger ? (
    <div className='modal'>
      <div className='popup-inner'>
        <button className='close-btn' onClick={() => props.setTrigger(false)}>close</button>
        {props.children}
      </div>
    </div>
  ) : null;
};

export default Popup;
