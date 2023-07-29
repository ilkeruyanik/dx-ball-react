export const blockRowCreator = (count) => {
  return Array.from({length: count}, () => {
    return { visible: true };
  } );
}

export const isCollide = (ball, object) => {
  const ballRectangle = ball.getBoundingClientRect();
  const objectRectangle = object.getBoundingClientRect();

  const collideObject = {
    isCollide: false,
    collideSide: {
      x: false,
      y: false
    }
  };

  if (
    ((objectRectangle.top <= ballRectangle.top && objectRectangle.bottom >= ballRectangle.top)
    || (objectRectangle.top <= ballRectangle.bottom && objectRectangle.bottom >= ballRectangle.bottom))
    && ((objectRectangle.left <= ballRectangle.left && objectRectangle.right >= ballRectangle.left)
    || (objectRectangle.left <= ballRectangle.right && objectRectangle.right >= ballRectangle.right))
  ){
    collideObject.isCollide = true;
    const ballCollidePoint = {x: 0, y: 0}
    if(objectRectangle.top <= ballRectangle.top && objectRectangle.bottom >= ballRectangle.top){
      ballCollidePoint.y = ballRectangle.top
    }else{
      ballCollidePoint.y = ballRectangle.bottom
    }

    if (objectRectangle.left <= ballRectangle.left && objectRectangle.right >= ballRectangle.left){
      ballCollidePoint.x = ballRectangle.left
    }else{
      ballCollidePoint.x = ballRectangle.right
    }

    const ySide = Math.min(Math.abs(objectRectangle.bottom - ballCollidePoint.y), Math.abs(objectRectangle.top - ballCollidePoint.y))/objectRectangle.height;
    const xSide = Math.min(Math.abs(objectRectangle.left - ballCollidePoint.x), Math.abs(objectRectangle.right-ballCollidePoint.x))/objectRectangle.width;

    if(ySide<xSide){
      collideObject.collideSide.y = true;
    }else if(ySide>xSide){
      collideObject.collideSide.x = true;
    }
    else{
      collideObject.collideSide.x = true;
      collideObject.collideSide.y = true;
    }

  }
  return collideObject
}