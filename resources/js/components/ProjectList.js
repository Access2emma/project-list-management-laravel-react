import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";

import LoadingComponent from './Loading';

export default class ProjectList extends Component {
    constructor(props){
        super(props);

        this.state = {
            projects: [],
            loading: true
        }
    }

    componentDidMount() {
        axios.get('/api/projects').then(({data}) => {
            this.setState({projects: data.data, loading: false})
        }).catch(error => {
            console.log("Some error occurred: ", error);
        })
    }

    render(){
        const {projects, loading} = this.state;

        return (
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <div className="align-self-center">All Project List</div>
                            <Link className='btn btn-primary btn-sm' to='/projects/create'>New Project</Link>
                        </div>

                        <div className="card-body">
                            <ul className='list-group list-group-flush'>
                                { loading || projects.length < 1 ? (
                                    <LoadingComponent label="Loading Projects" />
                                ): (
                                    projects.map(project => {
                                        const {id, name, completed, tasks_count} = project;
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

                                                {(completed === 1 || tasks_count === '0') && (
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