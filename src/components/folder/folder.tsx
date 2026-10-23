import React from "react";
import stlyes from "./folder.module.scss"

interface FolderProps {
  name?: string,
  style?: React.CSSProperties, 
  onDoubleClick?: React.MouseEventHandler<HTMLButtonElement>,
  onPointerDown?: React.PointerEventHandler<HTMLButtonElement>,
  onPointerMove?: React.PointerEventHandler<HTMLButtonElement>,
  onPointerUp?: React.PointerEventHandler<HTMLButtonElement>,
  onPointerCancel?: React.PointerEventHandler<HTMLButtonElement>;
  onClick?: React.PointerEventHandler<HTMLButtonElement>;
}

const Folder: React.FC<FolderProps> = ({ 
  name = 'Folder', 
  style,
  onDoubleClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onClick,
  }) => {
  return (
    <button className={stlyes.folder}  
      type="button"
      style = {style}
      onDoubleClick={onDoubleClick}
      onPointerDown = {onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel} 
      onClick={onClick}
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
