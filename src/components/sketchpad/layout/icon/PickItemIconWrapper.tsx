import * as React from 'react';
import actionIcon from '../../../../assets/images/action.svg';
import eyeIcon from '../../../../assets/images/eye.svg';
import timeIcon from '../../../../assets/images/time.svg';
import errorIcon from '../../../../assets/images/error.svg';
import searchIcon from '../../../../assets/images/search.svg';

interface IPickItemIconWrapperProps {
  iconName: string;
}

function PickItemIconWrapper(props: IPickItemIconWrapperProps) {
  let path = '';

  switch (props.iconName) {
    case "action":
      path = actionIcon;
      break;
    case "eye":
      path = eyeIcon;
      break;
    case "time":
      path = timeIcon;
      break;
    case "error":
      path = errorIcon;
      break;
    case "filter":
      path = searchIcon;
      break;
  }

  return (<img alt="" src={path} />);
}

export default PickItemIconWrapper;
