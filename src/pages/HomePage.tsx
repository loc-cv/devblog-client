import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <main>
      <h1 className="text-4xl font-bold">Home Page</h1>
      <ul>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </ul>
    </main>
  );
};
