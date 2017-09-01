 import React from 'react';
import ReactDOM from 'react-dom';
import {Education} from '../Education.jsx';
import {SVGStylish} from '../svg/SVGStylish.jsx';
import {Section} from '../Section.jsx';
import {SideBlock} from '../SideBlock.jsx';
import {Navigator} from '../../utils/navigator.js';
import {Fixed} from '../Fixed.jsx';
var _ = require('lodash');

import VelocityTransitionGroup from 'velocity-react/velocity-transition-group';
import stylish from '../../pages/assets/stylish.svg';
import {slugify} from '../../utils/strings.js'


export class EducationList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isEducationSelected: false,
      currentEducation: ''
    };

  }

  scrollToSectionTop(){
    var node = ReactDOM.findDOMNode(this);
    var elementBox = node.getBoundingClientRect();
    //window.scroll(0, elementBox.top);
  }
  handleSelectEducation(e, currentEducation){

    ((window.isMobile)?
      Navigator
        .scrollTo(currentEducation.id)
      :
      Navigator
        .scrollTo(this.props.section_name)
    )
      .then(()=>{
        this.setState({
          isEducationSelected: true,
          currentEducation : currentEducation
        })
      })


    this.props.onEducationOpen && this.props.onEducationOpen(e,currentEducation);
  }
  handleGoToEducation(pid){
    Navigator.scrollTo(pid);
  }
  handleCloseEducation(){
    ((window.isMobile)?
      Navigator
        .scrollTo(this.state.currentEducation.id)
      :
      Navigator
        .scrollTo(this.props.section_name)
    )
      .then(()=>{
        this.setState({
          isEducationSelected:false,
          currentEducation:''
        })
      })

  }

  render(){
    const isSmallScreen = this.windowWidth<800 || this.props.isSmallScreen;

    let opensource = []
    let educations = this.props.educations.map((education, i)=>{
      let educationId = Navigator.genId([this.props.section_name,education.data.title]);
      if(education.data.type.toLowerCase() == 'opensource') {
          if(opensource.length !== 0) opensource.push(<span className="middotDivider"
          key={opensource.length+1}></span>);
          opensource.push(<span
            style={{cursor:'pointer', textDecoration:'underline'}}
            onClick={this.handleGoToEducation.bind(this, educationId)}
            key={education.data.title+i}>{education.data.title}</span>)
      }
      if(!this.state.isEducationSelected) {
        return (<Education {...education}
          id={educationId}
          onClick={this.handleSelectEducation.bind(this)}
          key={education.data.title}/>)
      }

      if(this.state.isEducationSelected && this.state.currentEducation && education.data.title == this.state.currentEducation.title){
        return (<Education {...education}
          id={educationId}
          onClose={this.handleCloseEducation.bind(this)}
          currentEducation = {Education.data.title == this.state.currentEducation.title}
          isEducationSelected = {this.state.isEducationSelected}
          onClick={this.handleSelectEducation.bind(this)}
          key={education.data.title}/>)
        }
      });

    return(<Section
      {...this.props}
      parentName = {this.constructor.displayName || constructor.name || undefined}

      isOpen={this.state.isEducationSelected}
      openItem = {this.state.currentEducation}
      fixed_column={<SideBlock {...this.props}>
        <div>
          <div><i className="icon-book-open" style={{color:'#160fd1'}}/></div>
          <div className="section-title" >My Education</div>
        </div>
      </SideBlock>
      }
      onCloseItem={this.handleCloseEducation.bind(this)}
      >
      <div style={{borderBottom:'5px solid #0C1926', background:'#160fd1'}}>
        <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
          {educations}
        </VelocityTransitionGroup>
      </div>
    </Section>)
  }
}
