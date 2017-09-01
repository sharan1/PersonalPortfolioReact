import React from 'react';
import ReactDOM from 'react-dom';
import {Work} from '../Work.jsx';
import {SVGStylish} from '../svg/SVGStylish.jsx';
import {Section} from '../Section.jsx';
import {SideBlock} from '../SideBlock.jsx';
import {Navigator} from '../../utils/navigator.js';
import {Fixed} from '../Fixed.jsx';
var _ = require('lodash');

import VelocityTransitionGroup from 'velocity-react/velocity-transition-group';
import stylish from '../../pages/assets/stylish.svg';
import {slugify} from '../../utils/strings.js'


export class WorkList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isWorkSelected: false,
      currentWork: ''
    };

  }

  scrollToSectionTop(){
    var node = ReactDOM.findDOMNode(this);
    var elementBox = node.getBoundingClientRect();
    //window.scroll(0, elementBox.top);
  }
  handleSelectWork(e, currentWork){

    ((window.isMobile)?
      Navigator
        .scrollTo(currentWork.id)
      :
      Navigator
        .scrollTo(this.props.section_name)
    )
      .then(()=>{
        this.setState({
          isWorkSelected: true,
          currentWork : currentWork
        })
      })


    this.props.onWorkOpen && this.props.onWorkOpen(e,currentWork);
  }
  handleGoToWork(pid){
    Navigator.scrollTo(pid);
  }
  handleCloseWork(){
    ((window.isMobile)?
      Navigator
        .scrollTo(this.state.currentWork.id)
      :
      Navigator
        .scrollTo(this.props.section_name)
    )
      .then(()=>{
        this.setState({
          isWorkSelected:false,
          currentWork:''
        })
      })

  }

  render(){
    const isSmallScreen = this.windowWidth<800 || this.props.isSmallScreen;

    let opensource = []
    let works = this.props.works.map((work, i)=>{
      let workId = Navigator.genId([this.props.section_name,work.data.title]);
      if(work.data.type.toLowerCase() == 'opensource') {
          if(opensource.length !== 0) opensource.push(<span className="middotDivider"
          key={opensource.length+1}></span>);
          opensource.push(<span
            style={{cursor:'pointer', textDecoration:'underline'}}
            onClick={this.handleGoToWork.bind(this, workId)}
            key={work.data.title+i}>{work.data.title}</span>)
      }
      if(!this.state.isWorkSelected) {
        return (<Work {...work}
          id={workId}
          onClick={this.handleSelectWork.bind(this)}
          key={work.data.title}/>)
      }

      if(this.state.isWorkSelected && this.state.currentWork && work.data.title == this.state.currentWork.title){
        return (<Work {...work}
          id={workId}
          onClose={this.handleCloseWork.bind(this)}
          currentWork = {work.data.title == this.state.currentWork.title}
          isWorkSelected = {this.state.isWorkSelected}
          onClick={this.handleSelectWork.bind(this)}
          key={work.data.title}/>)
        }
      });

    return(<Section
      {...this.props}
      parentName = {this.constructor.displayName || constructor.name || undefined}

      isOpen={this.state.isWorkSelected}
      openItem = {this.state.currentWork}
      fixed_column={<SideBlock {...this.props}>
        <div>
          <div><i className="icon-briefcase" style={{color:'#7fd093'}}/></div>
          <div className="section-title" >Work Experiences</div>
        </div>
        {(!this.state.isWorkSelected)?
        <div className="section-menu-item">
          <div className='inner'>
            <div className='item-anchors'>{opensource}</div>
          </div>
        </div>
          : null
          }
      </SideBlock>
      }
      onCloseItem={this.handleCloseWork.bind(this)}
      >
      <div style={{borderBottom:'5px solid #0C1926', background:'#7fd093'}}>
        <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
          {works}
        </VelocityTransitionGroup>
      </div>
    </Section>)
  }
}
