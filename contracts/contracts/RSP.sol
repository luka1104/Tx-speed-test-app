// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

// 1 = rock, 2 = scissors, 3 = paper

contract RSP {
    uint public player;
    uint public opponent;

    function choose(uint _player, uint _opponent) public payable {
        player = _player;
        opponent = _opponent;

        play();
    }

    function play()
        public
        view
        returns (string memory)
    {

        if(player == opponent) {
            string memory _result = "draw";
            return _result;
        } else if(player == 1 && opponent == 2) {
            string memory _result = "win";
            return _result;
        } else if(player == 2 && opponent == 3) {
            string memory _result = "win";
            return _result;
        } else if(player == 3 && opponent == 1) {
            string memory _result = "win";
            return _result;
        } else {
            string memory _result = "lose";
            return _result;
        }
    }

}