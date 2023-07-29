import {forwardRef} from "react";

const Ball = forwardRef(({ position }, ref) => {
  return (
    <div
      ref={ref}
      className="fixed w-4 h-4 bg-white"
      style={{left: position.x+'px', top: position.y+'px', borderRadius: '100%'}}>
    </div>
  );
});

export default Ball;