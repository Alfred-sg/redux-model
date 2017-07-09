"use strict";

import React, { isValidElement } from "react";
import { render } from "react-dom";
import * as Redux from "redux";
import { Provider } from "react-redux";
import invariant from 'invariant';

import { querySelector, isHTMLElement } from "./utils";
import eventReducer from "./model/reducers/eventReducer";
import { injectReducer } from "./model/reducer";
import publishModel from "./model/publishModel";

export default function createApp(){

  let app = {
  	_router: null,
  	model,
  	router,
  	start
  };

  function createStore(){
    let initReducer = injectReducer(eventReducer);
    let store = Redux.createStore(initReducer,{});
    return store;
  };

  let store = createStore();

  /**
   * 数据模型model订阅stroe
   * @param  {[type]} names [description]
   * @return {[type]}       [description]
   */
  function subscribeStore(names){
	if ( Array.isArray(names) ){
	  names.map(name => {
  	    publishModel(name,store);
      });
    } else if ( typeof names === "string" ){
	  publishModel(names,store);
    };
  };

  /**
   * 数据模型model订阅stroe
   * @param  {[type]} names [description]
   * @return {[type]}       [description]
   */
  function model(names){
    if ( typeof names === "function" ){
	  names = names();
    };

    subscribeStore(names);
  };

  function router(Router){
  	if ( isValidElement(Router) ){
  	  this._router = () => Router;
  	} else {
  	  this._router = Router;
  	}
  };

  function getProvider(router) {
    return (
      <Provider store={store}>
        { router() }
      </Provider>
    );
  };

  function start(container){
    // support selector
    if (typeof container === 'string') {
      container = querySelector(container);
      invariant(container, `app.start: could not query selector: ${container}`);
    }

    invariant(!container || isHTMLElement(container), 'app.start: container should be HTMLElement');
    invariant(this._router, 'app.start: router should be defined');

    render(getProvider(this._router),container);
  };

  return app;
};
