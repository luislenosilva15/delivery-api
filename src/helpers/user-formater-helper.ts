import { User } from 'src/user/entities/user.entity';

export const userFormaterHelper = (user: User) => {
  const baseUrl =
    'https://qorqohjcceinufpyspag.supabase.co/storage/v1/object/public/user/';

  delete user.password;

  return {
    ...user,
    imageUrl: user.imageUrl ? `${baseUrl}${user.imageUrl}` : null,
  };
};
