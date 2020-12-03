import { CanvasInnerDefault, ICanvasInnerDefaultProps } from "@artemantcev/react-flow-chart";
import React from 'react';

const CanvasInner = (props: ICanvasInnerDefaultProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 8) {
      e.preventDefault();

      // @ts-ignore
      return {...props.onKeyDown(e)}
    }
  }

  return (
    <CanvasInnerDefault {...props} onKeyDown={handleKeyDown}>
      {props.children}
    </CanvasInnerDefault>
  )
}

export default CanvasInner;
