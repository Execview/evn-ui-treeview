# Before you start...

Make a config file called "config.json" and fill it with:
```
{
	"@execview/reusable": "../reusable",
	"@execview/table": "../table",
	"@execview/treeview": "../treeview",
	"@execview/grid": "../grid",
	"evn-ui-web": "[Insert relative path to the site here]"
}
```

# How to use

**1.** To run any command in all packages in the config run:

> npm run all [your command here]

This can be used to quickly clean and reinstall all the node_modules. I.e:

> npm run all npm run clean && npm run all npm install

**2.** To setup the components + site for automatically refreshing on dependency changes:

> npm run setup

This deletes the line in react-scripts which prevent this from happening. 

**3.** To begin watching all the modles for changes run:

> npm run watch

or

> npm start

**4.** To publish a package, and install it in the components which depend on it:

> npm run update-cascade [package name here]

This will publish the 'parent' packages and install those in their parents. An update cascade, if you will... 😁.
  



### Things to note ###

- You need to import the version file that gets written everytime a dependency changes.
- Sometimes you need to refresh the page after activating the packagelinker.
- Make sure you specify a package when using the update-cascade command. Choose the lowest level package in the graph that you have changed.
- The package linker will publish the parent packages **as is** so ensure the changes in the working tree are intended.