import React, {PureComponent} from 'react';
import classname from 'classnames';

export default class ImageDropZone extends PureComponent{
    static defaultProps = {
        maxImages: 5
    };

    constructor(props){
        super(props);

        this.state = {
            images: [],
            dragDropSupport: false,
            dragging: false
        };

        this.acceptableFormat = ['image/jpeg', 'image/jpg', 'image/png'];

        this.dropzoneInput = React.createRef();
    }

    componentDidMount(){
        this.checkDragAndDropSupport();
    }

    checkDragAndDropSupport = () => {
        const div = document.createElement('div');

        var dragDropSupport = 'ondragstart' in div && 'ondrop' in div && 'FormData' in window && 'FileReader' in window;

        this.setState({dragDropSupport});
    };

    handleInputClick = () => {
        this.dropzoneInput.current.click();
    };

    onDragOver = (event) => {
        event.preventDefault();

        if(! this.state.dragDropSupport) return;

        this.setState({dragging: true})
    };

    onDragLeave = () => {
        this.setState({dragging: false})
    };

    onDrop = (event) => {
        event.preventDefault();
        this.setState({dragging: false});

        if(! this.state.dragDropSupport) return;

        this.addImages(event.dataTransfer.files);
    };

    addImages = (images) => {
        const image = images[0];
        const {maxImages} = this.props;
        if(this.state.images.length >= maxImages){
            return alert('You already have maximum images...');
        }
        if(image){
            if(this.acceptableFormat.includes(image.type)){
                // const reader = new FileReader();
                // reader.onload = (e) => {
                //     console.log(e.target.result)
                // };
                // reader.readAsDataURL(image);

                this.setState(({images}) => ({
                    images: [...images, image]
                }));
            }else{
                return alert("You uploaded invalid file...");
            }
        }
    };

    handleImageChange = (event) => {
        this.addImages(event.target.files);
    };

    showUploadedImages = () => {
        const { images } = this.state;

        return (
            <div className="my-2 text-center">
                {images.length === 1 ? images[0].name : `${images.length} files selected`}
            </div>
        );
    };

    render(){
        const {images, dragging, dragDropSupport} = this.state;
        return (
            <>
            <div
                className={classname("dropzone", {'draggable': dragDropSupport, 'highlight': dragging})}
                onClick={this.handleInputClick}
                onDrop={this.onDrop}
                onDragOver={this.onDragOver}
                onDragLeave={this.onDragLeave}
                onChange={this.handleImageChange}
            >
                <input type='file' className="file-input" ref={this.dropzoneInput} accept="image/*"/>
                <p
                    className='description'
                >Choose a file <span className="drag-description"> or drag it here.</span></p>
            </div>
                {!!images.length && this.showUploadedImages()}
            </>
        )
    }
}