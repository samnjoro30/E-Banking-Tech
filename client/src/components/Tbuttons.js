import { useState } from 'react';
import DashboardSectionWrapper from './dashbordwrapper';
import Transfer from './Transfer';
import '../styles/tbuttons.css';

const Tbutton = () => {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferType, setTransferType] = useState('');

  const handleTransferClick = type => {
    setTransferType(type);
    setShowTransferModal(true);
  };

  return (
    <DashboardSectionWrapper>
      <div className="transfer-area">
        <button
          type="button"
          className="transfer-button account"
          onClick={() => handleTransferClick('account')}
        >
          Transfer to another account
        </button>
        <button
          type="button"
          className="transfer-button mpesa"
          onClick={() => handleTransferClick('mpesa')}
        >
          Transfer to Mpesa
        </button>
      </div>

      {showTransferModal && (
        <Transfer
          type={transferType}
          onClose={() => setShowTransferModal(false)}
        />
      )}
    </DashboardSectionWrapper>
  );
};

export default Tbutton;
