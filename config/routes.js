/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/

  'POST /api/v1/register': 'Users/create',
  'POST /api/v1/login': 'Users/login',
  'GET /api/v1/code': 'Users/code',
  'POST /api/v1/setcode/': 'Users/setCode',
  'POST /api/v1/setVideo': 'Users/setVideo',
  'POST /api/v1/checkcode': 'Users/checkCode',
  'GET /api/v1/logincode/:code': 'Users/loginCode',
  'POST /email/send/welcome': 'Users/sendemail',

};
