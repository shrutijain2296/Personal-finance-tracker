import React, {useState} from 'react'
import "./styles.css";
import Input from '../Input';
import Button from '../Button';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from 'react-toastify';
import {auth, db, provider} from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function SignUpSignInComponent() {
  const[name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(false);

//   navigate the user when they signup/login
const navigate = useNavigate();

  function signUpWithEmail(){
    setLoading(true);
    console.log(name, email, password);
    // Authenticate the user (create a new account using email & password)
    if(name != "" && email != "" && password != "" && confirmPassword != ""){
        if(password == confirmPassword){
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("User>>>", user);
                toast.success("User Signed Up Successfully!")
                setLoading(false);
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                createDoc(user);
                // Create a doc with user id as the following id
                navigate("/dashboard")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorMessage);
                setLoading(false)
                // ..
            });
        }
        else{
            toast.error("Password and Confirm Password don't match!")
            setLoading(false)
        }
       
    }
    else{
        toast.error("All fields are mandatory!");
        setLoading(false)
    }
  }

  function loginWithEmail(){
    setLoading(true);
    console.log(email);
    console.log(password);
    if(email != "" && password != ""){
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed in 
            const user = userCredential.user;
            toast.success("User Logged In Succesfully!")
            console.log("User logged in", user)
            // createDoc(user);
            navigate("/dashboard")
            setLoading(false);
        // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
        });
    }
    else{
        toast.error("All fields are mandatory!, ")
        setLoading(false);
    }
  }

  async function createDoc(user){
    setLoading(true);
    // make sure that the doc with uid dosen't exist
    // Create a doc
    if(!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    console.log(userData);
    if(!userData.exists()){
        try{
            await setDoc(doc(db, "users", user.uid), { 
                name: user.displayName ? user.displayName : name,
                email: user.email,
                photoURL: user.photoURL ? user.photoURL : "",
                createdAt: new Date(),
            });
            // toast.success("Doc created");
            setLoading(false);
            console.log("Doc created")
        }
        catch (e){
            toast.error(e.message);
            setLoading(false);
        }
    }
    else{
        // toast.error("Doc already exist!")
        setLoading(false);
    }   
  }

  function googleAuth(){
    setLoading(true);
    try{
        signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log("user>>>", user);
          createDoc(user);
          setLoading(false);
          toast.success("User Authenticated!");
          navigate("/dashboard");
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        }).catch((error) => {
          // Handle Errors here.
          setLoading(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
        });
      
    }catch(e){
        setLoading(false);
        toast.error(e.message);
    }
   
  }

  return (
    <>
        {login ? (
             <div className='signup-wrapper'> 
             <h2 className='title'>
                 Login on <span style = {{color: "var(--theme)"}}>Financely.</span>
             </h2>
             <form>
                  <Input 
                     label = {'Email'} 
                     type = "email"
                     state = {email} 
                     setState={setEmail} 
                     placeholder={"johndoe@gmail.com"}
                 />
                  <Input 
                     label = {'Password'} 
                     type = "password"
                     state = {password} 
                     setState={setPassword} 
                     placeholder={"********"}
                 />
                
                 <Button disabled = {loading}
                     text = {loading ? "Loading..." : "Login using Email and password"} onClick = {loginWithEmail}
                 />
                 <p className='p-login'>or</p>
                 <Button  onClick = {googleAuth} text = {loading ? "Loading..." : "Login using Google"}  blue = {true}/>
                 <p className='p-login' style = {{cursor: "pointer"}} onClick = {() => setLogin(!login)}>Or Don't Have an Account ? Click Here</p>
             </form>
         </div>
        ) : (
        <div className='signup-wrapper'> 
            <h2 className='title'>
                Sign Up on <span style = {{color: "var(--theme)"}}>Financely.</span>
            </h2>
            <form>
                <Input 
                    label = {'Full Name'} 
                    type = "text"
                    state = {name} 
                    setState={setName} 
                    placeholder={"John Doe"}
                />
                <Input 
                    label = {'Email'} 
                    type = "email"
                    state = {email} 
                    setState={setEmail} 
                    placeholder={"johndoe@gmail.com"}
                />
                <Input 
                    label = {'Password'} 
                    type = "password"
                    state = {password} 
                    setState={setPassword} 
                    placeholder={"********"}
                />
                <Input 
                    label = {'Confirm Password'}
                    type = "password" 
                    state = {confirmPassword} 
                    setState={setConfirmPassword} 
                    placeholder={"********"}
                />
                <Button disabled = {loading}
                    text = {loading ? "Loading..." : "Signup using Email and password"} onClick = {signUpWithEmail}
                />
                <p className='p-login'>or</p>
                <Button onClick = {googleAuth} text = {loading ? "Loading..." : "Signup using Google"}  blue = {true}/>
                <p className='p-login' style = {{cursor: "pointer"}} onClick = {() => setLogin(!login)}>Or Have an Account Already? Click Here</p>
            </form>
        </div>
        )}
    </>
    
  );
}

export default SignUpSignInComponent;