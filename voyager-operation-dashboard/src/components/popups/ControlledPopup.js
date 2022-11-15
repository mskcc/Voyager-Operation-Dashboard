import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import './ControlledPopup.css'
import 'reactjs-popup/dist/index.css';

const ControlledPopup = ({name, content}) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  return (
    <div>
      <div className='button-container'>
        <button type="button" className="button" onClick={() => setOpen(o => !o)}>
          {name}
        </button>
      </div>
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <a className="close" onClick={closeModal}>
            &times;
        </a>
        <div className="modal">
          {content}
        </div>
      </Popup>
    </div>
  );
};

export default ControlledPopup;