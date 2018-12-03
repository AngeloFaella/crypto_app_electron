const electron = require('electron');
const path = require('path');
const remote = electron.remote;
const ipc = electron.ipcRenderer;

const closeBtn = document.getElementById('closeBtn');
const currency = document.getElementById('currency');

const closeWindow = () => {
  let win = remote.getCurrentWindow();
  win.close();
}

closeBtn.addEventListener('click', (event) => {
  closeWindow();
})

const updateBtn = document.getElementById('updateBtn');
updateBtn.addEventListener('click',(event) =>{
  const val = document.getElementById('notifyVal').value;
  const coin = currency.options[currency.selectedIndex].value;
  //console.log('selected: '+coin);

  if(coin === 'BTC') ipc.send('update-notify-value', val);
  else ipc.send('update-notify-value-eth', val);
  closeWindow();
})
