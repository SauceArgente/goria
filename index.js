#!/usr/bin/env node

const { readFileSync, writeFileSync, fstat, readdir, mkdir, existsSync } = require("fs")
const { parse } = require("path")
var parser = require("parse5")
const Mustache = require("mustache");
const prettify = require('html-prettify');
const cssbeautify = require("cssbeautify");
const utf8 = require('utf8');
const pathj = require("path")
var parseArgs = require('minimist')

var ressourcesPath = process.cwd()+"/src/"
var buildPath = process.cwd()+"/public/"
var cssPath = buildPath + "build/build.css"
var finalCss = ""

console.log("Goria CLI")
var args = parseArgs(process.argv)

if(args.d != undefined) {
    ressourcesPath = process.cwd()+args.d
}
if(args.o != undefined) {
    buildPath = process.cwd()+args.o
}
console.log("Input folder   :" + ressourcesPath)
console.log("Output folder :" + buildPath)

console.log("Parsing / Rendering")
transformDirectory("")
console.log("Done!")

module.exports = transformData

String.prototype.removeTag = function(tag) {
    return this.replace("<"+tag+">").replace("</"+tag+">")
}

function writeCss() {
    writeFileSync(cssPath,cssbeautify(finalCss))
}

function transformDirectory(path) {
    globalPath = ressourcesPath + path
    if(path == ""){
        if(! existsSync(buildPath)){
            mkdir(buildPath)
        }
    }
    readdir(globalPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            if(file.split(".").length > 1){
                let globalDocPath = globalPath + file
                let docData = readFileSync(globalDocPath,"utf-8")
                writeFileSync(buildPath + path + file.split(".")[0]+".html",transformData(docData))
                //console.log(file); 
            }else{
                let buildDirPath = buildPath + pathj.join(path,file)
                if(! existsSync(buildDirPath)){
                    mkdir(buildDirPath, (err) => { 
                        if (err) { 
                            return console.error(err); 
                        } 
                        transformDirectory(path + "" +file + "/")
                        //console.log('Directory created successfully!'); 
                    });

                }else{
                    transformDirectory(path + "" +file + "/")
                }
            }
            
        });
    });
    
}

var transformData = (data,vars)=>{
    var properties = {script:{},body:"",head:"",style:""}
    
    if(vars != undefined){
        properties.script = vars   
    }
    var documentData = data
    var ast = parser.parseFragment(documentData).childNodes

    function parseScript(content) {
        content = content.replace("${",'${properties.script.')
                .replace("$","this.")
                .replace("\n","")
                .toString()
        let declarations = content.split(";")
        declarations.forEach(decl=>{
            let split = []
            split[0] = decl.substring(0,decl.indexOf(':'))
            .replace("\n","")
            split[1] = decl.substring(decl.indexOf(':')+1)
            let key = split[0].replace(/ /g,'')
            if(key != ""){
                let evaled = eval(split[1])

                this[key] = evaled
                properties.script[key] = evaled
            }
        })
    }

    ast.forEach(element => {
        let serialized = parser.serialize(element)
        switch(element.nodeName){
            case "ghead":
                properties.head += serialized.removeTag("ghead")
            case "script":
                serialized = serialized.removeTag("script")
                parseScript(serialized)
                break;
            case "global-style":
                finalCss += serialized.removeTag("css");
                break;
            case "style":
                properties.style += serialized
                break;
            case "content":
                properties.body = serialized.removeTag("content")
            default:
                /*
                if(element.nodeName != "#text"){
                    properties.body += "<"+element.nodeName+">" + serialized + "</"+element.nodeName+">"
                }else{
                    properties.body += "\n" + serialized
                }*/
                break;
        }
    });

    var finalData = Mustache.render(properties.body,properties.script)
    var finalHead = Mustache.render(properties.head,properties.script)
    var finalTree = `
    <!DOCTYPE html>
    <html>
        <head>
            ${finalHead}
            <link rel="stylesheet" href="./build/bundle.css">
            <style>
                ${properties.style}
            </style>
        </head>
        <body>
            ${finalData}
        </body>
    </html>
    `
    let prettified = prettify(finalTree)
    prettified = utf8.decode(prettified)
    prettified.replace("&#x2F;","/")
    return prettified
}
/*
transformFile("index")
writeCss()
*/