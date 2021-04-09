import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import firebase from '../../firebase';
import './newpost.css';

class NewPost extends Component {

    constructor(props){
        super(props);
        this.state = {
            title: '',
            img: '',
            img_data: null,
            caption: '',
            author: '',
            alertMessage: '',
            progress: 0
        };
        this.savePost = this.savePost.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    uploadImage = async () => {
        const {img_data} = this.state;
        const currentUid = firebase.getCurrentUID();
        const uploadTask = firebase.storage.ref(`images/${currentUid}/${img_data.name}`)
        .put(img_data);
        await uploadTask.on( 'state_changed',
            (snapshot ) => {
                const progress = Math.trunc(snapshot.bytesTransferred / snapshot.totalBytes * 100);
                this.setState({progress});
            },
            (error) => {
                this.setState({alertMessage: error.message});
            },
            () => {
                firebase.storage.ref(`images/${currentUid}`)
                .child(img_data.name).getDownloadURL().then((url) =>  {
                    this.setState({img: url})
                });
            }
        )

    }

    async componentDidMount(){
        if (!firebase.getCurrent()){
            this.props.history.replace('/login');
            return null;
        }
        firebase.getUserName((info) => {            
            this.setState({author: info.val().nome});
        });        
    }

    handleFile = async (e) => {  
        if (e.target.files[0]) {
            const image = e.target.files[0];
            if (image.type === 'image/png' || image.type === 'image/jpeg') {
                await this.setState(
                    {
                        alertMessage: '',
                        img_data: image,
                        progress: 0,
                        img: ''
                    }
                );
                this.uploadImage();
            } else {
                this.setState(
                    {
                        alertMessage: `The picture file should be a png or jpeg image. File type selected: ${image.type}`,
                        img_data: null,
                        img: ''
                    }
                );
            }

        }
        

    }

    savePost(e){        
        e.preventDefault();
        if (this.state.title !== '' && this.state.img !== '' && this.state.caption !== '' && this.state.author !== '') {        
            const item = {
                title: this.state.title,
                img: this.state.img,
                caption: this.state.caption,
                author: this.state.author
            };
            const posts = firebase.db.ref('blog_posts');
            const idPost = posts.push().key;
            posts.child(idPost).set(item)
            .then(() => {
                this.props.history.replace('/');
            })
            .catch((error) => {
                this.setState({alertMessage: error.message});
                console.log(error);
            })
        } else {
            this.setState({alertMessage: 'Fill all fields!'});
        }

        /*
        
        document.getElementById("new-form").reset();
        */
    }



    render(){
        return (
            <div id="new-div">
                <header id="new-header">
                    <Link to="/dashboard"> Voltar</Link>                    
                </header>
                <form id="new-form" onSubmit={this.savePost}>                     
                    <input type="file" id="img"  
                        onChange={ this.handleFile}  accept="image/*" required/>
                    {
                        this.state.img !== '' ?
                        <img src={this.state.img}  width="250" height="150"  alt="Capa do post"/> : 
                        <div>
                            {
                                this.state.img_data &&
                                <progress value={this.state.progress}  max="100"/>
                            }
                        </div>                                              

                    }
                    <label>Title:</label>
                    <input id="title" value={this.state.title}  autoFocus
                        onChange={(e)=> {this.setState({title: e.target.value})}}
                        placeholder="Post title" 
                        ></input>                                        
                    <label>Caption:</label>
                    <textarea name="caption" required placeholder="Your post description"
                        value={this.state.caption} onChange={(e) => {this.setState({caption: e.target.value})}}
                    />
                    <span id="span-erro">{this.state.alertMessage}</span>
                    <button type="submit" id="btn-submit">Save</button>
                    
                </form>
            </div>
        );
    }
}


export default  withRouter(NewPost);