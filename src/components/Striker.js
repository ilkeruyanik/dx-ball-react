import { forwardRef } from "react";

const Striker = forwardRef(({x}, ref) => {
  return (
    <div
      ref={ref}
      className="w-72 bg-white h-3 fixed bottom-0"
      style={{left: (x-144)+'px'}}>
    </div>
  );
});

export default Striker;