var React = require('react');
var Link = require('react-router').Link;
var ClientActions = require('../actions/ClientActions');
var SessionStore = require('../stores/SessionStore');
var SessionApiUtil = require('../util/SessionApiUtil');
var ProjectsIndexItem = require('./ProjectsIndexItem');
var ProjectsStore = require('../stores/ProjectsStore');
var TasksIndex = require('./TasksIndex');
var TasksStore = require('../stores/TasksStore');
var NewProjectsForm = require('./NewProjectsForm');


var ProjectsIndex = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      projects: "",
      mousedOver: false };
  },

  onChange: function () {
    var currentUser = SessionStore.currentUser();
    var projects = ProjectsStore.all()
    if (currentUser && projects) {
      var filteredProjects = [];
      projects.forEach( function(project) {
        project.users.forEach(function (user){
          if (user.id === currentUser.id){
            filteredProjects.push(project)
          }
        })
      })
      this.setState({ projects: filteredProjects })
    } else {
      this.setState({ projects: projects})
    }

    if (ProjectsStore.mostRecentProject().id){
      this.context.router.push("/user/projects/" + ProjectsStore.mostRecentProject().id)
    } else if (filteredProjects.length > 0){
      this.context.router.push("/user/projects/" + filteredProjects[0].id)
    } else {
      this.context.router.push("/user/projects")
    }
  },


  componentDidMount: function () {
    this.projectsListener = ProjectsStore.addListener(this.onChange)
    this.sessionListener = SessionStore.addListener(this.forceUpdate.bind(this), this.onChange)
    ClientActions.fetchAllProjects();
  },


  componentWillUnmount: function () {
    this.projectsListener.remove();
    this.sessionListener.remove();
  },

  newProject: function (event) {
    event.preventDefault();
    this.setState({ clicked: true })
    this.context.router.push("/user/projects/new")
  },

  mouseOver: function (event) {
    event.preventDefault()
    this.setState({mousedOver: true})
  },

  mouseLeave: function (event) {
    event.preventDefault()
    this.setState({ mousedOver: false })
  },

  render: function () {
    var projects;
    var logout = <span></span>;

    if (this.props.location.pathname === "/user/projects") {
      logout =
        <button
          className="logout-projects"
          type="submit"
          onClick={ SessionApiUtil.logout }>Log Out</button>

    }

    if (this.state.projects.length < 1 &&
        this.props.location.pathname !== "/user/projects" &&
        this.props.location.pathname !== "/user/projects/new"){
      projects = ProjectsStore.all();
    } else {
      projects = this.state.projects;
    }

    var item = <div></div>;
    if (projects && projects.length > 0) {

      item = (
        projects.map(function (project) {
          return <ProjectsIndexItem project={ project } key={ project.id }/>
        })
      )
    }

    var user = SessionStore.currentUser().username ? SessionStore.currentUser().username : [];
    var user = user.slice(0, 2);

    var children = React.Children.map(this.props.children, function (child, i) {
      return React.cloneElement(child, {
        user: SessionStore.currentUser(),
        key: i
      })
    });

  var newProject = <div></div>;

  if (this.state.mousedOver){
    newProject = <div>Create a New Project</div>
  }

      return (
        <div className="whole-page group">
          <div className="sidebar">
            <img src={window.landing_logo_url} />
            <button onClick={this.newProject} onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave} className="new-project-button">+</button>
            { newProject }
            <ul className="project-list">
              {
                item
              }
            </ul>
          </div>
          <div className="upward-dog-main group">
            {logout}
            <div>{ children }</div>
            <img className="background" src={window.background_url} />
          </div>
        </div>
      )
  }
});

module.exports = ProjectsIndex;
