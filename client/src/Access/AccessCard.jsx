import { AccessStatus } from "@prisma/client";

const AccessCard = ({ access, onAccessClick }) => {
  const { status, createdAt, updatedAt, user, message } = access;
  const cardColor = getCardColor(status);
  const userHasEntered = updatedAt === '-';
  const { iconName, iconTooltip } = getIconTooltip(access.status, userHasEntered);

  function getIconTooltip(accessStatus, userHasEntered) {
    if (accessStatus === AccessStatus.ERROR || accessStatus === AccessStatus.FAILURE) {
      return {
        iconName: 'error',
        iconTooltip: 'Error while performing user clearance',
      }
    }
    return {
      iconName: userHasEntered ? 'check' : 'logout',
      iconTooltip: userHasEntered ? 'User is inside' : 'User has left',
    }
  }
  function getCardColor(status) {
    if (status === AccessStatus.WARNING) return 'bg-orange-200 border-orange-300 hover:bg-orange-300 hover:border-orange-400';
    if (status === AccessStatus.ERROR) return 'bg-red-200 border-red-300 hover:bg-red-300 hover:border-red-400';
    if (status === AccessStatus.FAILURE) return 'bg-zinc-200 border-zinc-300 hover:bg-zinc-300 hover:border-zinc-400';
    return 'bg-emerald-200 border-emerald-300 hover:bg-emerald-300 hover:border-emerald-400';
  }

  return (
    <div className={`justify-between text-neutral-200 ${cardColor} rounded-md p-2 border cursor-pointer`} onClick={() => onAccessClick(access)}>
      <div className="bg-slate-50 opacity-80 text-black rounded-md p-2 flex flex-col gap-4">
        <div className="flex justify-between text-left items-center gap-4">
          <span title={iconTooltip} className="material-symbols-outlined">{iconName}</span>
          <span className="font-bold">{user.id}</span>
          <span className="text-sm">{createdAt}</span>
        </div>
        <h4 className="text-lg font-bold">{user.name}</h4>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}

export default AccessCard;