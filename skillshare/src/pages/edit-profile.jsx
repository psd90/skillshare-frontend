import Axios from 'axios';
import React from 'react'
import { AuthContext } from "../Auth";
import firebase from "firebase";
import PropTypes from "prop-types";
import Header from '../components/header'

class EditProfile extends React.Component{
    state = {
        isLoading: true,
        skills: {},
        profile: {
            image: null,
            name: null,
            location: null,
            info: null,
        },
        teachingSkills: {},
        learningSkills: {},
        newTeachingSkills: {},
        newLearningSkills: {},
        error: false,
        user: {},
        userImage: 'https://www.scrgrowthhub.co.uk/wp-content/uploads/placeholder-user-400x400-1.png'
    }

    static contextType = AuthContext;

    componentDidMount() {
        Axios.get('https://firebasing-testing.firebaseio.com/skills.json')
        .then(skillList => {
            const userInfo = Axios.get(`https://firebasing-testing.firebaseio.com/users/${this.context.currentUser.uid}.json`)
            const userImage = firebase.storage().ref(`users/${this.context.currentUser.uid}/profile.jpg`).getDownloadURL()
            const teachingSkills = Axios.get(`https://firebasing-testing.firebaseio.com/users_teaching_skills/${this.context.currentUser.uid}.json`);
            const learningSkills = Axios.get(`https://firebasing-testing.firebaseio.com/users_desired_skills/${this.context.currentUser.uid}.json`);
            Promise.all([userInfo, skillList, userImage, teachingSkills, learningSkills])
            .then(([userInfo, skillList, userImage, teachingSkills, learningSkills]) => {
                this.setState(
                    {
                        isLoading: false, 
                        skills: skillList.data, 
                        user: userInfo.data, 
                        userImage, 
                        teachingSkills: teachingSkills.data, 
                        learningSkills: learningSkills.data,
                        profile: {
                            image: userImage, 
                            name: userInfo.data.name, 
                            location: userInfo.data.location, 
                            info: userInfo.data.info,
                            friends: userInfo.data.friends ? userInfo.data.friends : [],
                            teacher_ratings: userInfo.data.teacher_ratings ? userInfo.data.teacher_ratings : [],
                            student_ratings: userInfo.data.student_ratings ? userInfo.data.student_ratings : [],
                        }
                    })
            })
        })
    }

    changeImageFile = (event) => {
        this.setState((prevState) => {
            const newProfile = {...prevState.profile};
            newProfile.image = event.target.files[0];
            return {profile : newProfile};
        });
    }

