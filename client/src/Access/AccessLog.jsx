import { useEffect, useState } from "react"
import AccessCard from "./AccessCard";
import ErrorDialog from '../ui/ErrorDialog';

const AccessLog = ({ error, onAccessClick }) => {
  const [accessList, setAccessList] = useState(null);

  const fetchAccessLog = async () => {
    const response = await fetch('http://localhost:5000/access/log');
    const logs = await response.json();
    setAccessList(logs);
  }

  useEffect(() => {
    let ignore = false;
    let interval;

    if (!ignore) {
      fetchAccessLog();
      interval = setInterval(() => {
        fetchAccessLog();
      }, 30 * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      ignore = true;
    }
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex-auto">
        <input type="text" name="user" />
      </div>
      <div className="flex-auto flex flex-col gap-2">
        {
          error !== null
            ? <ErrorDialog error={error} />
            : accessList == null
              ? <div>Loading...</div>
              : accessList?.map(access => <AccessCard key={access.id} access={access} onAccessClick={onAccessClick} />)
        }
      </div>
    </div>
  )
}

export default AccessLog;