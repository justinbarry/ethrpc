"use strict";

var eth_blockNumber = require("../wrappers/eth").blockNumber;
var completeTx = require("../transact/complete-tx");
var waitForNextPoll = require("../transact/wait-for-next-poll");

function checkConfirmations(tx, numConfirmations, callback) {
  return function (dispatch, getState) {
    var minedBlockNumber = parseInt(tx.blockNumber, 16);
    dispatch(eth_blockNumber(function (err, currentBlockNumber) {
      if (err) return callback(err);
      if (getState().debug.tx) {
        console.log("confirmations:", parseInt(currentBlockNumber, 16) - minedBlockNumber);
      }
      if (parseInt(currentBlockNumber, 16) - minedBlockNumber >= numConfirmations) {
        dispatch(completeTx(tx, callback));
      } else {
        dispatch(waitForNextPoll(tx, callback));
      }
    }));
  };
}

module.exports = checkConfirmations;
