import React from 'react';
import logo from './logo.svg';
import './App.css';
import apiHandler from './api/apiHandler';
import { User } from './api/classes/user.class';

async function test() {
  let role = await apiHandler.roleService.create({
    name: 'tetete',
    icon: 'patate',
    permissionLevel: 0
  });
  console.log(role);

  //console.log(await apiHandler.roleService.get(role.id));
}

async function test2() {
  let role = await apiHandler.register({
    name: 'test',
    email: 'test@mail.com',
    password: 'test',
    roleId: '5ddaab2e9ec7fc272b378dfd',
    gender: 0
  });
  console.log(role);
}

async function test3() {
  /*
  let users = (await apiHandler.userService.find({
    query: { email: 'test@mail.com' }
  })) as User[];

  console.log(users);

  let game = await apiHandler.gameService.create({
    users,
    creator: users[0],
    actualTurn: 0,
    displayId: 'test',
    maxDifficulty: 5,
    maxHotLevel: 4,
    name: 'patate',
    nbTurns: 100,
    questionTypes: []
  });

  console.log(game);
  */
}

async function test4() {
  let users = (await apiHandler.userService.find({
    query: { email: 'test@mail.com' }
  })) as User[];
  console.log(users);

  let users2 = await apiHandler.userService.find({
    query: {
      _id: { $in: users.map(u => u.id) }
    }
  });
  console.log(users2);
}

const App: React.FC = () => {
  /*

  */
  test4();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
