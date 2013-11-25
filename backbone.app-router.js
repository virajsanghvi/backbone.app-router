/**
 * Extended from Backbone.Marionette v0.8.4 to support multiple controllers
 *
 * Distributed under MIT License 
 */
(function (Backbone) {

  Backbone.AppRouter = Backbone.Router.extend({

    constructor: function(options){
      Backbone.Router.prototype.constructor.call(this, options);

      if (this.appRoutes){
        options || (options = {});
        this.defaultController = options.defaultController || 
          this.defaultController || null;
        this.controllers = options.controllers || this.controllers || { null: options.controller};
        this.methodsByRouteIndex = {};
        this.processAppRoutes(this.appRoutes);
      }
    },

    processAppRoutes: function(appRoutes){
      var controller, method, methodName;
      var route, routesLength, i;
      var routes = [];
      var router = this;

      for(route in appRoutes){
        if (appRoutes.hasOwnProperty(route)){
          routes.unshift([route, appRoutes[route]]);
        }
      }

      routesLength = routes.length;
      for (i = 0; i < routesLength; i++){
        route = routes[i][0];
        targets = routes[i][1].split('/');
        controllerName = targets.length > 1 ? targets[0] : this.defaultController;
        controller = this.controllers[controllerName];

        if (!controller){
          var msg = "Controller '" + controllerName + "' was not found in 'controllers'";
          var err = new Error(msg);
          err.name = "NoControllerError";
          throw err;
        }

        methodName = targets.length > 1 ? targets[1] : targets[0];
        method = controller[methodName];
        this.methodsByRouteIndex[routesLength - i - 1] = method;

        if (!method){
          var msg = "Method '" + methodName + "' was not found on the controller";
          var err = new Error(msg);
          err.name = "NoMethodError";
          throw err;
        }

        method = _.bind(method, controller);
        router.route(route, methodName, method);
      }
    }

  });

})(Backbone);

