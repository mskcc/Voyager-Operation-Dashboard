import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import './ControlledPopup.css'


const ControlledPopup = ({name, content}) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  return (
    <div>
      <button type="button" className="button" onClick={() => setOpen(o => !o)}>
        {name}
      </button>
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div className="modal">
          {content}
        </div>
      </Popup>
    </div>
  );
};

export default ControlledPopup;