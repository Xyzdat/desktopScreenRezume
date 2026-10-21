import React from "react";
import stlyes from "./folder.module.scss"

interface FolderProps {
  name?: string,
  style?: React.CSSProperties, 
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  onPointerDown?: React.PointerEventHandler<HTMLButtonElement>,
  onPointerMove?: React.PointerEventHandler<HTMLButtonElement>,
  onPointerUp?: React.PointerEventHandler<HTMLButtonElement>,
  onPointerCancel?: React.PointerEventHandler<HTMLButtonElement>;
}

const Folder: React.FC<FolderProps> = ({ 
  name = 'Folder', 
  style,
  onClick, 
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  }) => {
  return (
    <button className={stlyes.folder}  
      type="button"
      style = {style}
      onClick={onClick}
      onPointerDown = {onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel} 
    >
      <div className={stlyes.folder__icon}>
        <div className={stlyes.folder__tab} />
        <div className={stlyes.folder__body} />
      </div>

      <span className={stlyes.folder__name}>{name}</span>
    </button>

  );
};

export default Folder;
