import React, { Component } from 'react';
import axios from "axios";
import ReactModal from 'react-modal';
import {Link} from 'react-router-dom';

import LoadingComponent from './Loading';
import TaskItem from './TaskItem';
import NewProject from './NewProject';

import CreateTask from './CreateTask';

ReactModal.setAppElement('#root');

export default class TaskList extends Component {
    constructor(props){
        super(props);

        this.state = {
            project: null,
            loading: true,
            openNewTaskModal: false,
            openEditProjectModal: false,
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
            return (
                <ul className="list-group list-group-flush">
                    {project.tasks.map(task => (
                        <TaskItem
                            task={task}
                            key={task.id}
                            onTaskCompleted={this.handleTaskCompleted}
                            editable={this.ownsProject()}
                        />
                    ))}
                </ul>
            )
        } else {
            return (<p>Task list is empty!</p>)
        }
    };

    handleTaskCreated = (newTask) => {
        this.setState(state => ({
            project: {...state.project, tasks: [newTask, ...state.project.tasks]},
            openNewTaskModal: false
        }));
    };

    ownsProject = () => {
        const {project} = this.state;
        return !!project && project.user_id && project.user_id == window.ProjectManager.id;
    };

    handleNewTaskModalOpen = () => this.setState({openNewTaskModal: true});
    handleNewTaskModalClose = () => this.setState({openNewTaskModal: false});

    openProjectEditModal = () => this.setState({openEditProjectModal: true});
    closeProjectEditModal = () => this.setState({openEditProjectModal: false});

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
        const newTaskList = this.state.project.tasks.map(function(task){
            if(task.id === id){
                return {...task, completed: 1};
            }else{
                return task;
            }
        });

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

    handleUpdate = ({name, description, public: pub}) => {
        this.setState(({project}) =>({
            project: {...project, name, description, public: pub},
            openEditProjectModal: false
        }));
    };

    render(){
        const {project, loading, openNewTaskModal, openEditProjectModal} = this.state;

        return (
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <div className="align-self-center">Project Detail</div>

                            {this.ownsProject() && (
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button onClick={this.openProjectEditModal} type="button" className="btn btn-sm btn-secondary">Edit</button>
                                    <button onClick={this.deleteProject} className='btn btn-danger btn-sm' type="button">Delete</button>
                                </div>
                            )}

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

                            <Link to={this.ownsProject() ? "/projects" : '/'} className="btn btn-outline-primary btn-sm btn-block">Back to Projects</Link>
                        </div>
                    </div>

                    {this.ownsProject() && (
                    <div className="card mt-5 d-none d-md-block">
                        <div className="card-header">New Task</div>
                        <div className="card-body">
                            <CreateTask
                                projectID={this.props.match.params.project}
                                onTaskCreated={this.handleTaskCreated}
                            />
                        </div>
                    </div>
                    )}
                </div>
                <div className="col-md-8 mt-md-1">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <div className="align-self-center">Project Task Lists</div>
                            {this.ownsProject()  && (
                                <button
                                    onClick={this.handleNewTaskModalOpen}
                                    className='btn btn-success btn-sm'
                                >Add Task</button>
                            )}
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
                <ReactModal
                    closeTimeoutMS={500}
                    isOpen={openNewTaskModal}
                    contentLabel="Create New task"
                    className="new-task-modal"
                    overlayClassName="modal-overlay"
                    onRequestClose={this.handleNewTaskModalClose}
                >
                    <div className="card">
                        <button
                            type="button"
                            onClick={this.handleNewTaskModalClose}
                            className="close"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="card-header">New Task</div>
                        <div className="card-body">
                            <CreateTask
                                projectID={this.props.match.params.project}
                                onTaskCreated={this.handleTaskCreated}
                            />
                        </div>
                    </div>
                </ReactModal>

                <ReactModal
                    closeTimeoutMS={500}
                    isOpen={openEditProjectModal}
                    contentLabel="Edit Project"
                    className="edit-project-modal"
                    overlayClassName="modal-overlay"
                    onRequestClose={this.closeProjectEditModal}
                >
                    <div className="card">
                        <button
                            type="button"
                            onClick={this.closeProjectEditModal}
                            className="close"
                            aria-label="Close Modal"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <NewProject
                            project={project}
                            editMode={true}
                            onUpdate={this.handleUpdate}
                        />
                    </div>
                </ReactModal>
            </div>
        );
    }
}