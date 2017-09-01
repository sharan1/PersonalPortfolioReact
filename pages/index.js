import React from 'react'
import { Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import _ from 'lodash';
import access from 'safe-access';
import { Menu } from '../components/Menu.jsx'
import { MainSlider, WorkList, ProjectList, MiniProjects, EducationList, AboutMe, Contact, Medium, Footer } from '../components/sections';

import { Navigator } from '../utils/navigator.js';
import mobilecheck from '../utils/mobilecheck.js';
// Styles for highlighted code blocks.
import 'css/zenburn.css'


export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.sortedPages = _.sortBy(props.route.pages,
            (page) => access(page, 'data.date')
        ).reverse()

        this.pageGroups = _.groupBy(props.route.pages, 'file.dirname');
        this.pageGroups.root =
            _.mapValues(_.groupBy(this.pageGroups[""], "file.name"), arr => arr[0]);
        delete this.pageGroups[""];
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            menuCloseSection: false
        }


        this.handleResize = this.handleResize.bind(this);
        this.handleScroll = this.handleScroll.bind(this);


    }

    handleSectionOpen(e) {
        this.setState({
            menuCloseSection: true
        });
        //this.props.onSectionOpen && this.props.onSectionOpen(e);
    }



    componentDidMount() {
        Navigator.goToHash(1000, ['home']);
        window.isMobile = mobilecheck();

        this.setState({
            windowWidth: window && window.innerWidth,
            windowHeight: window && window.innerHeight,
        });
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.handleScroll);
    }
    handleResize(e) {
        var newDimensions = {
            windowWidth: window && window.innerWidth,
        };

        if (window.isMobile) {
            newDimensions.windowHeight = this.state.windowHeight || (window && window.innerHeight)
        } else {
            newDimensions.windowHeight = (window && window.innerHeight);
        }

        this.setState(newDimensions);
    }
    handleScroll(event) {
        this.setState({
            scrollTop: event.srcElement.body.scrollTop,
            scrollHeight: event.srcElement.body.scrollHeight,

            activeSection: event.srcElement.body.scrollHeight / event.srcElement.body.scrollTop
        });
    }

    render() {

            let sitemap = [{
                    section: 'home',
                    component: < MainSlider {...this.state }
                    className = 'color-one'
                    icon = 'home' {...this.pageGroups.root.intro.data }
                    />
                },
                {
                    section: 'works',
                    component: < WorkList
                    icon = 'briefcase'
                    className = 'color-two works' {...this.state }
                    works = { this.pageGroups.works }
                    onWorkOpen = { this.handleSectionOpen.bind(this) }
                    />
                },
                {
                    section: 'projects',
                    component: < ProjectList
                    icon = 'energy'
                    className = 'color-three projects' {...this.state }
                    projects = { this.pageGroups.projects }
                    onProjectOpen = { this.handleSectionOpen.bind(this) }
                    />
                },
                {
                    section: 'about-me',
                    component: < AboutMe
                    icon = 'user-follow'
                    className = 'color-five about' {...this.state } {...this.pageGroups.root.about_me.data }
                    />
                },
                {
                    section: 'mini-projects',
                    component: < MiniProjects
                    icon = 'anchor'
                    className = 'color-six' {...this.state } {...this.pageGroups.root.mini_projects.data }
                    />
                },
                {
                    section: 'educations',
                    component: < EducationList
                    icon = 'book-open'
                    className = 'color-four educations' {...this.state }
                    educations = { this.pageGroups.educations }
                    onEducationOpen = { this.handleSectionOpen.bind(this) }
                    />
                },
                /*{
                    section: 'contact',
                    component: < Contact
                    className = 'color-six contact' {...this.state } {...this.pageGroups.root.contact.data }
                    icon = 'call-in' / >
                },*/

            ];
            Navigator.load(sitemap);
            //sortedPages.forEach((page) => {
            return ( < div style = {
                    { position: 'relative' }
                } >
                <
                Menu sections = { sitemap }
                /> {
                sitemap.map(function(item, index) {
                    let el = React.cloneElement(item.component, {
                        key: item.section,
                        section_name: item.section,
                        ref: item.section
                    });

                    return el;
                })
            } < /
            div >


        )
        //  {/*className='color_2'*/}
}
}