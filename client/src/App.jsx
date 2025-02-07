import { useEffect, useState } from 'react';
import AccessDetails from './Access/AccessDetails';
import AccessList from './Access/AccessList';
import AccessLog from './Access/AccessLog';
import Header from './Header';
import Modal from './ui/Modal';
import { Route, Routes } from 'react-router';

function App() {
  const [chosenAccess, setChosenAccess] = useState(null);
  const [error, setError] = useState(null);
  const [overlayActive, setOverlayActive] = useState(false);
  const modalIsActive = chosenAccess !== null;

  const onAccessClick = (access) => {
    setChosenAccess(access);
    setOverlayActive(true);
  };

  const onOverlayClick = () => {
    setChosenAccess(null);
    setOverlayActive(false);
  };

  const onError = (error) => {
    setError(error);
  };

  useEffect(() => {
    if (chosenAccess === null) {
      onOverlayClick();
    } else {
      setOverlayActive(true);
    }
  }, [chosenAccess]);

  return (
    <>
      <div id="overlay" className={"fixed inset-0 bg-slate-400 opacity-70 z-40 w-full h-full " + (overlayActive ? 'block' : 'hidden')} onClick={() => onOverlayClick()}></div>
      <Modal title="Selected access" active={modalIsActive} onCloseModal={onOverlayClick}>
        <AccessDetails chosenAccess={chosenAccess} />
      </Modal>
      <div className="flex flex-col w-full px-32">
        <Header />
        <Routes>
          <Route path="/" element={<AccessList error={error} onAccessClick={onAccessClick} onError={onError} />} />
          <Route path="/logs" element={<AccessLog error={error} onAccessClick={onAccessClick} onError={onError} />} />
        </Routes>
      </div>
    </>
  )
}

export default App
