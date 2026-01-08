import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  // Category Icons
  faPlane, 
  faBed, 
  faMapSigns, 
  faUtensils, 
  faBus, 
  faShoppingBag, 
  faEllipsisH, 
  faCar, 
  faTrain,   // [新增]
  faShip,    // [新增]
  // Weather Icons [補回]
  faCloudSun,
  faCloudRain,
  faSnowflake
} from '@fortawesome/free-solid-svg-icons';
import type { CategoryType } from '../types';

// 1. 分類圖示元件 (包含火車與船)
export const CategoryIcon = ({ type, className = "" }: { type: string | CategoryType, className?: string }) => {
  let icon;
  switch (type) {
    case 'flight': icon = faPlane; break;
    case 'stay': icon = faBed; break;
    case 'activity': icon = faMapSigns; break;
    case 'food': icon = faUtensils; break;
    case 'transport': icon = faBus; break;
    case 'car': icon = faCar; break;
    case 'train': icon = faTrain; break; // [新增]
    case 'ship': icon = faShip; break;   // [新增]
    case 'shopping': icon = faShoppingBag; break;
    default: icon = faEllipsisH;
  }

  return <FontAwesomeIcon icon={icon} className={className} />;
};

// 2. 天氣圖示元件 (補回此部分)
export const WeatherIcon = ({ type }: { type?: string }) => {
  if (type === 'sunny') return <FontAwesomeIcon icon={faCloudSun} className="text-yellow-500" />;
  if (type === 'rainy') return <FontAwesomeIcon icon={faCloudRain} className="text-blue-400" />;
  if (type === 'snowy') return <FontAwesomeIcon icon={faSnowflake} className="text-cyan-300" />;
  // Default
  return <FontAwesomeIcon icon={faCloudSun} className="text-gray-400" />;
};