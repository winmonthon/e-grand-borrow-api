import UserService from '../service/user-service.js'

const UserFinder = async (userType, clinicId) => {
  let found = []
  const allUserInThisRole = await UserService.getAllUser({ userType })

  for (let user of allUserInThisRole) {
    for (let clinic of user.clinicList) {
      if (clinic.clinicId === clinicId) {
        found.push(user)
      }
    }
  }

  return found
}

export default UserFinder
