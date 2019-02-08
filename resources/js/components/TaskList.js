import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";

import LoadingComponent from './Loading';
import TaskItem from './TaskItem';

import CreateTask from './CreateTask';

export default class TaskList extends Component {
    constructor(props){
        super(props);

        this.state = {
            project: null,
            loading: true
        }
    }

    componentDidMount() {
        const {project} = this.props.match.params;
        axios.get(`/api/projects/${project}/tasks`).then(({data}) => {
            this.setState({loading: false, project: data.data});
        }).catch(error => {
            alert("Project cannot be found");
            this.props.history.goBack();
        })
    }

    displayTaskList = (project) => {
        if (project.tasks.length) {
            return project.tasks.map(task => (
                <TaskItem
                    task={task}
                    key={task.id}
                    onTaskCompleted={this.handleTaskCompleted}
                />
            ));
        } else {
            return (<p>Task list is empty!</p>)
        }
    };

    handleTaskCreated = (newTask) => {
        this.setState(state => ({
            project: {...state.project, tasks: [...state.project.tasks, newTask]}
        }));
    };

    deleteProject = () => {
        const {project} = this.state;
        if(confirm(`Are you sure you want to delete this project: ${project.name}`)){
            axios.delete(`/api/projects/${project.id}`).then(() => {
                alert("Project has successfully being deleted");

                this.props.history.push('/projects');
            }).catch(error => {
                alert("Failed to delete the project...");
            })
        }
    };

    handleTaskCompleted = (id) => {
        console.log("Updating completed for Project: ", id);
        const newTaskList = this.state.project.tasks.map(function(task){
            if(task.id === id){
                return {...task, completed: 1};
            }else{
                return task;
            }
        });
        console.log("Task List: ", newTaskList);

        this.setState(({project}) => {
            const newTaskList = project.tasks.map(function(task){
                if(task.id === id){
                    return {...task, completed: 1};
                }else{
                    return task;
                }
            });

            return {project: {...project, tasks: newTaskList}};
        });
    };

    render(){
        const {project, loading} = this.state;

        return (
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <div className="align-self-center">Project Detail</div>
                            <button onClick={this.deleteProject} className='btn btn-danger btn-sm'>Delete</button>
                        </div>

                        <div className="card-body">
                            {loading || project == null ? (
                                <div className="d-flex justify-content-center">
                                    <div className="spinner-border text-primary m-5" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>

                            ) : (<div className="mb-3">
                                    <h2 className="card-title">{project.name}</h2>
                                    <p className="card-text">{project.description}</p>
                                </div>
                            )}

                            <Link to="/projects" className="btn btn-outline-primary btn-sm btn-block">Back to Projects</Link>
                        </div>
                    </div>

                    <div className="card mt-5">
                        <div className="card-header">New Task</div>
                        <div className="card-body">
                            <CreateTask
                                projectID={this.props.match.params.project}
                                onTaskCreated={this.handleTaskCreated}
                            />
                        </div>
                    </div>

                </div>
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <div className="align-self-center">Project Task Lists</div>
                            <Link className='btn btn-success btn-sm' to='/projects/create'>Add Task</Link>
                        </div>

                        <div className="card-body">
                            <ul className='list-group list-group-flush'>
                                {loading || project == null ? (
                                    <LoadingComponent label="Loading Task Lists" />
                                ) : this.displayTaskList(project)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}