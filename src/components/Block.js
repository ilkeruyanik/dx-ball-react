import {forwardRef} from "react";

const Block = forwardRef(({visible}, ref) => {
    return (<div
      ref={ref}
      className="w-36 bg-teal-950 h-12 border border-solid"
      style={{visibility: visible ? 'visible' : 'hidden'}}>
    </div>);
});

export default Block;