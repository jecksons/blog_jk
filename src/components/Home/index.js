import React, {Children, Component} from 'react';
import './home.css';
import firebase from '../../firebase';



class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            posts: []
        };
    }

    componentDidMount(){
        firebase.db.ref('blog_posts').once('value', (snapshot) => {
            let state = this.state;
            state.posts = [];
            snapshot.forEach((item) => {
                state.posts.push({
                    key: item.key,
                    title: item.val().title,
                    img: item.val().img,
                    caption: item.val().caption ,
                    author: item.val().author
                });
            });
            state.posts.reverse();
            this.setState(state);
        });
    }

    render(){
        return (
            <section id="post">
                {this.state.posts.map((post) => {
                    return (
                        <article key={post.key}>
                            <header>
                                <div className="title">
                                    <strong>{post.title}</strong>
                                    <span>Autor: {post.author}</span>
                                </div>
                            </header>
                            <img src={post.img} alt="Post image"/>
                            <footer>
                                <p>{post.caption}</p>
                            </footer>
                        </article>


                    );
                })}
            </section>
        )
    }
}


export default Home;
