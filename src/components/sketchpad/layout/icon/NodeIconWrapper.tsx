import * as React from 'react';
import actionBlueIcon from '../../../../assets/images/actionblue.svg';
import eyeBlueIcon from '../../../../assets/images/eyeblue.svg';
import timeBlueIcon from '../../../../assets/images/timeblue.svg';
import errorBlueIcon from '../../../../assets/images/errorblue.svg';
import searchIcon from '../../../../assets/images/searchblue.svg';

interface INodeIconWrapperProps {
  iconName: string;
}

function NodeIconWrapper(props: INodeIconWrapperProps) {
  let path = '';

  switch (props.iconName) {
    case "action":
      path = actionBlueIcon;
      break;
    case "eye":
      path = eyeBlueIcon;
      break;
    case "time":
      path = timeBlueIcon;
      break;
    case "error":
      path = errorBlueIcon;
      break;
    case "filter":
      path = searchIcon;
      break;
  }

  return (<img alt="" src={path} />);
}

export default NodeIconWrapper;
