/*
 * cylon-skynet adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

require('./cylon-skynet');

var SkynetLib = require('skynet');
var namespace = require('node-namespace');

namespace("Cylon.Adaptors", function() {
  this.Skynet = (function(klass) {
    subclass(Skynet, klass);

    function Skynet(opts) {
      var extraParams;
      if (opts == null) {
        opts = {};
      }
      Skynet.__super__.constructor.apply(this, arguments);
      extraParams = opts.extraParams || {};
      this.uuid = extraParams.uuid;
      this.token = extraParams.token;
      this.host = extraParams.host || "http://skynet.im";
      this.portNumber = extraParams.portNumber || 80;
    }

    Skynet.prototype.commands = function() {
      return ['message', 'subscribe'];
    };

    Skynet.prototype.connect = function(callback) {
      var _this = this;
      this.connector = SkynetLib.createConnection({
        "uuid": this.uuid,
        "token": this.token,
        "host": this.host,
        "port": this.portNumber
      });

      this.connector.on('ready', function() {
        Logger.info("Connecting to adaptor '" + _this.name + "'...");
        callback(null);
        return _this.connection.emit('connect');
      });

      this.connector.on('message', function(data) {
        _this.connection.emit('message', data);
      });
    };

    Skynet.prototype.message = function(data) {
      return this.connector.message(data);
    };

    Skynet.prototype.subscribe = function(data) {
      return this.connector.subscribe(data);
    };

    return Skynet;

  })(Cylon.Adaptor);
});