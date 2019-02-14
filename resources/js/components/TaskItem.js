import React, {PureComponent} from 'react';
import axios from "axios";

export default class TaskItem extends PureComponent{
    markAsComplete = (taskID, onTaskCompleted) => {
        axios.patch(`/api/tasks/${taskID}`)
            .then(() => onTaskCompleted(taskID));
    };

    render() {
        const {task, onTaskCompleted} = this.props;

        return (
            <li className='list-group-item'>
                <h5 className="mb-1">{task.title}</h5>
                <p className='mb-1'>{task.description}</p>
                {task.completed === 1 ? (
                    <div className="d-flex">
                        <span className="d-flex flex-grow-1 align-self-center">Status</span>
                        <span className='d-inline-block bg-success text-white px-2 py-1'>Completed</span>
                    </div>
                ) : (
                    <button
                        onClick={() => this.markAsComplete(task.id, onTaskCompleted)}
                        className="btn btn-warning btn-sm btn-block mt-1"
                    >Mark as Completed</button>
                )}
            </li>
        )
    }
}