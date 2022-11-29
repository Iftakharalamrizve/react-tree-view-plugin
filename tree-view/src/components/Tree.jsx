import React, { useContext } from 'react';
import List from './List';
import { AppContext } from '../contex/contextApi';


function Tree(props) {
    const { createTree } = useContext(AppContext);
    const { tree } = props;
    console.log(createTree)
    return (
        <ul>
            <List id={tree.id} label={tree.label} items={tree.items} />
        </ul>
    )
}

export default Tree
