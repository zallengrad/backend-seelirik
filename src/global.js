let broadcast = () => {}; 

function setBroadcast(fn) {
  broadcast = fn;
}

function getBroadcast() {
  return broadcast;
}

module.exports = {
  setBroadcast,
  getBroadcast,
};
