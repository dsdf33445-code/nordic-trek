// src/components/Shared.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlane, faBed, faCar, faBus, faUtensils, faShoppingBag, faTicketAlt, faReceipt,
  faCloudSun, faCloudRain, faSnowflake
} from '@fortawesome/free-solid-svg-icons';

export const CategoryIcon = ({ type, className = "" }: { type: string, className?: string }) => {
  const props = { className };
  switch (type) {
    case 'flight': return <FontAwesomeIcon icon={faPlane} {...props} />;
    case 'stay': return <FontAwesomeIcon icon={faBed} {...props} />;
    case 'car': return <FontAwesomeIcon icon={faCar} {...props} />;
    case 'transport': return <FontAwesomeIcon icon={faBus} {...props} />;
    case 'food': return <FontAwesomeIcon icon={faUtensils} {...props} />;
    case 'shopping': return <FontAwesomeIcon icon={faShoppingBag} {...props} />;
    case 'activity': return <FontAwesomeIcon icon={faTicketAlt} {...props} />;
    default: return <FontAwesomeIcon icon={faReceipt} {...props} />;
  }
};

export const WeatherIcon = ({ type }: { type?: string }) => {
  if (type === 'sunny') return <FontAwesomeIcon icon={faCloudSun} className="text-yellow-500" />;
  if (type === 'rainy') return <FontAwesomeIcon icon={faCloudRain} className="text-blue-400" />;
  if (type === 'snowy') return <FontAwesomeIcon icon={faSnowflake} className="text-cyan-300" />;
  return <FontAwesomeIcon icon={faCloudSun} className="text-gray-400" />;
};