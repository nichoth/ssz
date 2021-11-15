const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const { NOISE } = require('libp2p-noise')
const MPLEX = require('libp2p-mplex')
const { multiaddr } = require('multiaddr')

const Gossipsub = require('libp2p-gossipsub')

const main = async () => {
    const node = await Libp2p.create({
        addresses: {
            // add a listen address (localhost) to accept TCP
            // connections on a random port
            listen: ['/ip4/127.0.0.1/tcp/0']
        },
        modules: {
            transport: [TCP],
            connEncryption: [NOISE],
            streamMuxer: [MPLEX]
        }
    })

    // start libp2p
    await node.start()
    console.log('libp2p has started')
    // print out listening addresses
    console.log('listening on addresses:')
    node.multiaddrs.forEach(addr => {
        console.log(`${addr.toString()}/p2p/${node.peerId.toB58String()}`)
    })

    const gsub = new Gossipsub(node)
    await gsub.start()
    console.log('gsub started')
    gsub.on('fruit', ev => console.log('got fruit', ev))
    gsub.subscribe('fruit')
    gsub.publish('fruit', new TextEncoder().encode('banana'))

    // ping peer if received multiaddr
    if (process.argv.length >= 3) {
      const ma = multiaddr(process.argv[2])
      console.log(`pinging remote peer at ${process.argv[2]}`)
      gsub.publish('fruit', new TextEncoder().encode('banana'))
      const latency = await node.ping(ma)
      console.log(`pinged ${process.argv[2]} in ${latency}ms`)
    } else {
      console.log('no remote peer address given, skipping ping')
    }



}

main()

