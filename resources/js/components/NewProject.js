import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import classname from 'classnames';

export default class NewProject extends Component {
    constructor(props){
        super(props);

        this.state = {
            name: '',
            description: '',
            errors: {}
        }
    }

    hasError = (field) => {
        const {errors} = this.state;
        return errors && errors[field];
    };

    getError = (field) => {
        if(this.hasError(field)){
            return this.state.errors[field][0];
        }
    };

    validateRequest = () => {
        const {name, description} = this.state;

        if(name.length < 1){
            this.setState({
                errors: {...this.state.errors, name: ['Project name cannot be empty']}
            });

            return false;
        }

        if(description.length < 1){
            this.setState({
                errors: {...this.state.errors, description: ['Project description cannot be empty']}
            });

            return false;
        }

        return true;
    };

    handleChange = (e) => {
        const target = e.target.name;

        if(this.hasError(target)){
            const errors = {...this.state.errors};
            delete errors[target];
            this.setState({errors: errors})
        }
        this.setState({[target]: e.target.value})
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState((state) => ({...state, errors: {}}), function(){

            if(this.validateRequest()){
                const {name, description} = this.state;

                axios.post('/api/projects', {name, description})
                    .then(({data}) => {
                        this.props.history.push('/projects');
                    }).catch(error => {
                    if(error.response.status === 422){
                        this.setState({errors: error.response.data.errors})
                    }
                });
            }
        });
    };


    render() {
        const {name, description} = this.state;
        return (
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <div className="align-self-center">Create New Project</div>
                            <Link to={'/projects'} className="btn btn-sm btn-outline-primary">&laquo; Back</Link>
                        </div>

                        <div className="card-body">
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Project Name</label>
                                    <input
                                        id='name'
                                        type='text'
                                        name='name'
                                        value={name}
                                        onChange={this.handleChange}
                                        className={classname("form-control", {'is-invalid': this.hasError('name')})}
                                    />

                                    {
                                        this.hasError('name') && (<span className="invalid-feedback" role="alert"><strong>{this.getError('name')}</strong></span>)
                                    }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Project Description</label>
                                    <textarea
                                        id='description'
                                        name='description'
                                        value={description}
                                        onChange={this.handleChange}
                                        className={classname("form-control", {'is-invalid': this.hasError('description')})}
                                    />

                                    {
                                        this.hasError('description') && (<span className="invalid-feedback" role="alert"><strong>{this.getError('description')}</strong></span>)
                                    }
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary">Create Project</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}