import { INewUser, ROLE, User } from "@/types";
import { avatars } from "../../config";
import { supabase } from "../../supabase/connect";
import { bcryptComparePassword, bcryptPasswordHash } from "../../utils";
import { Mahasiswa } from "@/lib/react-query/auth/authQueries";

export const createMahasiswa = async (user: Mahasiswa) => {
  try {
    const { data: newUser, error } = await supabase
      .from("Mahasiswa")
      .insert([
        {
          nama: user?.nama,
          nim: user?.nim
        },
      ])
      .select();

    if (error) {
      console.error("Error saving user to DB:", error);
      return;
    }

    return newUser;

  } catch (error) {
    console.log(error);
    return error;
  }
};

export const createUserAccount = async (user: INewUser) => {
  try {
    const avatarUrl = avatars.getInitials(user.name);

    const { data: newAccount, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    if (error) {
      console.error("Error sign up user:", error);
      return;
    }

    const newUser = await saveUserToDB({
      authId: newAccount.user?.id!,
      name: user.name,
      email: newAccount.user?.email!,
      password: user.password,
      departement: user.departement,
      imageUrl: avatarUrl.toString(),
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const saveUserToDB = async (user: {
  authId: string;
  email: string;
  name: string;
  password: string;
  imageUrl: string;
  departement: string;
}) => {
  try {
    let hashedPassword = await bcryptPasswordHash(user?.password)

    const { data: newUser, error } = await supabase
      .from("Users")
      .insert([
        {
          authId: user?.authId,
          email: user?.email,
          name: user?.name,
          departement: user?.departement,
          imageUrl: user?.imageUrl,
          role: ROLE.USER,
          password: hashedPassword,
        },
      ])
      .select();

    if (error) {
      console.error("Error saving user to DB:", error);
      return;
    }

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(`Error: ${error}`);
  }
};

export const checkRegisteredUser = async (user: {
  email: string;
}) => {
  try {
    const { email } = user;

    let { data: registeredUser } = await supabase
      .from("Users")
      .select("*")
      .or(`email.eq.${email}`);

    return registeredUser;
  } catch (error) {
    console.log(error);
  }
};

export const signInAccount = async (user: {
  email: string;
  password: string;
}) => {
  try {
    const { email, password } = user;

    let { data: registeredUser, error } = await supabase
      .from("Users")
      .select("*")
      .eq("email", email);

    if (error || registeredUser?.length === 0) throw new Error("Email tidak valid")

    if (registeredUser) {
      const comparePassword = await bcryptComparePassword(password, registeredUser[0].password!)

      if (!comparePassword) throw new Error("Email atau password tidak valid");

      const session = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return session;
    } {
      throw new Error("Email tidak ditemukan");
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAccount = async () => {
  try {
    const currentAccount = await supabase.auth.getSession();
    console.log(currentAccount, "currentAccount");

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    // Checking user from table Users, based on Authentication User
    let { data: currentUser, error } = await supabase
      .from("Users")
      .select("*")
      .eq("authId", currentAccount?.data?.session?.user?.id!)
      .returns<User[]>()

    if (!currentUser || error) throw Error;

    return currentUser[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const signOutAccount = async () => {
  try {
    const session = await supabase.auth.signOut();

    return session;
  } catch (error) {
    console.log(error);
    throw new Error(`Error: ${error}`);
  }
};


export const getUserById = async (userId: string) => {
  try {

    let { data: currentUser, error } = await supabase
      .from("Users")
      .select("*")
      .eq("id", userId)
      .returns<User[]>()

    if (!currentUser || error) throw Error;

    return currentUser[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {

    let { data: allUsers, error } = await supabase
      .from("Users")
      .select("*")
      .order("name", {
        ascending: true
      })
      .returns<User[]>()

    if (!allUsers || error) throw Error;

    return allUsers
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllDepartments = async () => {
  try {

    let { data: allDepts, error } = await supabase
      .from("Departement")
      .select("*")
      .order("name", {
        ascending: true
      })

    if (!allDepts || error) throw Error;

    return allDepts
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteUserById = async ({ userId, authId }: { userId: string, authId: string }) => {
  try {

    if (!userId || !authId) return null

    let { error, data: userData } = await supabase
      .from("Users")
      .delete()
      .eq("id", userId)

    let { error: authErr, data: authData } = await supabase
      .auth
      .admin
      .deleteUser(authId)

    if (!userData || error || authErr || !authData) throw Error;

    return userData[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};


export const updateUserById = async ({
  id,
  name,
  departement,
  email,
  position,
  NIK,
  status,
  role
}: {
  id: string,
  name: string,
  departement: string,
  email: string,
  position: string,
  NIK: number,
  status: string,
  role: string,
}) => {
  try {

    const { data: currentUser, error } = await supabase
      .from('Users')
      .update({
        name: name,
        departement: departement,
        email: email,
        position: position,
        NIK: NIK,
        status: status,
        role: role
      })
      .eq('id', id);

    if (!currentUser || error) throw Error;
    console.log(currentUser, 'updateById')

    return currentUser[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};
