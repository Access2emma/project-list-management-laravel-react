import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProjectList from "./components/ProjectList";
import NewProject from './components/NewProject';
import TaskList from "./components/TaskList";
import PublicProjects from "./components/PublicProjects";

export default class ProjectApp extends Component{

    render(){
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={PublicProjects} />
                    <Route exact path="/projects" component={ProjectList} />
                    <Route path="/projects/create" component={NewProject} />
                    <Route path="/projects/:project/tasks" component={TaskList} />
                </Switch>
            </BrowserRouter>
        );
    }
}

if (document.getElementById('root')) {
    ReactDOM.render(<ProjectApp />, document.getElementById('root'));
}