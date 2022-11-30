import React,{useState} from 'react'
import Tree from './Tree';

function TreeNode({ node }) {
    const { children, label } = node;
    console.log(children,label)
    const [showChildren, setShowChildren] = useState(false);
    const handleClick = () => {
        setShowChildren(!showChildren);
    };
    const leafNodeClick = () => {

    }
    return (
        <>
            <li onClick={children?handleClick:leafNodeClick}>
                {showChildren?<img alt='' id="toggle_off" className={children?'exp_col commmon-showable':'exp_col commmon-visable'} src="./images/collapse.png"  />:<img alt='' id="toggle_on" className={children?'exp_col commmon-showable':'exp_col commmon-visable'} src="./images/expand.png" />}
                <span className="node"><img alt='' className="icon_tree" src="./images/star.png" />
                    <a>{label}</a>
                </span>
            </li>
            {showChildren && <li > <Tree treeData={children} /> </li>}
        </>
    )
}

export default TreeNode
