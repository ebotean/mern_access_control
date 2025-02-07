const COLOR_GREEN = 'green';
const COLOR_RED = 'red';

function StatusLight({ color }) {
  if (!color || color !== COLOR_GREEN && color !== COLOR_RED) {
    color = COLOR_GREEN;
  }
  const componentColor = color === COLOR_GREEN ? 'bg-green-600' : 'bg-red-600';

  return <small className={`pl-2 before:inline-block before:w-2 before:h-2 before:bg-green-600 before:rounded-full before:content-[''] before:${componentColor}`}></small>
}

export default StatusLight;