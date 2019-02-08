import React, {Component} from 'react';
import classname from 'classnames';

export default class CreateTask extends Component{
    constructor(props){
        super(props);

        this.state = {loading: false, title: '', description: '', errors: {}}
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

        this.setState((state) => ({...state, errors: {}, loading: true}), function(){
            const {title, description} = this.state;

            if(title.length < 1){
                return this.setState({
                    errors: {...this.state.errors, title: ['Task title cannot be empty']},
                    loading: false
                });
            }

            if(description.length < 1){
                return this.setState({
                    errors: {...this.state.errors, description: ['Task description cannot be empty']},
                    loading: false
                });
            }

            axios.post(`/api/tasks`, {title, description, 'project_id': this.props.projectID})
                .then(({data}) => {
                    this.setState({loading: false, title: '', description: ''});
                    this.props.onTaskCreated(data.data);
                }).catch(error => {
                if(error.response.status === 422){
                    this.setState({errors: error.response.data.errors})
                }
            });
        });
    };

    render(){
        const {loading, title, description} = this.state;

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                <label htmlFor="title">Task Title</label>
                <input type="text" className="form-control" id="title" placeholder="Enter Title"
                       name="title"
                       value={title}
                       onChange={this.handleChange}
                       className={classname("form-control", {'is-invalid': this.hasError('title')})}
                />
                    {this.hasError('title') && (<span className="invalid-feedback" role="alert"><strong>{this.getError('title')}</strong></span>)}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Task description</label>
                    <textarea id="description"
                              name='description'
                              value={description}
                              onChange={this.handleChange}
                              className={classname("form-control", {'is-invalid': this.hasError('description')})}
                    ></textarea>
                    {this.hasError('description') && (<span className="invalid-feedback" role="alert"><strong>{this.getError('description')}</strong></span>)}
                </div>

                <button type="submit" className="btn btn-primary">{
                    !loading ? 'Add Task' : (
                        <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Waiting...
                        </>
                    )
                }</button>
            </form>
        )
    }
}