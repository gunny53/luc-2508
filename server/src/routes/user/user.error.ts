import { ForbiddenException, UnprocessableEntityException } from '@nestjs/common'

export const UserAlreadyExistsException = new UnprocessableEntityException([
  {
    message: 'Error.UserAlreadyExists',
    path: 'email'
  }
])

export const CannotUpdateAdminUserException = new ForbiddenException('Error.CannotUpdateAdminUser')

export const CannotDeleteAdminUserException = new ForbiddenException('Error.CannotDeleteAdminUser')

// English content normalized from the original source text.
export const CannotSetAdminRoleToUserException = new ForbiddenException('Error.CannotSetAdminRoleToUser')

export const RoleNotFoundException = new UnprocessableEntityException([
  {
    message: 'Error.RoleNotFound',
    path: 'roleId'
  }
])

// English content normalized from the original source text.
export const CannotUpdateOrDeleteYourselfException = new ForbiddenException('Error.CannotUpdateOrDeleteYourself')
