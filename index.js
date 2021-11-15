const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')

const node = await Libp2p.create({
    modules: {
        transport: [TCP]
    }
})

