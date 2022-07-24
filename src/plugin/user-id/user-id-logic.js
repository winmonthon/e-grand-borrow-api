import UserIdService from './user-id-service.js'

const UserLogic = {
  async createUserId() {
    const lastId = await UserIdService.getLastestId()

    if (lastId.length === 0) {
      const myId = await UserIdService.create({
        id: 1,
      })

      return myId
    }

    const newId = parseInt(lastId[0].id) + 1
    const myId = await UserIdService.create({
      id: newId,
    })

    return myId
  },
}

export default UserLogic
