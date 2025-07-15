| Route                     | Method | Access         | Description                       |
|---------------------------|--------|----------------|-----------------------------------|
| /signup                   | POST   | Public         | User signup                       |
| /signin                   | POST   | Public         | User signin                       |
| /signout                  | POST   | Public         | User signout                      |
| /user/forgot-password     | POST   | Public         | Forgot password                   |
| /user/reset-password      | POST   | Public         | Reset password                    |
| /update-profile           | POST   | USER           | Update profile                    |
| /me                       | GET    | USER/ADMIN/... | Get current user info             |
| /admin/signin             | POST   | Public         | Admin signin                      |
| /admin/create             | POST   | SUPER_ADMIN    | Create a new admin user           |
| /admin/list               | GET    | SUPER_ADMIN    | Get all admin users               |



