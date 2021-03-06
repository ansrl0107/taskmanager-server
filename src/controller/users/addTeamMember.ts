import { APIGatewayProxyHandler } from 'aws-lambda'
import { Team, User } from '../../entity'
import { error, success, funcToHandler } from '../../util'

interface Body {
  name: string
  email: string
  password: string
  teamId: string
}
const addTeamMember: APIGatewayProxyHandler = async (event) => {
  const { body } = event
  const { name, email, password, teamId } = body as unknown as Body
  const team = await Team.findOne(teamId)
  if (!team) {
    return error('NOT_FOUND', 'TEAM_NOT_FOUND')
  }
  const exUser = await User.findOne({ where: { email } })
  if (exUser) {
    return error('BAD_REQUEST', 'USER_EXIST')
  }
  const user = new User()
  user.id = email.split('@')[0]
  user.name = name
  user.email = email
  user.password = password
  user.team = team
  await user.save()

  return success({ user })
}

export const handler = funcToHandler(addTeamMember)
