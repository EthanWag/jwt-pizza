import { expect } from 'playwright-test-coverage';
import type { Page } from '@playwright/test';

enum Role {
    Diner = 'diner',
    Admin = 'admin',
    Franchisee = 'franchisee'
  }
  
  interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    roles: {}[];
  }

async function basicInit(page: Page) {
    let loggedInUser: User | undefined;

    // test users
    const validUsers: Record<string, User> = {
      'd@jwt.com':
      {
        id: '3',
        name: 'Kai Chen', 
        email: 'd@jwt.com', 
        password: 'a', 
        roles: [
          { 
            role: Role.Diner 
          }
        ] 
      },
      'f@jwt.com': 
      {
        id: '2', 
        name: 'fart nugget', 
        email: 'f@jwt.com', 
        password: 'f', 
        roles: [
          {
            role: Role.Diner
          },
          {
            objectId: 1,
            role: Role.Franchisee
          }
        ]
      },
      'a@jwt.com':
      {
        id: '1',
        name: "admin",
        email: "a@jwt.com",
        password: "l",
        roles: [
          {
            role: Role.Admin
          }
        ]
      }
    };
  
    // Authorize login for the given user
    await page.route('*/**/api/auth', async (route) => {
      const loginReq = route.request().postDataJSON();

      if(!loginReq || !loginReq.email || !loginReq.password) {
        await route.fulfill({ status: 200, json: { message: 'logout' } });
        return;
      }

      const user = validUsers[loginReq.email];
      if (!user || user.password !== loginReq.password) {
        await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
        return;
      }

      // if the user is a diner, then we need to treat that output differently than we do with someone that is a franchisee

      loggedInUser = validUsers[loginReq.email];
      const loginRes = {
        user: loggedInUser,
        token: 'abcdef',
      };
      // expect(route.request().method()).toBe('PUT');
      await route.fulfill({ json: loginRes });
    });
  
    // Return the currently logged in user
    await page.route('*/**/api/user/me', async (route) => {
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: loggedInUser });
    });
  
    // A standard menu
    await page.route('*/**/api/order/menu', async (route) => {
      const menuRes = [
        {
          id: 1,
          title: 'Veggie',
          image: 'pizza1.png',
          price: 0.0038,
          description: 'A garden of delight',
        },
        {
          id: 2,
          title: 'Pepperoni',
          image: 'pizza2.png',
          price: 0.0042,
          description: 'Spicy treat',
        },
      ];
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: menuRes });
    });

    await page.route(/\/api\/user\/\d+$/,async (route) => {

      const res  = {
        id: 'A chicken',
        name: 'A chicken',
        email: 'A chicken',
        password: 'A chicken',
        roles: 'A chicken',
      }
      expect(route.request().method()).toBe('PUT');
      await route.fulfill({ json:res})
    });

    // endpoint for getting a users franchises
    await page.route(/\/api\/franchise\/\d+$/, async (route) => {
      const myFranchiseRes = [
          {
              "id": 1,
              "name": "pizzaPocket",
              "admins": [
                  {
                      "id": 3,
                      "name": "pizza franchisee",
                      "email": "f@jwt.com"
                  }
              ],
              "stores": [
                  {
                      "id": 1,
                      "name": "SLC",
                      "totalRevenue": 0.1204
                  },
                  {
                      "id": 2,
                      "name": "Chicago",
                      "totalRevenue": 0.0304
                  },
              ]
          }
      ]

      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: myFranchiseRes });
    });

    await page.route('**/*/api/ user', async (route) => {
      const usersRes = {
          users: [
            {name: 'Taco',email:'taco@mars.com', id: '1', roles:[{role:Role.Diner}]},
            {name: 'pizza boi',email:'fart@nugget.com', id: '2', roles:[{role:Role.Diner}]},
            {name: 'dumb',email:'idiot@stupid.com', id: '3', roles:[{role:Role.Diner}]},
            {name: 'Arthur Morgan',email:'A@Morgan.gov', id: '4', roles:[{role:Role.Franchisee}]},
            {name: 'blue boi',email:'blue@blue.com', id: '5', roles:[{role:Role.Diner}]},
            {name: 'red boi',email:'red@red.com', id: '6', roles:[{role:Role.Diner}]},
            {name: 'yellow boi',email:'y@y.com', id: '7', roles:[{role:Role.Diner}]},
            {name: 'Micah Bell',email:'m@bell.gov', id: '8', roles:[{role:Role.Franchisee}]},
            {name: 'aaaaa',email:'a@a.a', id: '9', roles:[{role:Role.Diner}]},
            {name: 'bbbbb',email:'b@b.b', id: '10', roles:[{role:Role.Diner}]},
            {name: 'ccccc',email:'c@c.c', id: '11', roles:[{role:Role.Diner}]},
            {name: 'ddddd',email:'d@d.d', id: '12', roles:[{role:Role.Diner}]},
            {name: 'eeeee',email:'e@e.e', id: '13', roles:[{role:Role.Diner}]},
            {name: 'fffff',email:'f@f.f', id: '14', roles:[{role:Role.Diner}]},
            {name: 'ggggg',email:'g@g.g', id: '15', roles:[{role:Role.Diner}]},
            {name: 'hhhhh',email:'h@h.h', id: '16', roles:[{role:Role.Diner}]},
          ]
        };

      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: usersRes });
    });
  
    // Standard franchises and stores
    await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
      const franchiseRes = {
        franchises: [
          {
            id: 2,
            name: 'LotaPizza',
            stores: [
              { id: 4, name: 'Lehi' },
              { id: 5, name: 'Springville' },
              { id: 6, name: 'American Fork' },
            ],
          },
          { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
          { id: 4, name: 'topSpot', stores: [] },
        ],
      };
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: franchiseRes });
    });
  
    // Order a pizza.
    await page.route('*/**/api/order', async (route) => {
      const orderReq = route.request().postDataJSON();
      const orderRes = {
        order: { ...orderReq, id: 23 },
        jwt: 'eyJpYXQ',
      };
      // expect(route.request().method()).toBe('POST');
      await route.fulfill({ json: orderRes });
    });
  
    await page.goto('/');
  }

export default basicInit;
