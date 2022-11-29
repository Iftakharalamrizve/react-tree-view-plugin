import React from 'react'
import Leaf from './Leaf';
import List from './List';
function Node(props) {
    const { id, label, items, parent, index } = props;
    return items && items.length?(<List id={id} items={items} label={label} parent={parent} index={index} />):(<Leaf parent={parent} label={label} id={id} index={index} />)
}
export default Node
