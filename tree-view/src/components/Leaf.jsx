import React from 'react'

function Leaf(props) {
    const { id, label, parent, index } = props;
    return (
        <li key={id}>
            {label}
        </li>
    )
}

export default Leaf