    handleSubmit = () => {

        const { image, name, location, info } = this.state.profile
        const { teachingSkills, learningSkills, newTeachingSkills, newLearningSkills } = this.state;

        if(!image || !name || !location || !info) {
            this.setState({error: 'Image, Name, Location, Bio must all be filled in'});
        } else if(!Object.keys(teachingSkills).length && !Object.keys(newTeachingSkills).length) {
            this.setState({error: 'Please select a teaching skill'});
        } else if (!Object.keys(learningSkills).length && !Object.keys(newLearningSkills).length) {
            this.setState({error: 'Please select a learning skill'});
        }
        else {
        const user = this;
        let newLearningSkillsPatch;
        let newTeachingSkillsPatch;
        if(Object.keys(this.state.newLearningSkills).length) {
          newLearningSkillsPatch = Object.keys(this.state.newLearningSkills).map(Skill =>
              Axios.patch(`https://firebasing-testing.firebaseio.com/skills/${Skill}.json`, this.state.newLearningSkills[Skill]))
        }
        if(Object.keys(this.state.newTeachingSkills).length) {
          newTeachingSkillsPatch = Object.keys(this.state.newTeachingSkills).map(Skill =>
            Axios.patch(`https://firebasing-testing.firebaseio.com/skills/${Skill}.json`, this.state.newTeachingSkills[Skill]))
        }
        Promise.all([newLearningSkillsPatch, newTeachingSkillsPatch])
        .then(()=>{
        Axios.get(`https://api.postcodes.io/postcodes/${this.state.profile.location}`)
        .then(res => { 
            this.setState((prevState) => {
                const newProfile = {...prevState.profile};
                newProfile.location = {
                    latitude: res.data.result.latitude,
                    longitude: res.data.result.longitude,
                    nuts: res.data.result.nuts,
                    postcode: res.data.result.postcode,
                }
                return {profile : newProfile};
            })
        })
        .catch(err => {
            this.setState({error: err.response.data.error});
        })
        .then(() => {
            Axios.patch(`https://firebasing-testing.firebaseio.com/users/${user.context.currentUser.uid}.json`, 
            {
                    name: this.state.profile.name, 
                    location: this.state.profile.location, 
                    info: this.state.profile.info,
                    role: "Member",
                    welcomeMessage: `Hi this is ${this.state.profile.name}!`,
                    friends: this.state.profile.friends,
                    teacher_ratings: this.state.profile.teacher_ratings,
                    student_ratings: this.state.profile.student_ratings,
                }
            )
        })
        .then(() => 
        firebase.storage().ref(`/users/${user.context.currentUser.uid}/profile.jpg`).put(this.state.profile.image)
        .then(() => {
            Axios.put(`https://firebasing-testing.firebaseio.com/users_teaching_skills/${user.context.currentUser.uid}.json`, 
            this.state.teachingSkills)
        }).then(() => {
            let newTeachingPromises
            if(Object.keys(this.state.newTeachingSkills).length){ 
                newTeachingPromises = Object.keys(this.state.newTeachingSkills).map(category => {
                    Axios.patch(`https://firebasing-testing.firebaseio.com/users_teaching_skills/${user.context.currentUser.uid}.json`, 
                    this.state.newTeachingSkills[category])
                })  
            }
            Promise.all([newTeachingPromises])
            .then(()=> {
            const teachingPromises = Object.keys(this.state.teachingSkills).map(skill => {
                Axios.patch(`https://firebasing-testing.firebaseio.com/teaching_skills/${skill}.json`,
                 {[user.context.currentUser.uid]: true})
            })
            Promise.all(teachingPromises).then(()=> {
                let newTeachingSkills
                if(Object.keys(this.state.newTeachingSkills).length){
                    newTeachingSkills = Object.keys(this.state.newTeachingSkills).map(category => {
                        Axios.patch(`https://firebasing-testing.firebaseio.com/teaching_skills.json`, 
                        {[Object.keys(this.state.newTeachingSkills[category])[0]] : {[user.context.currentUser.uid]: true}})
                    })
                }
                Promise.all([newTeachingSkills])
            })
            .then(()=> {
                Axios.put(`https://firebasing-testing.firebaseio.com/users_desired_skills/${user.context.currentUser.uid}.json`,
                this.state.learningSkills)
            })
            .then(()=> {
                let newDesiredPromises;
            if(Object.keys(this.state.newLearningSkills).length){ 
                newDesiredPromises = Object.keys(this.state.newLearningSkills).map(category => {
                    Axios.patch(`https://firebasing-testing.firebaseio.com/users_desired_skills/${user.context.currentUser.uid}.json`, 
                    this.state.newLearningSkills[category])
                })  
            }
            Promise.all([newDesiredPromises])
            .then(() => {
                const learningPromises = Object.keys(this.state.learningSkills).map(skill => {
                    Axios.patch(`https://firebasing-testing.firebaseio.com/desired_skills/${skill}.json`,
                    {[user.context.currentUser.uid]: true})
                })
                Promise.all(learningPromises)
                .then(() => {
                    let newDesiredSkills
                    if(Object.keys(this.state.newLearningSkills).length){
                        newDesiredSkills = Object.keys(this.state.newLearningSkills).map(category => 
                            Axios.patch(`https://firebasing-testing.firebaseio.com/desired_skills.json`, 
                            {[Object.keys(this.state.newLearningSkills[category])[0]] : {[user.context.currentUser.uid]: true}}
                        )
                        )}
                    Promise.all([newDesiredSkills])
                })
                .then(() => {
                    this.props.history.push("/");
                })
            })
            })
        })
        })
        )}
        )
    }}
   
    handleChange = (event) => {
        console.log(this.state.profile);
         this.setState((prevState) => {
             const newProfile = {...prevState.profile};
             newProfile[event.target.id] = event.target.value;
             return {profile: newProfile};
         });
    }

    addTeachingSkill = (event) => {
        this.setState(prevState => {
            const newTeachingSkills = {...prevState.teachingSkills};
            if(prevState.teachingSkills[event.target.value]){
                delete newTeachingSkills[event.target.value]
                return {teachingSkills: newTeachingSkills}
            }else{
             newTeachingSkills[event.target.value] = true;
             return {teachingSkills: newTeachingSkills}
            }
        })
        console.log(this.state.teachingSkills)
    }

