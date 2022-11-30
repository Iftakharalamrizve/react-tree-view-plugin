import React,{useState} from 'react'
import Tree from './Tree';

function TreeNode({ node }) {
    const { children, label } = node;
    const [showChildren, setShowChildren] = useState(false);
    const handleClick = () => {
        setShowChildren(!showChildren);
    };
    return (
        <>
            <li onClick={handleClick}>
                {showChildren?<><img id="toggle_off" className="exp_col" src="./images/collapse.png" /></>:<><img id="toggle_on" className="exp_col" src="./images/expand.png" /></>}
                
                <span className="node"><img className="icon_tree" src="./images/star.png" />
                    <a>{label}</a>
                </span>
            </li>
            {showChildren && <Tree treeData={children} />}  
        </>
    )
}

export default TreeNode
