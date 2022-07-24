import IdService from './id-service.js'

const idLogic = {
  async createId(key) {
    const idCount = await IdService.getIdAndUpdate(key)
    //const lastId = await IdService.getLastestId()

    // if (lastId.length === 0) {
    //   const myId = await IdService.create({
    //     id: 1,
    //   })

    //   return myId
    // }

    // const newId = parseInt(lastId[0].id) + 1
    // const myId = await IdService.create({
    //   id: newId,
    // })

    return idCount
  },
}

export default idLogic
