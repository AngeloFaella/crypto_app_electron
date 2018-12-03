const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const axios = require('axios');
const ipc = electron.ipcRenderer;

// Bitcoin
const notifyBtn = document.getElementById('notifyBtn');
const price = document.getElementById('price');
const targetPrice = document.getElementById('targetPrice');
const indicator = document.getElementById('btc-indicator');
// Ethereum
const notifyBtnEth = document.getElementById('eth-notifyBtn');
const priceEth = document.getElementById('eth-price');
const targetPriceEth = document.getElementById('eth-targetPrice');
const indicatorEth = document.getElementById('eth-indicator');

const imgUp = '../assets/images/up.png';
const imgDown = '../assets/images/down.png';
let targetPriceVal = 0; //BTC
let targetPriceEthVal = 0; //ETH
let currentBTC = 0;
let currentETH = 0;
const notification = {
  title: 'BTC alert',
  body: 'BTC just beat your target price'
}

// get price
const getBTC = () => {
  axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=EUR')
  .then(res => {
    console.log('getBTC: price respose');
    const cryptos = res.data.BTC.EUR;
    price.innerHTML = '€ '+cryptos.toLocaleString('it');

    if(Number(cryptos) > currentBTC) indicator.setAttribute('src',imgUp);
    if(Number(cryptos) < currentBTC) indicator.setAttribute('src',imgDown);
    currentBTC = Number(cryptos);

    if(Number(targetPriceVal)!=0 && Number(cryptos) >= Number(targetPriceVal)){
      const myNotification = new Notification(notification.title, notification);
    }
  });
};

const getETH = () => {
  axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH&tsyms=EUR')
  .then(res => {
    console.log('getETH: price respose');
    const cryptos = res.data.ETH.EUR;
    priceEth.innerHTML = '€ '+cryptos.toLocaleString('it');

      if(Number(cryptos) > currentETH) indicator.setAttribute('src',imgUp);
      if(Number(cryptos) < currentETH) indicator.setAttribute('src',imgDown);
      currentETH = Number(cryptos);

    if(Number(targetPriceEth)!=0 && Number(cryptos) >= Number(targetPriceEth)){
      const myNotification = new window.Notification(notification.title, notification);
    }
  });
};

// request price
getBTC();
getETH();
setInterval(getBTC,10*1000);
setInterval(getETH, 10*1000);

// display target value
ipc.on('targetPriceVal', (e, arg) => {
  targetPriceVal = Number(arg);
  if(targetPriceVal > 0)
    targetPrice.innerHTML = 'Target: € '+targetPriceVal.toLocaleString('it');
})

// display target value ETH
ipc.on('targetPriceEth', (e, arg) => {
  targetPriceEthVal = Number(arg);
  if(targetPriceEthVal > 0)
    targetPriceEth.innerHTML = 'Target: € '+targetPriceEthVal.toLocaleString('it');
})

// create Target window
let win;
const createPopup = (event) => {
  if(win != null) return; //una solo istanza

  const modalPath = path.join('file://',__dirname,'add.html');
  win = new BrowserWindow({width:420, height:330, frame:false, resizable:false, alwaysOnTop:true, backgroundColor:'#DFDFDF'});

  //win.loadFile('add.html');
  win.on('close',() => { win=null } );
  win.loadURL(modalPath);
  win.show()
};

notifyBtn.addEventListener('click',createPopup);
