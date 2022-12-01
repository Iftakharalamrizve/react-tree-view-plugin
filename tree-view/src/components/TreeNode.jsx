import React, { useState } from "react";
import Tree from "./Tree";

function TreeNode({ node, lastNode }) {
  const { children, label } = node;
  const [showChildren, setShowChildren] = useState(false);
  const handleClick = () => {
    setShowChildren(!showChildren);
  };
  return (
    <>
      <li
        className={lastNode ? "last" : ""}
        onClick={children ? handleClick : null}
      >
        <img
          alt=""
          id={showChildren ? "toggle_off" : "toggle_on"}
          className={
            children ? "exp_col commmon-showable" : "exp_col commmon-visable"
          }
          src={showChildren ? "./images/collapse.png" : "./images/expand.png"}
        />
        <span className="node">
          <img
            alt=""
            className="icon_tree"
            src={children ? "./images/folder.png" : "./images/file.png"}
          />
          <span>{label}</span>
        </span>
      </li>

      {showChildren && (
        <li>
          <Tree treeData={children} nodeLength={children.length - 1} />
        </li>
      )}
    </>
  );
}

export default TreeNode;
