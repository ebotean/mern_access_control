const Modal = ({ active, title, onCloseModal, children }) => {
  const display = !!active ? 'relative' : 'hidden';
  return (
    <div className="z-40 absolute left-1/2 top-1/5">
      <div className={"z-50 -left-1/2 m-auto w-128 bg-white border border-slate-300 p-4 rounded-md flex flex-col pb-8 " + display}>
        <div className="flex justify-between items-center pb-4">
          <h1>{title}</h1>
          <span title="Close modal" className="material-symbols-outlined" onClick={() => onCloseModal()}>close</span>
        </div>
        <hr className="pb-4" />
        {children}
      </div>
    </div>
  )
}

export default Modal;