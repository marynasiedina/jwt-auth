import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import { Context } from ".";
import LoginForm from "./components/LoginForm";
import UserService from "./services/UserService";
import { IUser } from "./models/response/IUser";

const App: FC = () => {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  const getUsers = async () => {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  if (store.isLoading) {
    return <div>...loading</div>;
  }

  if (!store.isAuth) {
    return (
      <div>
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="App">
      <h1>{store.isAuth ? "Пользователь авторизован" : "Авторизуйтесь!"}</h1>
      <button onClick={getUsers}>Get Users</button>
      <button onClick={() => store.logout()}>LogOut</button>
      <div>
        {users.map((e, index) => (
          <div key={index}>{e.email}</div>
        ))}
      </div>
    </div>
  );
};

export default observer(App);
