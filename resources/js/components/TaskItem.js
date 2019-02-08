import React, {PureComponent} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";

export default class TaskItem extends PureComponent{
    markAsComplete = (taskID, onTaskCompleted) => {
        axios.patch(`/api/tasks/${taskID}`)
            .then(() => onTaskCompleted(taskID));
    };

    render() {
        const {task, onTaskCompleted} = this.props;

        return (
            <li className='list-group-item list-group-item-action d-flex justify-content-between align-items-center' key={task.id}>
                <Link
                    className='d-flex flex-grow-1'
                    to={`/tasks/${task.id}/tasks`}
                >{task.title}</Link>

                {task.completed === 1 ? (
                    <span className='badge badge-success badge-pill'>Completed</span>
                ) : (
                    <button
                        onClick={() => this.markAsComplete(task.id, onTaskCompleted)}
                        className="btn btn-warning btn-sm"
                    >Mark as Completed</button>
                )}
            </li>
        )
    }
}