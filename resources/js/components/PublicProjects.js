import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";

import LoadingComponent from './Loading';

export default class PublicProjects extends Component {
    constructor(props){
        super(props);

        this.state = {
            projects: null,
            loading: true,
            error: ''
        }
    }

    componentDidMount() {
        this.loadProjects();
        this.subscribeToProjectEvent();
    }

    componentWillUnmount(){
        Echo.leave('project');
    }

    loadProjects = () => {
        axios.get('/api/projects/public').then(({data}) => {
            this.setState({projects: data.data, loading: false})
        }).catch(error => {
            this.handleErrors(error);
        })
    };

    subscribeToProjectEvent = () => {
        Echo.channel('project')
            .listen('NewProjectCreated', (e) => {
                this.setState(({projects}) => ({projects: [e.project, ...projects]}));
            })
    };

    handleErrors = (error) => {
        let message = '';
        if(error.response && error.response.status === 401){
            message = "Login to view your projects";
        }else{
            message = "Unable to fetch projects... Check your internet connectivity"
        }

        this.setState({error: message, loading: false});
    };

    render(){
        const {projects, error, loading} = this.state;

        return (
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <div className="align-self-center">Public Projects</div>
                        </div>

                        <div className="card-body">
                            <ul className='list-group list-group-flush'>
                                { loading ? (
                                    <LoadingComponent label="Loading Projects" />
                                ) : error ? (
                                    <li className='list-group-item'>{error}</li>
                                ) : projects.length < 1 ? (
                                    <li className='list-group-item'>
                                        Project list is empty...
                                    </li>
                                ) : (
                                    projects.map(project => {
                                        const {id, name, tasks_count} = project;
                                        return (
                                            <Link
                                                className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
                                                to={`/projects/${id}/tasks`}
                                                key={id}
                                            >
                                                {name}
                                                {tasks_count > 0 && (
                                                    <span className='badge badge-primary badge-pill'>
                                                        {tasks_count}
                                                    </span>
                                                )}

                                                {(tasks_count === '0') && (
                                                    <span className='badge badge-success badge-pill'>
                                                        Completed
                                                    </span>
                                                )}
                                            </Link>
                                        )
                                    })
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}