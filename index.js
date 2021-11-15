const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const { NOISE } = require('libp2p-noise')

const node = await Libp2p.create({
    modules: {
        transport: [TCP],
        connEncryption: [NOISE]
    }
})

