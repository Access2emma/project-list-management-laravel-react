import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import classname from 'classnames';

import ImageDropZone from './ImageDropZone';

export default class NewProject extends Component {
    constructor(props){
        super(props);

        this.state = {
            name: '',
            description: '',
            makePublic: true,
            loading: false,
            errors: {}
        }
    }

    componentDidMount() {
        if(this.props.editMode){
            const {name, description, public: makePublic} = this.props.project;

            this.setState({name, description, makePublic});
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
        const target = event.target;
        const name = target.name;

        if(this.hasError(name)){
            const errors = {...this.state.errors};
            delete errors[name];
            this.setState({errors: errors})
        }

        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            [name]: value
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState((state) => ({...state, errors: {}}), function(){

            if(this.validateRequest()){
                this.setState({loading: true});
                if(this.props.editMode){
                    this.updateProject()
                }else{
                    this.createNewProject();
                }
            }
        });
    };

    createNewProject = () => {
        const {name, description, makePublic} = this.state;

        axios.post('/api/projects', {name, description, public: makePublic})
            .then(({data}) => {
                this.props.history.push('/projects');
            }).catch(error => {
            if(error.response.status === 422){
                this.setState({errors: error.response.data.errors, loading: false})
            }
        });
    };

    updateProject = () => {
        const {name, description, makePublic} = this.state;
        const projectID = this.props.project.id;

        axios.patch(`/api/projects/${projectID}`, {name, description, public: makePublic})
            .then(({data}) => {
                this.props.onUpdate(data);
            }).catch(error => {
            if(error.response  && error.response.status === 422){
                this.setState({errors: error.response.data.errors, loading: false})
            }
        });
    };

    render() {
        const {name, description, makePublic, loading} = this.state;
        const {editMode} = this.props;
        return (
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <div className="align-self-center">{editMode ? 'Edit Project' : 'Create New Project'}</div>
                            {!editMode && (
                                <Link to={'/projects'} className="btn btn-sm btn-outline-primary">&laquo; Back</Link>
                            )}
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
                                <div className="form-check form-group">
                                    <input className="form-check-input"
                                           type="checkbox"
                                           name="makePublic"
                                           id="public-project"
                                           checked={makePublic}
                                           onChange={this.handleChange}
                                    />
                                        <label className="form-check-label" htmlFor="public-project">
                                            Make Public Project?
                                        </label>
                                </div>

                                <div className="form-group">
                                    <label>Upload project image</label>
                                    <ImageDropZone />
                                </div>

                                <div className="form-group">
                                    
                                    <button type="submit" className="btn btn-primary">{
                                        loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Waiting...
                                            </>
                                        ) : (
                                            editMode ? 'Update Project' : 'Create Project'
                                        )
                                    }</button>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}