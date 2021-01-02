# Goria Mustache Templating

## What is Goria ?
Goria is a fast and easy to use templating tool  based off Mustache, for creating static sites faster !

Just to clarify one thing, Goria is **not a js framework** nor an interactive site compiler like Svelte;
It does have a similar syntax to svelte, and it is a "compiler", but the key difference is that Goria renders your template and then saves it to a static html file. It won't make the data / ui update in real time.

**But** if you want to use it as a templating engine ( the goria express templating engine is coming soon ) like php you can of course use the **JS api instead of the CLI**

# CLI Usage
First run `npm i goria -g`
Then run `goria` or `goria -d <input folder> -o <output folder>`
Just typing goria will export and render everything in the "public" directory.

# Api Usage
If you want to use goria for let's say an express app as a templating engine, use the coding api.

    const goria = require("goria")
The only function you need to know in order to use goria as a parge as an api is `transformData(mustache_data,variables--optional)`
The mustache data is the html file's data and the variables ( optional ) is the the variables that you want to be injected.

# Syntax

## How does it work ?
This is a typical goria template, let's look at a basic index.html:

    <ghead>
    	<title>{{company_name}}</title>
    </ghead>
    
    <script>
    company_name: "GitHabit";
    greetings: 'Welcome to '  + $company_name;
    staff:
    [
    	"Some Guy",
    	"Another Person",
    	"I don't know"
    ];
    </script>
    
    <global-style> 
        body{
    	    margin: 0px;
        }
    </global-style>
    
    <style>
    	body{
    	    background-color: aliceblue;
        }
    </style>
    
    <content>
       <h1>Our staff</h1>
    	    {{#staff}}
    		    <h3>{{.}}</h3>
    	    {{/staff}}
    </content>

You might notice some differences from usual js / mustache implementations ( if you don't know what mustache is you can check their website ) . 
## Data structuring
In goria data is structured in a simple way :

    variable_name : value ; <- this is important

## Js Expressions
You might ask yourself how to put some more complex expressions,, such as math, strings and vars, here's how to do it

    name : "Sawcce";
    message : "Hey " + $name;
Goria uses the $ to declare scoped variables, meaning if you say $name it will get the name var in the template and name will get the name var in the index.js


