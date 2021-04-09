import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyBVDuwh5qtAeA3kN1159gxrsYyDXeqRMwU",
    authDomain: "reactapp-b63f2.firebaseapp.com",
    databaseURL: "https://reactapp-b63f2-default-rtdb.firebaseio.com",
    projectId: "reactapp-b63f2",
    storageBucket: "reactapp-b63f2.appspot.com",
    messagingSenderId: "204133798102",
    appId: "1:204133798102:web:9198bab7c279d100bc3977",
    measurementId: "G-YHL0MRWBLG"
};


class Firebase {

    constructor(){
        if (!app.apps.length) {
            app.initializeApp(firebaseConfig);        
            
        }        
        this.db = app.database();            
        this.storage = app.storage();
    }

    login(email, password) {
        return app.auth().signInWithEmailAndPassword(email, password);
    }

    logout(){
        return app.auth().signOut();
    }

    async register(nome, email, password){
        await app.auth().createUserWithEmailAndPassword(email, password);
        const uid = app.auth().currentUser.uid;
        return app.database().ref('blog_user').child(uid).set({
            nome: nome,
            email: email
        });
    }

    isInitialized(){
        return new Promise(resolve =>  {
            app.auth().onAuthStateChanged(resolve);
        });
    }

    getCurrent(){
        return app.auth().currentUser && app.auth().currentUser.email;
    }

    getCurrentUID(){
        return app.auth().currentUser && app.auth().currentUser.uid;
    }


    async getUserName(callback) {

        if (!app.auth().currentUser) {
            return null;
        } 
        const uid = app.auth().currentUser.uid;
        await this.db.ref('blog_user').child(uid).once('value')
        .then(callback);
    }

}


export default new Firebase();