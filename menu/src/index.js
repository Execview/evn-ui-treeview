import React from 'react';
import ReactDOM from 'react-dom';
import Menu from './lib';

const config = {
    options: {horizontal:false, iconsOff: false},
    menu:[
            {
                title: "Google",
                url: "http://google.com",
                icon: "cog",
                style: "danger",
                submenus: [
                    {
                        title: "Gmail",
                        url: "http://gmail.com",
                        icon: "share",
                        submenus:[
                            {
                                title: "Mail",
                                url: "http://mail.google.com",
                                submenus: [
                                    {
                                        title: "Inbox",
                                        url: "http://mail.google.com",
                                        submenus: []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: "seperator"
                    },
                    {
                        title: "Drive",
                        url: "http://drive.google.com",
                        submenus:[]
                    }
                ]
            },
            {
                title: "Facebook",
                url: "http://facebook.com",
                submenus: [
                    {
                        title: "Instagram",
                        url: "http://instagram.com",
                        submenus: []
                    },
                ]
            },
            {
                type: "seperator"
            },
            {
                title: "Yahoo",
                url: "http://yahoo.com",
                disabled: true,
                submenus: []
            }
        ]
}

ReactDOM.render(<div>
                    <div>
                        <Menu config={config}/>
                    </div>
                    <div style={{color:"white"}}>RND</div>
                </div>, document.getElementById('root'));