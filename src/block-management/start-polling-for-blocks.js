"use strict";

var eth_getBlockByNumber = require("../wrappers/eth").getBlockByNumber;
var onNewBlock = require("./on-new-block");
var observeCurrentBlockStateChanges = require("../store-observers/current-block");

function startPollingForBlocks() {
  return function (dispatch, getState) {
    dispatch(observeCurrentBlockStateChanges("currentBlock", function (currentBlock) {
      dispatch(onNewBlock(currentBlock));
    }));
    var newBlockPollingInterval = setInterval(function () {
      if (getState().debug.broadcast) console.log("Polling for latest block...");
      dispatch(eth_getBlockByNumber(["latest", false], function (err, block) {
        if (err) return console.error(err);
        dispatch({ type: "SET_CURRENT_BLOCK", data: block });
      }));
    }, getState().configuration.pollingIntervalMilliseconds);
    dispatch({ type: "SET_NEW_BLOCK_POLLING_INTERVAL", newBlockPollingInterval: newBlockPollingInterval });
  };
}

module.exports = startPollingForBlocks;
