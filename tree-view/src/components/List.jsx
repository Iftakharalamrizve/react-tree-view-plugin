import React from 'react'
import Node from './Node'
import Leaf from './Leaf';

function List(props) {
    const { id, label, items } = props;
    return (
        <li className="d">
            <div><Leaf parent={{}} label={label} id={id} index={id} /></div>
            {items && items.length ? (
                <ul>
                    {items.map((item, i) => {
                        return (
                            <Node
                                key={i}
                                parent={id}
                                id={item.id}
                                label={item.label}
                                items={item.items}
                                index={i}
                            />
                        );
                    })}
                </ul>
            ) : null}
        </li>
    )
}

export default List
