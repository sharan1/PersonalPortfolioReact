import React from 'react';
import {Section} from '../Section.jsx';
import {Page} from '../Page.jsx';
var _ = require('lodash');
import {SideBlock} from '../SideBlock.jsx';

export class MiniProjects extends React.Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }
  render(){
    let h = this.props.scrollTop % 360; // Originally was hue 60,43%

    return(<Section {...this.props} 
      parentName = {this.constructor.displayName || constructor.name || undefined}
      fixed_column={<SideBlock {...this.props}><div style={{color:'#fff'}}>
        <div><i className="icon-anchor" style={{color:'#FFC0CB'}}/></div>
      <div className="section-title" >{this.props.title}</div>
    <div className='section-subtitle' dangerouslySetInnerHTML={{__html:this.props.subtitle}}></div>
        </div>
        </SideBlock>
      }
      color={'#FFC0CB'}
      >
      <Page HTMLContent={this.props.body} />

    </Section>)
  }
}
