import React from 'react';
import ReactDOM from 'react-dom';
import TreeViewMain from './lib';

const root = {
    type: "activity",
    data: {
        from: {value: "2018.11.24", validation: /^\s*((?:19|20)\d{2})\.(1[012]|0?[1-9])\.(3[01]|[12][0-9]|0?[1-9])\s*$/, hidden: true},
        to: "2019.12.01"
    },
    nodes: [
        {
            type: "project",
            data: {
                from: "2018.11.24",
                to: "2019.12.01",
                kad: "mad",
                ram: "sam"
            }
        },
        {
            type: "project",
            data: {
                from: "2018.11.24",
                to: "2019.12.01",
                status: "red"
            },
        },
        {
            type: "project",
            data: {
                from: "2018.11.24",
                to: "2019.12.01"
            },
            nodes: [
                {
                    type: "subproject",
                    data: {
                        from: "2018.11.24",
                        to: "2019.12.01",
                        dat: "kat1"
                    },
                    nodes: [
                        {
                            type: "subproject",
                            data: {
                                from: "2018.11.24",
                                to: "2019.12.01",
                                dat: "kat2"
                            },
                            nodes: [
                                {
                                    type: "subproject",
                                    nodes: [
                                        {
                                            type: "subproject",
                                            data: {
                                                from: {value: "2018.11.24", validation: /^\s*((?:19|20)\d{2})\.(1[012]|0?[1-9])\.(3[01]|[12][0-9]|0?[1-9])\s*$/},
                                                to: "2019.12.01",
                                                dat: "kat4",
                                                mat: "rat",
                                                nat: "bat",
                                                hat: "nat"
                                            },
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

ReactDOM.render(<TreeViewMain root={root}/>, document.getElementById('root'));