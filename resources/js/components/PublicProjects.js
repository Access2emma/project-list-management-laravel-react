import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import { withToastManager } from 'react-toast-notifications';

import LoadingComponent from './Loading';

class PublicProjects extends Component {
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
                this.props.toastManager.add('Public Project has been created', {
                    appearance: 'success',
                    autoDismiss: true
                });
            })
            .listen('.project.deleted', (e) => {
                this.setState( ({projects}) => ({
                    projects: projects.filter(project => project.id !== e.project.id)
                }));
                this.props.toastManager.add(`Project deleted: ${e.project.name}`, {
                    appearance: 'success',
                    autoDismiss: true
                });
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

    renderProjects = (projects) => {
        if(projects.length < 1) {
            return (
                <li className='list-group-item'>Project list is empty...</li>
            );
        }

        return (
            <ul className="list-unstyled">
                {projects.map(project => {
                    const {id, name, description, owner} = project;
                    return (
                        <Link to={`/projects/${project.id}/tasks`} className="media text-decoration-none mb-3" key={id}>
                            <img src={owner.photo} alt="Creator Image" className="mr-3" width="50" height="50" title={owner.name} />
                            <div className="media-body text-dark">
                                <h5 className="mt-0 mb-1">{name}</h5>
                                {description}
                            </div>
                        </Link>
                    )
                })}
            </ul>
        )
    }

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
                                ) : this.renderProjects(projects)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withToastManager(PublicProjects);