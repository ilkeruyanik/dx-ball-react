import Block from "./Block";
import {forwardRef} from "react";

const BlockRow = forwardRef(({index, blocks }, ref) => {

  const refFunction = (el, i) => {
    const blocks = ref.current;
    if (index>=blocks.length){
      ref.current.push([el]);
    }else{
      ref.current[index][i] = el
    }
  }

  return (
    <div className="flex m-auto max-w-max">
      {blocks.map((block, i) => <Block key={i} ref={el => refFunction(el, i)} visible={block.visible}/>)}
    </div>
  )
});

export default BlockRow;