#!/usr/bin/env coffee
###
 * Artemis code generation
 *
 * emulate the partial class strategy for extensions
 * used by artemis_CSharp
 *
###
fs = require('fs')
mkdirp = require('mkdirp')
config = require("#{process.cwd()}/artemis.json")

module.exports =
#
# create a new entity, component or system
#
# @param  [String]  type to create
# @param  [Array<String>]  remaining arguments
# @return none
#
  run: (type, name, args...) ->

    switch type
      when '-e' or '--entity'
        create.entity(name, args...)

      when '-c' or '--component'
        create.component(name, args...)

      when '-s' or '--system'
        create.system(name, args...)

      when '-x' or '--extension'
        create.extension(name, args...)


###
 *
 * Create E/C/S
 *
###
create =
  entity:(name) ->
    config.entities[name] = true
    fs.writeFileSync("#{process.cwd()}/artemis.json", JSON.stringify(config, null, 2))

  component:(name, args...) ->
    args = if args.length is 0 then false else args
    config.components[name] = args
    fs.writeFileSync("#{process.cwd()}/artemis.json", JSON.stringify(config, null, 2))

  system:(name, args...) ->
    config.systems[name] = true
    fs.writeFileSync("#{process.cwd()}/artemis.json", JSON.stringify(config, null, 2))
    template = systemTemplate(name, args)
    mkdirp.sync "#{process.cwd()}/#{config.src}/systems"
    fs.writeFileSync("#{process.cwd()}/#{config.src}/systems/#{name}.ts", template)

    # update the project
    tsconfig = JSON.parse(fs.readFileSync("#{process.cwd()}/tsconfig.json", 'utf8'))
    if tsconfig.files.indexOf("#{config.src}/systems/#{name}.ts") is -1
      tsconfig.files.push "#{config.src}/systems/#{name}.ts"
      fs.writeFileSync("#{process.cwd()}/tsconfig.json", JSON.stringify(tsconfig, null, 2))

  extension:(name, method, args...) ->
    config.extensions = config.extensions || {}
    config.extensions[name] = config.extensions[name] || {}
    config.extensions[name][method] = args
    fs.writeFileSync("#{process.cwd()}/artemis.json", JSON.stringify(config, null, 2))



systemTemplate = (name, interfaces) ->
  sb = [] # StringBuilder

  sb.push "module #{config.namespace} {"
  sb.push ""
  sb.push "  import Pool = artemis.Pool;"
  sb.push "  import Group = artemis.Group;"
  sb.push "  import Entity = artemis.Entity;"
  sb.push "  import Matcher = artemis.Matcher;"
  sb.push "  import Exception = artemis.Exception;"
  sb.push "  import TriggerOnEvent = artemis.TriggerOnEvent;"
  for iface in interfaces
    sb.push "  import #{iface} = artemis.#{iface};"
  sb.push ""
  sb.push "  export class #{name} implements #{interfaces.join(', ')} {"

  sb.push ""
  for iface in interfaces
    switch iface
      when 'ISetPool'
        sb.push "    protected pool:Pool;"

  sb.push ""
  for iface in interfaces
    switch iface
      when 'IMultiReactiveSystem'
        sb.push "    public get triggers():TriggerOnEvent[] {"
        sb.push "    }"
        sb.push "    "
        sb.push "    public execute(entities:Array<Entity>) {"
        sb.push "    }"
        sb.push "    "

      when 'IReactiveSystem'
        sb.push "    public get trigger():TriggerOnEvent {"
        sb.push "    }"
        sb.push "    "
        sb.push "    public execute(entities:Array<Entity>) {"
        sb.push "    }"
        sb.push "    "

      when 'IExecuteSystem'
        sb.push "    public execute() {"
        sb.push "    }"
        sb.push "    "

      when 'IInitializeSystem'
        sb.push "    public initialize() {"
        sb.push "    }"
        sb.push "    "

      when 'IEnsureComponents'
        sb.push "    public get ensureComponents():IMatcher {"
        sb.push "    }"
        sb.push "    "

      when 'IExcludeComponents'
        sb.push "    public get excludeComponents():IMatcher {"
        sb.push "    }"
        sb.push "    "

      when 'IClearReactiveSystem'
        sb.push "    public get clearAfterExecute():boolean {"
        sb.push "    }"
        sb.push "    "

      when 'ISetPool'
        sb.push "    public setPool(pool:Pool) {"
        sb.push "      this.pool = pool;"
        sb.push "    }"
        sb.push "    "

  sb.push ""
  sb.push ""
  sb.push "  }"
  sb.push "}"
  sb.join('\n')


