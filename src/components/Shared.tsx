import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlane, 
  faBed, 
  faMapSigns, 
  faUtensils, 
  faBus, 
  faShoppingBag, 
  faEllipsisH, 
  faCar, 
  faTrain,   // [新增]
  faShip     // [新增]
} from '@fortawesome/free-solid-svg-icons';
import type { CategoryType } from '../types';

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