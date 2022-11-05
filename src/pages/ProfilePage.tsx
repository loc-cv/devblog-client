import { usersApiSlice } from 'features/users/usersApiSlice';

export const ProfilePage = () => {
  const { data: currentUser } =
    usersApiSlice.endpoints.getCurrentUser.useQueryState();

  return (
    <div>
      <h1 className="text-4xl font-bold">Profile Page</h1>
      <section>
        <h2>
          {currentUser?.firstName} {currentUser?.lastName}
        </h2>
      </section>
    </div>
  );
};

export default ProfilePage;
