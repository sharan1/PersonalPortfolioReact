import React from 'react';
import ReactDOM from 'react-dom'
import access from 'safe-access';
var _ = require('lodash');
import {Motion, spring, presets} from 'react-motion';
import {slugify} from '../utils/strings.js';
import {Navigator} from '../utils/navigator.js';
import {ReadingIndicator} from './ReadingIndicator';

class DataBox extends React.Component{
  render(){
    return <div className='data-block'>
      <span className='data-block-title'><b>
        {this.props.title.toUpperCase()+ ': '}</b></span>
      <span className='data-block-content'>{(typeof this.props.content=== 'string')
              ? this.props.content
              : this.props.content.join(', ')}</span>
      </div>
  }
}

class EducationSidebar extends React.Component{
  render(){
    return <div>
      test
      </div>
  }
}

export class Education extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      mouseEvent:false
    }
  }
  componentDidMount(){
    var node = ReactDOM.findDOMNode(this);
    this.elementBox=node.getBoundingClientRect();
    this.elementHeight = node.clientHeight;
  }
  componentWillUpdate(){
    var node = ReactDOM.findDOMNode(this);
    this.elementBox=node.getBoundingClientRect();
    this.elementHeight = node.clientHeight;
  }
  handleClick(e){
    //this.props.onClick(e, this.props.data);
    let { url, title } = this.props.data;

    if(url) {
      ga('send', 'event', {
        eventCategory: 'Outbound Link',
        eventAction: 'click',
        eventLabel: url,
        transport: 'beacon'
      });

      var win = window.open(url, '_blank');
      win.focus();
        return ;
    }else {
      ga('send', 'event', {
        eventCategory: 'Open Education',
        eventAction: 'click',
        eventLabel: title
      });

      this.props.onClick(e, {id:this.props.id, ...this.props.data})
    }



  }
  handleMouseEnter(e){
    if(this.props.currentEducation) return;

    this.setState({
      mouseEvent:'hover',
      activeArea:e.nativeEvent.target.getBoundingClientRect()
    })
  }
  handleMouseLeave(e){
    this.setState({mouseEvent:'out', event:e, xFactor:0, yFactor:0})
  }

  render(){
    let {title, tagline, degree, major,
          cgpa, roles, concentration,year, 
          header_image_small, header_background_color, header_background_size,
          chapters} = this.props.data;
    var styles = _.cloneDeep(this.constructor.styles);

    if(!this.props.currentEducation){
      styles.educationBox.cursor = 'pointer'
    }
    styles.header.backgroundSize = header_background_size || styles.header.backgroundSize;

    let educationZTranslation = 0;
    if(this.state.mouseEvent =='hover'){
      educationZTranslation = 40;
    }
    let educationCardTransformation = (value)=>{
      let t = '';

      t = 'translateZ(-'+value.x+'px) ';
        // +'rotateX('+this.state.xFactor*50+'deg) '+
        // 'rotateY('+this.state.yFactor*50+'deg)';

      return t;
    }
    return(<div id={this.props.id}
            style={styles.educationPlaceholder}

            onMouseEnter={this.handleMouseEnter.bind(this)}
            onMouseLeave={this.handleMouseLeave.bind(this)}
            onTouchStart={this.handleMouseEnter.bind(this)}
            onTouchEnd={this.handleMouseLeave.bind(this)}
            >

            <Motion defaultStyle={{x: 0}} style={{x: spring(educationZTranslation)}}>
              {value =>
          <div style={{
              transform: educationCardTransformation(value),
              }}>

            <div style={styles.dataContainer}>
              <div
                style={{backgroundImage:header_image_small,
                  backgroundColor:header_background_color,...styles.header,
                  }}
                  onClick = {(e)=>{
                    if(this.props.currentEducation) return;
                    this.handleMouseLeave(e);
                    this.handleClick(e);
                  }}
                />
              <div style={styles.metaBox}
                onClick = {(e)=>{
                  if(this.props.currentEducation) return;
                  this.handleMouseLeave(e);
                  this.handleClick(e);
                }}
                >
                <h3 style={styles.title}>{tagline}</h3>
                {(degree)?<DataBox title='Degree' content={degree}/>:null}
                {(major)?<DataBox title='Major' content={major}/>:null}
                {(concentration)?<DataBox title='Concentration' content={concentration}/>:null}
                {(cgpa)?<DataBox title='CGPA' content={cgpa}/>:null}
                {(year)?<DataBox title='Graduation' content={year}/>:null}
                {(roles)?<DataBox title='Roles' content={roles}/>:null}

              </div>
              <div style={styles.educationBody}>
              {
                (this.props.currentEducation)
                ? <div
                dangerouslySetInnerHTML={{__html:body}}></div>
              : null
              }

              </div>
              {
                (this.props.currentEducation)?
                <footer style={styles.footer} onClick={()=>{this.props.onClose()}}>
                <i className='icon-arrow-left' /> Return to other Education
              </footer>
              : null
            }
          </div>
        </div>
      }</Motion>

      </div>
    )
}
}

Education.styles = {
  educationPlaceholder:{
    // width: '33%',
    perspective: 600,
    width: '100%',

  },
  educationBox:{
    color: 'grey',
    // paddingRight:25,
    overflow:'hidden'
  },
  metaBox: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  educationBody:{
    padding: 10,
    paddingLeft:20,
    paddingRight: 20,
  },
  footer:{
    cursor: 'pointer',
    padding: 30,
    marginTop: 30,
    backgroundColor:'#f0f0f0',
    clear:'both',
  //  borderTop: '1px dashed #ccc'
  textAlign: 'center',
    backgroundImage: 'linear-gradient(to right, #adadad 70%, rgba(255,255,255,0) 0%)',
    backgroundPosition: 'top left',
    backgroundSize: '15px 1px',
    backgroundRepeat: 'repeat-x'
  },
  dataContainer:{
    //boxShadow: '5px 0 6px #c8c8c8',
    backgroundColor: 'white',

    //padding: 10,
    paddingTop:0, paddingRight: 0
  },
  header:{
    minHeight: 400,
    backgroundSize: 'contain',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat'
  },
  headerImage:{

  },
  title:{
    color:'black',
    marginBottom:10
  }
}
