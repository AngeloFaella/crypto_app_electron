const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron')

  // Mantiene un riferimento globale all'oggetto window, se non lo fai, la finestra sarà
  // chiusa automaticamente quando l'oggetto JavaScript sarà garbage collected.
  let win

  function createWindow () {
    // Creazione della finestra del browser.
    win = new BrowserWindow({ width: 860, height: 400, minWidth:860, minHeight: 400, backgroundColor: '#262626'})

    // e viene caricato il file index.html della nostra app.
    win.loadFile('src/index.html')

    // Apre il Pannello degli Strumenti di Sviluppo.
    win.webContents.openDevTools()

    // Eseguito quando la finestra viene chiusa.
    win.on('closed', () => {
      // Eliminiamo il riferimento dell'oggetto window;
      win = null
    })

    // crea menù
    const menu = Menu.buildFromTemplate([
      {
        label: 'Menu',
        submenu: [
          {label: 'CoinMarketCap', click(){shell.openExternal('http://coinmarketcap.com')}},
          {type: 'separator'},
          {label: 'Exit', click() {app.quit()}}
        ]
      },
      {
        label: 'info',
        submenu: [{label: 'Developed by Angelo Faella'}]
      }
    ]);
    Menu.setApplicationMenu(menu);
  }

  // Questo metodo viene chiamato quando Electron ha finito
  // l'inizializzazione ed è pronto a creare le finestre browser.
  app.on('ready', createWindow)

  // Terminiamo l'App quando tutte le finestre vengono chiuse.
  app.on('window-all-closed', () => {
    // Su macOS è comune che l'applicazione e la barra menù
    // restano attive finché l'utente non esce espressamente tramite i tasti Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // Su macOS è comune ri-creare la finestra dell'app quando
    // viene cliccata l'icona sul dock e non ci sono altre finestre aperte.
    if (win === null) {
      createWindow()
    }
  })

  //send target price to index
  ipcMain.on('update-notify-value', (e, arg) => {
    win.webContents.send('targetPriceVal',arg);
  });
  ipcMain.on('update-notify-value-eth', (e, arg) => {
    win.webContents.send('targetPriceEth',arg);
  })
