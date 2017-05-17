

export default class CustomIPC {
    constructor() {
        this.event = null
        this.send = this.send
    }
    setEvent(event) {
        this.event = event
        this.send('window-listener', 'Main process ready')
    }
    send(type, args) {
        console.log(type, args)
        this.event.sender.send(type, args)
    }
}

