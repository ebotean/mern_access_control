const ErrorDialog = ({ error }) => {
  return (
    <div className="w-48 p-4 flex flex-col bg-slate-400 justify-between items-center border">
      <div className="flex flex-col justify-between items-center">
        <h3>Error</h3>
        <p className="text-slate-500">An error occurred.</p>
      </div>
      <div className="bg-neutral-100">
        <p>{error}</p>
      </div>
    </div>
  )
}

export default ErrorDialog;