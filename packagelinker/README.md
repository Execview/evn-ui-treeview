# Before you start...

Make a config file called "config.json" and fill it with:
```
{
	"@execview/reusable": "../reusable",
	"@execview/table": "../table",
	"@execview/treeview": "../treeview",
	"evn-ui-web": "[Insert relative path to the site here]"
}
```

# How to use

**1.** To run any command in all packages in the config run:

> npm run all [your command here]

This can be used to quickly clean and reinstall all the node_modules. I.e:

> npm run all npm run clean && npm run all npm install

**2.** To create or remove the npm links please run:

> npm run link-modules

> npm run unlink-modules

**3.** To begin watching all the modles for changes run:

> npm run watch
  



### Things to note ###

This will force all modules to use one copy of react. This was to fix issues with hooks. The version used is the version of the last module in the config. 