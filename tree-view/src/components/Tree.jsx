import TreeNode from "./TreeNode"
function Tree({ treeData }) {
    return (
        <ul id="tree" className="tree" >
            {treeData.map((node) => (
                <TreeNode node={node} key={node.key} />
            ))}
        </ul>
    )
}

export default Tree
