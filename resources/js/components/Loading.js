import React from 'react';
import classname from 'classnames';

const Loading = ({theme='primary', label=false}) => (
    <div className="d-flex justify-content-center">
        <div className={classname("spinner-border", `text-${theme}`)} role="status">
            <span className="sr-only">Loading...</span>
        </div>
        {label && (
            <div className="ml-2 align-self-center">{label}</div>
        )}
    </div>
);

export default Loading;