    addLearningSkill = (event) => {
        const element = document.getElementById(event.target.value);
        console.log(element);
        this.setState(prevState => {
            const newLearningSkills = {...prevState.learningSkills};
            if(prevState.learningSkills[event.target.value]){
                delete newLearningSkills[event.target.value]
                return {learningSkills: newLearningSkills}
            }else{
                newLearningSkills[event.target.value] = true;
                return {learningSkills: newLearningSkills}
            }
        })
    }

    addNewTeachingSkill = (event) => {
        console.log(this.state.newTeachingSkills);
        this.setState(prevState => {
            const newTeachingSkills = {...prevState.newTeachingSkills};
            newTeachingSkills[event.target.id]={[event.target.value]: true};
            return {newTeachingSkills}
        })

    }

    addNewLearningSkill = (event) => {
        console.log(this.state.newLearningSkills);
        this.setState(prevState => {
            const newLearningSkills = {...prevState.newLearningSkills};
            newLearningSkills[event.target.id]={[event.target.value]: true};
            return {newLearningSkills}
        })

    }

    render(){
        console.log(this.state);
        if(this.state.isLoading) return <p>loading...</p>
        else return(
            <div id="create-profile-page">
                 <Header />
        <div className="buffer"></div>
                <h1 id='makeProfileHeading' >Edit Your Profile</h1>
                <div id="select-image-div">
                <img id="edit-profile-image" src={this.state.userImage}/>
                <input type="file" id='chooseFile' onChange={this.changeImageFile}></input>
                </div>
                <div id="name-location-bio-inputs">
                    <p><input id="name" placeholder={`Name: ${this.state.user.name}`} onChange = {this.handleChange} className="edit-profile-inputs"></input></p>
                    <p><input placeholder={`Postcode: ${this.state.user.location.postcode}`} id="location" onChange = {this.handleChange} className="edit-profile-inputs"></input></p>
                    <p><textarea id="info" placeholder={`Bio: ${this.state.user.info}`}onChange = {this.handleChange} className="edit-profile-inputs"></textarea></p>
                </div>
                <div className="edit-skills">
                    <h2 className='centreItems'>What are your skills?</h2>
                    <br />
                    <h3 className='centreItems'>Categories</h3>
                    <div className="edit-skills-buttons">
                        {Object.keys(this.state.skills).map(category => {
                            return (
                                <>
                                    <h4 value={category} key={category}>{category}</h4>
                                    {Object.keys(this.state.skills[category]).map(skill => {
                                        return <button  className={Object.keys(this.state.teachingSkills).includes(skill) ? "selectedSkillsButton" : "unselectedSkillsButton"} value={skill} key={skill} onClick={this.addTeachingSkill}>{skill}</button>
                                    })}
                                    <p><label><input id={category} placeholder='Other' onChange={this.addNewTeachingSkill} className="edit-profile-inputs specific-skill-other"></input></label></p>
                                </>
                            );
                        })}
                    </div>         
                </div>
                <div className="edit-skills"> 
                    <h2 className='centreItems'>What Skills Would You Like to Learn?</h2>
                    <br />
                    <h3 className='centreItems'>Categories</h3>
                    <div className="edit-skills-buttons">
                        {Object.keys(this.state.skills).map(category => {
                            return ( 
                                <>
                            <h4 key={category}>{category}</h4>
                            {Object.keys(this.state.skills[category]).map(skill => {
                                    return <button className={Object.keys(this.state.learningSkills).includes(skill) ? "selectedSkillsButton" : "unselectedSkillsButton"} value={skill} key={skill} onClick={this.addLearningSkill}>{skill}</button>
                                })}
                                <p><label>Other: <input id={category} onChange={this.addNewLearningSkill} className="edit-profile-inputs specific-skill-other"></input></label></p>
                            </>
                        )})}
                    </div>                    
                </div>
                {this.state.error ? <p className="profile-error-message">{this.state.error}</p> : null}
                <button onClick={this.handleSubmit}id="edit-complete-button">Complete</button>
            </div>
        )
    }
}

EditProfile.propTypes = {
    history: PropTypes.node,
  };

export default EditProfile