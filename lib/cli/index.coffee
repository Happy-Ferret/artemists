#+--------------------------------------------------------------------+
#| artemis.coffee
#+--------------------------------------------------------------------+
#| Copyright DarkOverlordOfData (c) 2015
#+--------------------------------------------------------------------+
#|
#| This file is a part of Artemis
#|
#| Artemis is free software; you can copy, modify, and distribute
#| it under the terms of the MIT License
#|
#+--------------------------------------------------------------------+
#
# artemis command dispatch
#

Object.defineProperties module.exports,

  init:  # initialize the artemis ecs project
    get: ->
      require('./init.coffee').run

  generate: # generate entity extensions
    get: ->
      require('./generate.coffee').run

  create: # create entity/component/system
    get: ->
      require('./create.coffee').run

