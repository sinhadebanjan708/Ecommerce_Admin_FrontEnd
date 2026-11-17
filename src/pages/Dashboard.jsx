import { useSelector } from "react-redux";

export default function Dashboard() {
  const user = useSelector((state) => state.auth.loggedInUser);

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <div className="card">
          <p>
            <b>Name:</b> {user.firstName} {user.lastName}
          </p>
          <p>
            <b>Username:</b> {user.username}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
