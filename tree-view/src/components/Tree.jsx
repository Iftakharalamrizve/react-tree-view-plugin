import TreeNode from "./TreeNode"
function Tree({ treeData, nodeLength }) {
    return (
        <ul id="tree" className="tree" >
            {treeData.map((node,index) => (
                <TreeNode node={node} key={node.key} lastNode={index == nodeLength ? true : false} />
            ))}
        </ul>
    )
}

export default Tree
