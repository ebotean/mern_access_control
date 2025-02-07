import { useEffect, useState } from "react";
import AccessCard from "./AccessCard";
import ErrorDialog from '../ui/ErrorDialog';

const AccessColumn = ({ title, accessList, onAccessClick }) => {
  return (
    <div id="accessList_current" className="grow shrink basis-3/5 flex flex-col gap-2">
      <h4>{title}</h4>
      {accessList.map(access => <AccessCard key={access.id} access={access} onAccessClick={onAccessClick} />)}
    </div>
  )
}

const AccessList = ({ error, onAccessClick, onError }) => {
  const [accessList, setAccessList] = useState(null);

  useEffect(() => {
    let ignore = false;
    let interval;

    const fetchAccesses = async () => {
      try {
        const response = await fetch('http://localhost:5000/access');
        const accesses = await response.json();
        setAccessList(accesses.accesses);
        onError(null);
      } catch (e) {
        setAccessList(null);
        onError(e);
      }
    }

    if (!ignore) {
      fetchAccesses();
      interval = setInterval(() => {
        fetchAccesses();
      }, 15 * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      ignore = true;
    }
  }, []);

  const columnTitles = {
    success: 'Successful accesses',
    error: 'Errors and failures',
  }
  return (
    <>
      {
        error !== null
          ? <ErrorDialog error={error} />
          : (
            <>
              {
                accessList == null
                  ? <div>Loading...</div>
                  :
                  <div id="accessList" className="flex p-4 gap-4">
                    <AccessColumn title={columnTitles.success} accessList={accessList.ok} onAccessClick={onAccessClick} />
                    <AccessColumn title={columnTitles.error} accessList={accessList.error} onAccessClick={onAccessClick} />
                  </div>
              }
            </>
          )
      }
    </>
  );
}
export default AccessList;