import React from "react";
import TreeCell from "./TreeCell";
import { useDrag, useDrop } from "react-dnd";
import classes from './TreeCell.module.css';

const DraggableTreeCell = (props) => {
    
    const [{isDragging}, drag] = useDrag(() => ({
        type: 'treecell',
        item:  { id: props?.data?.key },
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
        })
    }))

    const [{isOver}, drop] = useDrop(
        () => ({
            accept: 'treecell',
            drop: item => props?.data?.onDrop && props.data.onDrop(item.id),
            collect: monitor => ({
                isOver: !!monitor.isOver()
            })
        })
    )

    const tc = <TreeCell {...props}/>

    if (props.permission > 1) {
        return (
            <div ref={drag} className={`${classes['dnd-container']} ${classes['dnd']} ${isDragging ? classes['drag'] : ''} ${isOver ? classes['over'] : ''}`}>
                <div ref={drop} className={classes['dnd']}>
                    {tc}
                </div>
            </div>
        )
    } else {
        return tc
    }
}

export default DraggableTreeCell

