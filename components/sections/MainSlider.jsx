import React from 'react'

var _ = require('lodash');
import {Section} from '../Section';

export class MainSlider extends React.Component{
  constructor(props){
    super(props);

  }

  render(){
    var styles = _.cloneDeep(this.constructor.styles);

    if(this.props.windowWidth<800){
      styles.headMetaBox.textAlign = 'center';
      styles.headMetaBox.width = 'auto';
      styles.headMetaBox.marginLeft = 'auto';
      styles.headMetaBox.borderLeft = 'none';
      styles.container.backgroundSize= 'cover';
      delete styles.headMeta.top;
      styles.headMeta.bottom = 0;
      styles.headMeta.transform = 'translate(-50%,0)';
    }

    return(<Section
      {...this.props}

      >
      <div style={{...styles.container,
       minHeight:this.props.windowHeight}}>
        <div style={styles.overContainer} />
        
      </div>
      <div style={styles.headMeta}>
          <div style={styles.headMetaBox} className='main_heading'>
            <h1 style={{fontSize:'2.4em', lineHeight: '1.3em',color:'white', marginBottom:0}}
                dangerouslySetInnerHTML={{__html:this.props.headline}}></h1>
            <div dangerouslySetInnerHTML={{__html:this.props.body}}
                 style={{fontSize:'1.2em', lineHeight:'1.2em', color:'white'}} />
          </div>
      </div>

      <div style={styles.contactMe}>
          <div style={styles.contactMeBox} className='main_heading'>
            <h1 style={{fontSize:'2.4em', lineHeight: '1em',color:'white', marginBottom:0}}
                dangerouslySetInnerHTML={{__html:this.props.contactHeading}}></h1>
            <div dangerouslySetInnerHTML={{__html:this.props.contactHTML}}
                 style={{fontSize:'1.1em', lineHeight:'1em', color:'white'}} />
          </div>
      </div>

    </Section>)
  }
}
MainSlider.styles = {
  container:{
    position: 'relative',
    width: '40%',
    background:'url(../assets/me2.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize:'100% 100%'
  },
  overContainer:{
    position: 'absolute',
    width:'100%', height:'100%',
    //border: '15px solid rgba(29, 15, 32, 0.43)',
  },
  headMetaBox:{
    padding: 10,
    color: '#d0d0d0',
    borderLeft: '1px solid lightblue',
    borderRight: '1px solid lightblue',
    //background:'rgba(0, 0, 0, 0.51)'

  },
  headMeta:{
    position: 'absolute',
    top: '58%',
    marginLeft: '57.5%',
    transform: 'translate(-50%,-50%)',
    width: '35%',

  },
  contactMe:{
    position: 'absolute',
    top: '58%',
    marginLeft: '87%',
    transform: 'translate(-50%,-50%)',
    width: '25%',
  },
  contactMeBox:{
    padding: 10,
    color: '#d0d0d0',
    //background:'rgba(0, 0, 0, 0.51)'

  },
}
