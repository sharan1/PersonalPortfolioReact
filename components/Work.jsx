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
      <span className='data-block-title'> <b>
        {this.props.title.toUpperCase()+ ': '}</b></span>
      <span className='data-block-content'>{(typeof this.props.content=== 'string')
              ? this.props.content
              : this.props.content.join(', ')}</span>
      </div>
  }
}

class WorkSidebar extends React.Component{
  render(){
    return <div>
      test
      </div>
  }
}

export class Work extends React.Component{
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
        eventCategory: 'Open Work',
        eventAction: 'click',
        eventLabel: title
      });

      this.props.onClick(e, {id:this.props.id, ...this.props.data})
    }



  }
  handleMouseEnter(e){
    if(this.props.currentWork) return;

    this.setState({
      mouseEvent:'hover',
      activeArea:e.nativeEvent.target.getBoundingClientRect()
    })
  }
  handleMouseLeave(e){
    this.setState({mouseEvent:'out', event:e, xFactor:0, yFactor:0})
  }

  render(){
    let {title, company, body, job_title,
          duration, job_desc, place, technologies,
          header_image_small, header_background_color, header_background_size,
          chapters} = this.props.data;
    var styles = _.cloneDeep(this.constructor.styles);

    if(!this.props.currentWork){
      styles.workBox.cursor = 'pointer'
    }
    styles.header.backgroundSize = header_background_size || styles.header.backgroundSize;
    let workZTranslation = 0;
    if(this.state.mouseEvent =='hover'){
      workZTranslation = 40;
    }
    let workCardTransformation = (value)=>{
      let t = '';

      t = 'translateZ(-'+value.x+'px) ';

      return t;
    }
    return(<div id={this.props.id}
            style={styles.workPlaceholder}

            onMouseEnter={this.handleMouseEnter.bind(this)}
            onMouseLeave={this.handleMouseLeave.bind(this)}
            onTouchStart={this.handleMouseEnter.bind(this)}
            onTouchEnd={this.handleMouseLeave.bind(this)}
            >

            <Motion defaultStyle={{x: 0}} style={{x: spring(workZTranslation)}}>
              {value =>
          <div style={{
              transform: workCardTransformation(value),
              }}>

            <div style={styles.dataContainer}>
              <div
                style={{backgroundImage:header_image_small,
                  backgroundColor:header_background_color,...styles.header,
                  }}
                  onClick = {(e)=>{
                    if(this.props.currentWork) return;
                    this.handleMouseLeave(e);
                    this.handleClick(e);
                  }}
                />
              <div style={styles.metaBox}
                onClick = {(e)=>{
                  if(this.props.currentWork) return;
                  this.handleMouseLeave(e);
                  this.handleClick(e);
                }}
                >
                <h3 style={styles.title}>{company}</h3>
                {(place)?<DataBox title='Location' content={place}/>:null}
                {(job_title)?<DataBox title='Job Title' content={job_title}/>:null}
                {(duration)?<DataBox title='Start/End Date' content={duration}/>:null}
                {(job_desc)?<DataBox title='Job Description' content={job_desc}/>:null}
                {(technologies)?<DataBox title='Technologies' content={technologies}/>:null}

              </div>
              <div style={styles.workBody}>
                {}
              {
                (this.props.currentWork)
                ? <div
                dangerouslySetInnerHTML={{__html:body}}></div>
              : null
              }

              </div>
              {
                (this.props.currentWork)?
                <footer style={styles.footer} onClick={()=>{this.props.onClose()}}>
                <i className='icon-arrow-left' /> Return to other work expeiences
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

Work.styles = {
  workPlaceholder:{
    perspective: 600,
    width: '100%',

  },
  workBox:{
    color: 'grey',
    overflow:'hidden'
  },
  metaBox: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  workBody:{
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
  textAlign: 'center',
    backgroundImage: 'linear-gradient(to right, #adadad 70%, rgba(255,255,255,0) 0%)',
    backgroundPosition: 'top left',
    backgroundSize: '15px 1px',
    backgroundRepeat: 'repeat-x'
  },
  dataContainer:{
    backgroundColor: 'white',
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
